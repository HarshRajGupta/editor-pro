const express = require("express");
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { Server } = require('socket.io');
const http = require('http');
require("dotenv").config();

const connectDB = require('./database');
const ApiRouter = require('./routes');
const { webSockets, saveDocuments } = require('./webSocket');

const app = express();

app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(express.static('view'));

app.get('/', (req, res) => {
	res.status(200).sendFile(path.join(__dirname, 'view', 'index.html'));
})
app.use('/api', ApiRouter)

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: process.env.CLIENT_URL
	}
});
io.on("connection", webSockets)

const port = process.env.PORT || 4000;
const start = async () => {
	try {
		await connectDB();
		server.listen(port, async () => {
			console.log(`DEBUG: Server listening on http://localhost:${port}`)
			await setInterval(saveDocuments, 60000);
		});
	} catch (error) {
		console.log(`ERROR: while starting server`)
		console.error(error);
		process.exit(1);
	}
};

start();