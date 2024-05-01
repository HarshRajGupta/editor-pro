const crypto = require('crypto');
require("dotenv").config();
const File = require("../model/file");
const cypherKey = crypto.scryptSync(process.env.CYPHER_KEY, 'salt', 32);
const iv = Buffer.alloc(16, 0);
const hashMap = new Map();

const encrypt = (data) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', cypherKey, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

const decrypt = (data) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', cypherKey, iv);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const defaultData = require("../defaultData.json").map(({ id, code }) => ({ id, data: encrypt(code) }));

const findOrCreate = async ({ id, type }) => {
    try {
        if (!id)
            return await Promise.reject("invalid file");
        return await File.findOne({ documentId: id }).then(
            async (file) => {
                if (file)
                    return file;
                return await File.create(
                    { documentId: id, data: defaultData.find(def => def.id === type).data }
                )
            }
        )
    } catch (e) {
        return await Promise.reject(e);
    }
}

const save = async () => {
    console.log(`DEBUG: Saving Files`);
    for (const [id, value] of hashMap) {
        await File.findOne({ documentId: id })
            .catch((e) => {
                console.error(`ERROR: while fetching ${id} File `, e);
            })
            .then(async (file) => {
                const { data, timestamp } = value;
                setTimeout(async () => {
                    file.data = data;
                    await file.save().catch((e) =>
                        console.error(`ERROR: while saving ${id} document `, error),
                    ).then(() => {
                        if (hashMap.get(id).timestamp <= timestamp)
                            hashMap.delete(id);
                        console.log(`DEBUG: Document ${id} saved`);
                    });
                }, 0);
            });
    }
    Promise.resolve("Files saved");
};

const webSockets = async (socket) => {
    console.log(`WS: User connected to ${socket.id}`);
    socket.on("request", async (params) => {
        console.log(`WS: request ${params.id}`);
        try {
            const file = await findOrCreate(params);
            await socket.to(params.id).emit("joined", params.email);
            if (hashMap.has(params.id)) file.data = hashMap.get(params.id).data;
            socket.emit("response", {
                success: true,
                message: "Document fetched",
                data: file.data ? decrypt(file.data) : "",
                timestamp: params.timestamp || Date.now()
            });
            await socket.join(params.id);
            await socket.on("client_to_server", async ({ data, timestamp }) => {
                try {
                    console.log(`WS: Changes from ${params.email} received`);
                    if (
                        !hashMap.has(params.id) ||
                        hashMap.get(params.id).timestamp < timestamp
                    ) {
                        hashMap.set(params.id, {
                            data: encrypt(data),
                            timestamp: timestamp,
                        });
                        socket.to(params.id).emit("server_to_client", { data, timestamp });
                        console.log(`WS: Changes from ${params.email} saved`);
                    }
                } catch (error) {
                    throw error;
                }
            });
            await socket.on("disconnect", async () => {
                console.log(`WS: ${params.email} disconnected from ${params.id}`);
                socket.to(params.id).emit("left", params.email);
                return socket.disconnect();
            });
        } catch (e) {
            console.error(`WS: ${e}`);
            socket.emit("response", {
                success: false,
                message: e,
            });
            return socket.disconnect();
        }
    });
};

module.exports = {
    webSockets,
    save
};
