const { User, Document, Connection } = require("../models");
const { invitationMail } = require("./mail");
const { pg, pick } = require("../config");
require("dotenv").config();
const sources = JSON.parse(process.env.SOURCES || "[]");

const getById = async (req, res) => {
    return res.status(200).json(
        { success: true, message: "Document fetched", document: pick(req.document, ['id', 'name', 'type', 'ownerId', 'status', 'source']) }
    );
}

const create = async (req, res) => {
    try {
        await pg.transaction(async (t) => {
            const { type, name } = req.body;
            const user = req.user;
            if (!type || !name) return res.status(400).json(
                { success: false, message: "Please provide a valid type and name" }
            );
            const newDocument = await Document.create(
                { type, ownerId: user.id, name, source: sources[Math.floor(Math.random() * sources.length)] },
                { transaction: t }
            );
            await Connection.create(
                { documentId: newDocument.id, userId: user.id, email: user.email },
                { transaction: t }
            );
            return res.status(200).json(
                { success: true, message: "Document created", document: pick(newDocument, ['id', 'name', 'type', 'ownerId', 'status', 'source']) }
            );
        })
    } catch (e) {
        console.error("ERROR: while creating document", e);
        return res.status(400).json(
            { success: false, message: "Something went wrong!! Please try again" }
        );
    }
};

const get = async (req, res) => {
    try {
        const user = req.user;
        const documents = await user.getDocuments({ attributes: ['id', 'name', 'type', 'ownerId', 'status', 'source'] });
        return res.status(200).json(
            { success: true, message: "Documents fetched", documents: documents }
        );
    } catch (e) {
        console.error("ERROR: while searching documents", e);
        return res.status(500).json(
            { success: false, message: "Something went wrong!! Please try again" }
        );
    }
};

const invite = async (req, res) => {
    try {
        const user = req.user;
        const email = req.body.email.toLowerCase();
        if (!email) return res.status(400).json(
            { success: false, message: "Please provide a valid email" }
        );
        const document = req.document;
        const invitedUser = await User.findOne({ where: { email } })
        if (invitedUser) await Connection.create(
            { documentId: document.id, userId: invitedUser.id, email }
        )
        else await Connection.create(
            { documentId: document.id, email: email }
        );

        invitationMail(user.email, email, document.owner.email, document.name, document.id);
        return res.status(200).json(
            { success: true, message: `${newEmail} Invited` }
        );
    } catch (e) {
        console.error("ERROR: while adding user", e);
        return res.status(500).json(
            { success: false, message: "Something went wrong!! Please try again" }
        );
    }
};

const destroy = async (req, res) => {
    try {
        const document = req.ownedDocument;
        if (!document) return res.status(404).json(
            { success: false, message: "Document not found" }
        );
        await pg.transaction(async (t) => await document.destroy({ transaction: t }))
        return res.status(200).json(
            { success: true, message: "Document deleted" }
        );
    } catch (e) {
        console.error("ERROR: while deleting document", e);
        return res.status(400).json(
            { success: false, message: "Something went wrong!! Please try again" }
        );
    }
};

const updateType = async (req, res) => {
    try {
        const { type } = req.body;
        if (!type) return res.status(400).json(
            { success: false, message: "Please provide a valid type" }
        );
        const document = req.document;
        await document.update(
            { type }
        );
        return res.status(200).json(
            { success: true, message: "Document type changed" }
        );
    } catch (e) {
        console.error("ERROR: while changing document type", e);
        return res.status(500).json(
            { success: false, message: "Something went wrong!! Please try again" }
        );
    }
};

const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (status === null || status === undefined) return res.status(400).json(
            { success: false, message: "Please provide a valid status" }
        );
        const document = req.document;
        await document.update(
            { status }
        );
        return res.status(200).json(
            { success: true, message: "Document status changed" }
        );
    } catch (e) {
        console.error("ERROR: while changing document openToAll", e);
        return res.status(500).json(
            { success: false, message: "Something went wrong!! Please try again" }
        );
    }
};

const getStatus = async (req, res) => {
    try {
        const document = req.document;
        return res.status(200).json(
            { success: true, message: "Document status fetched", status: document.status }
        );
    } catch (e) {
        console.error("ERROR: while fetching document status", e);
        return res.status(500).json(
            { success: false, message: "Something went wrong!! Please try again" }
        );
    }
}

module.exports = { create, get, invite, getById, destroy, updateType, updateStatus, getStatus };
