const express = require("express");
const http = require("http");
const { database } = require("./config");
const { webSockets, save } = require("./controller");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const client = process.env.CLIENT_URL;
const io = new Server(server, {
    cors: {
      origin: client,
    }
});
const interval = +process.env.INTERVAL || 10 * 60 * 1000;

app.get('/', (_, res) => res.redirect(client));

io.on("connection", webSockets);

(
    async () => {
        try {
            await database();
            const port = process.env.PORT;
            server.listen(port, () => {
                console.log(`DEBUG: Server listening on http://localhost:${port}`)
                setInterval(save, interval);
            });
        } catch (error) {
            console.error(error);
        }
    }
)();