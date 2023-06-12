const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')
const { Server } = require('socket.io');
const http = require('http');
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
            if (!data.docId) {
                console.log(`IO: Document ID not provided`)
                return socket.disconnect();
            }
            const document = await Document.findById(data.docId);
            if (!document) {
                console.log(`IO: Document ${data.docId} does not exist`)
                return socket.emit("response", {
                    success: false,
                    message: 'Document does not exist'
                })
            }
            const permit = document.users.find(email => email === data.userEmail);
            if (!permit) {
                return socket.emit("response", {
                    success: false,
                    message: 'Access Denied'
                })
            }
            if (permit) {
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
                    }
                })
                socket.on("disconnect", () => {
                    console.log(`IO: ${data.userEmail} disconnected from ${data.docId}`)
                    socket.broadcast.to(data.docId).emit("user-left", data.userEmail)
                })
            }
        } catch (e) {
            console.log(`IO: error while fetching ${data.docId}`)
            console.error(e)
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

const indexPage = `<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>Editor-Pro</title>
	<meta http-equiv="refresh" content="2; url = ${url}" />
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
	<style>
		* {
			border: 0;
			box-sizing: border-box;
			margin: 0;
			padding: 0;
		}

		:root {
			--hue: 223;
			--bg: hsl(var(--hue), 90%, 90%);
			--fg: hsl(var(--hue), 90%, 10%);
			--primary: hsl(var(--hue), 90%, 50%);
			--trans-dur: 0.3s;
			font-size: calc(16px + (32 - 16) * (100vw - 320px) / (2560 - 320));
		}

		body {
			color: var(--fg);
			display: flex;
			font: 1em/1.5 sans-serif;
			height: 100vh;
			transition:
				background-color var(--trans-dur),
				color var(--trans-dur);
		}

		.bike {
			display: block;
			margin: auto;
			width: 16em;
			height: auto;
		}

		.bike__body,
		.bike__front,
		.bike__handlebars,
		.bike__pedals,
		.bike__pedals-spin,
		.bike__seat,
		.bike__spokes,
		.bike__spokes-spin,
		.bike__tire {
			animation: bikeBody 3s ease-in-out infinite;
			stroke: var(--primary);
			transition: stroke var(--trans-dur);
		}

		.bike__front {
			animation-name: bikeFront;
		}

		.bike__handlebars {
			animation-name: bikeHandlebars;
		}

		.bike__pedals {
			animation-name: bikePedals;
		}

		.bike__pedals-spin {
			animation-name: bikePedalsSpin;
		}

		.bike__seat {
			animation-name: bikeSeat;
		}

		.bike__spokes,
		.bike__tire {
			stroke: currentColor;
		}

		.bike__spokes {
			animation-name: bikeSpokes;
		}

		.bike__spokes-spin {
			animation-name: bikeSpokesSpin;
		}

		.bike__tire {
			animation-name: bikeTire;
		}

		/* Dark theme */
		@media (prefers-color-scheme: dark) {
			:root {
				--bg: hsl(var(--hue), 90%, 10%);
				--fg: hsl(var(--hue), 90%, 90%);
			}
		}

		/* Animations */
		@keyframes bikeBody {
			from {
				stroke-dashoffset: 79;
			}

			33%,
			67% {
				stroke-dashoffset: 0;
			}

			to {
				stroke-dashoffset: -79;
			}
		}

		@keyframes bikeFront {
			from {
				stroke-dashoffset: 19;
			}

			33%,
			67% {
				stroke-dashoffset: 0;
			}

			to {
				stroke-dashoffset: -19;
			}
		}

		@keyframes bikeHandlebars {
			from {
				stroke-dashoffset: 10;
			}

			33%,
			67% {
				stroke-dashoffset: 0;
			}

			to {
				stroke-dashoffset: -10;
			}
		}

		@keyframes bikePedals {
			from {
				animation-timing-function: ease-in;
				stroke-dashoffset: -25.133;
			}

			33%,
			67% {
				animation-timing-function: ease-out;
				stroke-dashoffset: -21.991;
			}

			to {
				stroke-dashoffset: -25.133;
			}
		}

		@keyframes bikePedalsSpin {
			from {
				transform: rotate(0.1875turn);
			}

			to {
				transform: rotate(3.1875turn);
			}
		}

		@keyframes bikeSeat {
			from {
				stroke-dashoffset: 5;
			}

			33%,
			67% {
				stroke-dashoffset: 0;
			}

			to {
				stroke-dashoffset: -5;
			}
		}

		@keyframes bikeSpokes {
			from {
				animation-timing-function: ease-in;
				stroke-dashoffset: -31.416;
			}

			33%,
			67% {
				animation-timing-function: ease-out;
				stroke-dashoffset: -23.562;
			}

			to {
				stroke-dashoffset: -31.416;
			}
		}

		@keyframes bikeSpokesSpin {
			from {
				transform: rotate(0);
			}

			to {
				transform: rotate(3turn);
			}
		}

		@keyframes bikeTire {
			from {
				animation-timing-function: ease-in;
				stroke-dashoffset: 56.549;
				transform: rotate(0);
			}

			33% {
				stroke-dashoffset: 0;
				transform: rotate(0.33turn);
			}

			67% {
				animation-timing-function: ease-out;
				stroke-dashoffset: 0;
				transform: rotate(0.67turn);
			}

			to {
				stroke-dashoffset: -56.549;
				transform: rotate(1turn);
			}
		}
	</style>

</head>

<body>
	<svg class="bike" viewBox="0 0 48 30" width="48px" height="30px">
		<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1">
			<g transform="translate(9.5,19)">
				<circle class="bike__tire" r="9" stroke-dasharray="56.549 56.549" />
				<g class="bike__spokes-spin" stroke-dasharray="31.416 31.416" stroke-dashoffset="-23.562">
					<circle class="bike__spokes" r="5" />
					<circle class="bike__spokes" r="5" transform="rotate(180,0,0)" />
				</g>
			</g>
			<g transform="translate(24,19)">
				<g class="bike__pedals-spin" stroke-dasharray="25.133 25.133" stroke-dashoffset="-21.991"
					transform="rotate(67.5,0,0)">
					<circle class="bike__pedals" r="4" />
					<circle class="bike__pedals" r="4" transform="rotate(180,0,0)" />
				</g>
			</g>
			<g transform="translate(38.5,19)">
				<circle class="bike__tire" r="9" stroke-dasharray="56.549 56.549" />
				<g class="bike__spokes-spin" stroke-dasharray="31.416 31.416" stroke-dashoffset="-23.562">
					<circle class="bike__spokes" r="5" />
					<circle class="bike__spokes" r="5" transform="rotate(180,0,0)" />
				</g>
			</g>
			<polyline class="bike__seat" points="14 3,18 3" stroke-dasharray="5 5" />
			<polyline class="bike__body" points="16 3,24 19,9.5 19,18 8,34 7,24 19" stroke-dasharray="79 79" />
			<path class="bike__handlebars" d="m30,2h6s1,0,1,1-1,1-1,1" stroke-dasharray="10 10" />
			<polyline class="bike__front" points="32.5 2,38.5 19" stroke-dasharray="19 19" />
		</g>
	</svg>
	<!-- partial -->

</body>

</html>
`
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