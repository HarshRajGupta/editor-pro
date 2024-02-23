const mongoose = require("mongoose");
const Document = require("./models/document");
const User = require("./models/user");

const hashMap = new Map();

const getDoc = async ({ docId, userEmail }) => {
  try {
    const document = await Document.findById(docId);
    if (!document) return await Promise.reject("Document does not exist");
    if (
      document.openToAll ||
      document.users.find((email) => userEmail.toLowerCase() === email)
    )
      return await Promise.resolve(document);
    if ((await User.findOne({ email: userEmail.toLowerCase() }))?.isAdmin)
      return await Promise.resolve(document);
    return await Promise.reject("Access Denied");
  } catch (e) {
    return await Promise.reject(e);
  }
};

const webSockets = async (socket) => {
  console.log(`WS: User connected to ${socket.id}`);
  socket.on("request", async (data) => {
    console.log(`WS: request ${data.docId}`);
    try {
      if (!data.docId || !mongoose.Types.ObjectId.isValid(data.docId))
        throw "Invalid document id";
      const document = await getDoc(data);
      await socket.to(data.docId).except(socket.id).emit("user-joined", data.userEmail);
      if (hashMap.has(data.docId)) document.data = hashMap.get(data.docId).data;
      await socket.emit("response", {
        success: true,
        message: "Document fetched",
        document: document,
      });
      await socket.join(data.docId);
      await socket.on("receive-changes", async (delta) => {
        try {
          console.log(`WS: Changes from ${data.userEmail} received`);
          if (
            !hashMap.has(data.docId) ||
            hashMap.get(data.docId).timestamp < delta.timestamp
          ) {
            hashMap.set(data.docId, {
              data: delta.data,
              timestamp: delta.timestamp,
            });
            await socket.to(data.docId).except(socket.id).emit("receive", delta.data);
            console.log(`WS: Changes from ${data.userEmail} saved`);
          }
        } catch (error) {
          throw error;
        }
      });
      await socket.on("disconnect", async () => {
        await socket.to(data.docId).except(socket.id).emit("user-left", data.userEmail);
        return await socket.disconnect();
      });
    } catch (e) {
      console.error(`WS: `, e);
      await socket.emit("response", {
        success: false,
        message: e,
      });
      return await socket.disconnect();
    }
  });
};

const saveDocuments = async () => {
  console.log(`DEBUG: Saving Documents`);
  for (const [key, value] of hashMap) {
    await Document.findById(key)
      .catch((e) => {
        console.error(`ERROR: while fetching ${key} document `, e);
      })
      .then(async (document) => {
        const { data, timestamp } = value;
        setTimeout(async () => {
          document.data = data;
          await document
            .save()
            .catch((e) =>
              console.error(`ERROR: while saving ${key} document `, error),
            )
            .then(() => {
              if (hashMap.get(key).timestamp <= timestamp) hashMap.delete(key);
              console.log(`DEBUG: Document ${document._id} saved`);
            });
        }, 0);
      });
  }
  Promise.resolve("Documents saved");
};

module.exports = {
  webSockets,
  saveDocuments,
};
