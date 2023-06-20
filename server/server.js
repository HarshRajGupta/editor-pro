const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')
const { Server } = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');
require("dotenv").config();

const connectDB = require('./db');
const authRouter = require('./routes/auth')
const documentRouter = require('./routes/document')
const Document = require("./models/document");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const url = process.env.CLIENT_URL || "*";
app.use(
	cors({
		credentials: true,
		origin: url,
	})
);

app.use('/api/auth', authRouter)
app.use('/api/document', documentRouter)

const hashMap = new Map();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: url
	}
});

io.on("connection", socket => {
	console.log(`IO: User connected to ${socket.id}`)
	socket.on('request', async data => {
		console.log(`IO: request ${data.docId}`)
		try {
			if (!data.docId || !mongoose.Types.ObjectId.isValid(data.docId)) {
				console.log(`IO: Document ID not provided`)
				socket.emit("response", {
					success: false,
					message: 'Document does not exist'
				})
				return socket.disconnect()
			}
			const document = await Document.findById(data.docId);
			if (!document) {
				console.log(`IO: Document ${data.docId} does not exist`)
				socket.emit("response", {
					success: false,
					message: 'Document does not exist'
				})
				return socket.disconnect()
			}
			if (!document.openToAll) {
				const permit = document.users.find(email => email === data.userEmail);
				if (!permit) {
					socket.emit("response", {
						success: false,
						message: 'Access Denied'
					})
					return socket.disconnect()
				}
			}
			socket.broadcast.to(data.docId).emit("user-joined", data.userEmail)
			console.log(`IO: ${data.userEmail} joined ${data.docId}`)
			if (hashMap.has(data.docId)) {
				document.data = hashMap.get(data.docId);
			}
			socket.emit("response", {
				success: true,
				message: 'Document fetched',
				document: document
			})
			socket.join(data.docId);
			socket.on("receive-changes", delta => {
				try {
					hashMap.set(data.docId, delta.data);
					console.log(`IO: ${data.userEmail} updated ${data.docId}`)
					socket.broadcast.to(data.docId).emit("receive", delta)
				} catch (e) {
					console.log(`IO: error while receiving ${data.docId}`)
					console.error(e)
					socket.emit("response", {
						success: false,
						message: 'Something went wrong'
					})
					return socket.disconnect()
				}
			})
			socket.on("disconnect", () => {
				console.log(`IO: ${data.userEmail} disconnected from ${data.docId}`)
				return socket.broadcast.to(data.docId).emit("user-left", data.userEmail)
			})
		} catch (e) {
			console.log(`IO: error while fetching ${data.docId}`)
			console.error(e)
			socket.emit("response", {
				success: false,
				message: 'Bad request'
			})
			return socket.disconnect()
		}
	})
})

const saveStack = async () => {
	console.log(`DEBUG: Saving Documents`)
	try {
		for (const [key, value] of hashMap) {
			const document = await Document.findById(key);
			if (document) {
				document.data = value;
				await document.save();
				console.log(`DEBUG: Document ${document._id} saved`)
			}
		}
		hashMap.clear();
	} catch (e) {
		console.log(`ERROR: while saving document`)
		console.error(e);
		hashMap.clear();
	}
}

const indexPage = require('./template')
app.get('/', (req, res) => {
	try {
		console.log("GET /");
		return res.send(indexPage);
	} catch (e) {
		return res.send(e)
	}
});

const port = process.env.PORT || 4000;
const start = async () => {
	try {
		await connectDB();
		server.listen(port, async () => {
			console.log(`DEBUG: Server listening on http://localhost:${port}`)
			await setInterval(saveStack, 60000);
		});
	} catch (error) {
		console.log(`ERROR: while starting server`)
		console.error(error);
	}
};

start();