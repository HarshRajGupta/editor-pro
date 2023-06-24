const mongoose = require('mongoose');
const Document = require("./models/document");

const hashMap = new Map();

function webSockets(socket) {
    console.log(`WS: User connected to ${socket.id}`)
    socket.on('request', async data => {
        console.log(`WS: request ${data.docId}`)
        try {
            if (!data.docId || !mongoose.Types.ObjectId.isValid(data.docId)) {
                console.log(`WS: Document ID not provided`)
                socket.emit("response", {
                    success: false,
                    message: 'Document does not exist'
                })
                return socket.disconnect()
            }
            const document = await Document.findById(data.docId);
            if (!document) {
                console.log(`WS: Document ${data.docId} does not exist`)
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
            console.log(`WS: ${data.userEmail} joined ${data.docId}`)
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
                    console.log(`WS: ${data.userEmail} updated ${data.docId}`)
                    socket.broadcast.to(data.docId).emit("receive", delta)
                } catch (e) {
                    console.log(`WS: error while receiving ${data.docId}`)
                    console.error(e)
                    socket.emit("response", {
                        success: false,
                        message: 'Something went wrong'
                    })
                    return socket.disconnect()
                }
            })
            socket.on("disconnect", () => {
                console.log(`WS: ${data.userEmail} disconnected from ${data.docId}`)
                return socket.broadcast.to(data.docId).emit("user-left", data.userEmail)
            })
        } catch (e) {
            console.log(`WS: error while fetching ${data.docId}`)
            console.error(e)
            socket.emit("response", {
                success: false,
                message: 'Bad request'
            })
            return socket.disconnect()
        }
    })
}

const saveDocuments = async () => {
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

module.exports = {
    webSockets,
    saveDocuments
};