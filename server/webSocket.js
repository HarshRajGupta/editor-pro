const mongoose = require('mongoose');
const Document = require("./models/document");

const hashMap = new Map();

const webSockets = async (socket) => {
    console.log(`WS: User connected to ${socket.id}`)
    socket.on('request', async data => {
        console.log(`WS: request ${data.docId}`)
        try {
            if (!data.docId || !mongoose.Types.ObjectId.isValid(data.docId)) {
                console.log(`WS: Document ID not provided`)
                await socket.emit("response", {
                    success: false,
                    message: 'Document does not exist'
                })
                return await socket.disconnect()
            }
            const document = await Document.findById(data.docId);
            if (!document) {
                console.log(`WS: Document ${data.docId} does not exist`)
                await socket.emit("response", {
                    success: false,
                    message: 'Document does not exist'
                })
                return await socket.disconnect()
            }
            if (!document.openToAll && !document.users.find(email => email.toLowerCase() === data.userEmail.toLowerCase())) {
                await socket.emit("response", {
                    success: false,
                    message: 'Access Denied'
                })
                return await socket.disconnect()
            }
            await socket.broadcast.to(data.docId).emit("user-joined", data.userEmail)
            console.log(`WS: ${data.userEmail} joined ${data.docId}`)
            if (hashMap.has(data.docId)) {
                document.data = hashMap.get(data.docId).data;
            }
            await socket.emit("response", {
                success: true,
                message: 'Document fetched',
                document: document
            })
            await socket.join(data.docId);
            await socket.on("receive-changes", async (delta) => {
                try {
                    console.log(`WS: ${data.userEmail} updated ${data.docId} at ${delta.timestamp}`)
                    if (!hashMap.has(data.docId) || hashMap.get(data.docId).timestamp < delta.timestamp) {
                        hashMap.set(data.docId, {
                            data: delta.data,
                            timestamp: delta.timestamp
                        });
                        await socket.broadcast.to(data.docId).emit("receive", delta.data)
                    }
                } catch (e) {
                    console.log(`WS: error while receiving ${data.docId}`)
                    console.error(e)
                    await socket.emit("response", {
                        success: false,
                        message: 'Something went wrong'
                    })
                    return await socket.disconnect()
                }
            })
            socket.on("disconnect", async () => {
                console.log(`WS: ${data.userEmail} disconnected from ${data.docId}`)
                return await socket.broadcast.to(data.docId).emit("user-left", data.userEmail)
            })
        } catch (e) {
            console.log(`WS: error while fetching ${data.docId}`)
            console.error(e)
            await socket.emit("response", {
                success: false,
                message: 'Bad request'
            })
            return await socket.disconnect()
        }
    })
}

const saveDocuments = async () => {
    console.log(`DEBUG: Saving Documents`)
    try {
        for (const [key, value] of hashMap) {
            const document = await Document.findById(key);
            if (document) {
                document.data = value.data;
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