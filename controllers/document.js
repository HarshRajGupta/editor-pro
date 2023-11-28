const Document = require("../models/document")
const { invitationMail } = require("./mail")

const createDocument = async (req, res) => {
    // console.log(`POST /api/document/create`)
    try {
        console.log(req.body)
        const { type, fileName, defaultCode } = req.body;
        const userEmail = req.body.userEmail.toLowerCase();
        if (!userEmail || !type) return res.status(400).json({ success: false, message: 'Bad Request' })
        const newDocument = await Document.create({
            users: [userEmail],
            type: type,
            owner: userEmail,
            fileName: fileName,
            data: defaultCode
        })
        console.log(`DEBUG: Document ${newDocument._id} created`);
        return res.status(200).json({ success: true, message: 'Document created', document: newDocument })
    } catch (e) {
        console.log(`ERROR: while creating document`)
        console.error(e)
        return res.status(500).json({ success: false, message: 'Something went wrong!! Please try again' })
    }
}

const getDocuments = async (req, res) => {
    // console.log(`POST /api/document/`)
    try {
        console.log(req.body)
        const userEmail = req.body.userEmail.toLowerCase();
        if (!userEmail) return res.status(400).json({ success: false, message: 'Bad Request' })
        const documents = await Document.find({ users: userEmail })
        console.log(`DEBUG: Documents of ${userEmail} sent`)
        return res.status(200).json({ success: true, message: 'Documents fetched', documents: documents })
    } catch (e) {
        console.log(`ERROR: while searching documents`)
        console.error(e)
        return res.status(500).json({ success: false, message: 'Something went wrong!! Please try again' })
    }
}

const getDocumentById = async (req, res) => {
    // console.log(`POST /api/document/get`)
    try {
        const { id } = req.body;
        const userEmail = req.body.userEmail.toLowerCase();
        if (!id || !userEmail) return res.status(400).json({ success: false, message: 'Bad Request' })
        const document = await Document.findById(id);
        if (!document) return res.status(400).json({ success: false, message: 'Document does not exist' })
        if (document.openToAll) {
            return res.status(200).json({ success: true, message: 'Document fetched', document: document })
        }
        const permit = document.users.find(email => email === userEmail);
        if (!permit) return res.status(400).json({ success: false, message: 'You are not allowed to view this document' })
        return res.status(200).json({ success: true, message: 'Document fetched', document: document })
    } catch (e) {
        console.log(`ERROR: while fetching document`)
        console.error(e)
        return res.status(500).json({ success: false, message: 'Bad Request' })
    }
}

const addUser = async (req, res) => {
    // console.log("POST /api/document/invite");
    try {
        console.log(req.body)
        const id = req.body.id;
        const userEmail = req.body.userEmail.toLowerCase();
        const newEmail = req.body.newEmail.toLowerCase();
        if (!id || !userEmail || !newEmail) return res.status(400).json({ success: false, message: 'Bad Request' })
        const document = await Document.findById(id)
        if (!document) return res.status(400).json({ success: false, message: 'Document does not exist' })
        const permit = document.users.find(email => email === newEmail);
        if (permit) return res.status(400).json({ success: true, message: 'Invitation already sent' })
        document.users.push(newEmail)
        await document.save();
        console.log(`DEBUG: ${newEmail} added to ${id}`)
        invitationMail(userEmail, newEmail, document.owner, document.fileName, document._id)
        return res.status(200).json({ success: true, message: `${newEmail} Invited` })
    } catch (e) {
        console.log(`ERROR: while adding user`)
        console.error(e)
        return res.status(500).json({ success: false, message: 'Something went wrong!! Please try again' })
    }
}

const deleteDocument = async (req, res) => {
    // console.log("POST /api/document/delete");
    try {
        console.log(req.body)
        const { id } = req.body;
        const userEmail = req.body.userEmail.toLowerCase();
        if (!id || !userEmail) return res.status(400).json({ success: false, message: 'Bad Request' })
        const doc = await Document.findById(id)
        if (!doc) return res.status(400).json({ success: false, message: 'Document does not exist' })
        if (doc.owner != userEmail) {
            return res.status(400).json({ success: false, message: 'Only owner can delete files' })
        }
        await Document.findByIdAndDelete(id)
        console.log(`DEBUG: ${id} deleted`)
        return res.status(200).json({ success: true, message: 'Document deleted' })
    } catch (e) {
        console.log(`ERROR: while deleting document`)
        console.error(e)
        return res.status(500).json({ success: false, message: 'Something went wrong!! Please try again' })
    }
}

const changeType = async (req, res) => {
    // console.log(`POST /api/document/type`)
    try {
        console.log(req.body);
        const { id, type } = req.body;
        if (!id || !type) return res.status(400).json({ success: false, message: 'Bad Request' })
        const document = await Document.findById(id)
        if (!document) return res.status(400).json({ success: false, message: 'Document does not exist' })
        document.type = type;
        await document.save();
        console.log(`DEBUG: ${id} type changed to ${type}`)
        return res.status(200).json({ success: true, message: 'Document type changed' })
    } catch (e) {
        console.log(`ERROR: while changing document type`)
        console.error(e)
        return res.status(500).json({ success: false, message: 'Something went wrong!! Please try again' })
    }
}

const openToAll = async (req, res) => {
    // console.log(`POST /api/document/open`)
    try {
        console.log(req.body);
        const { docId, status } = req.body;
        const userEmail = req.body.userEmail.toLowerCase();
        if (!docId || status === null || !userEmail) return res.status(400).json({ success: false, message: 'Bad Request', status: status, docId: docId, userEmail: userEmail })
        const document = await Document.findById(docId);
        if (!document) return res.status(400).json({ success: false, message: 'Document does not exist' })
        if (document.owner != userEmail) return res.status(400).json({ success: false, message: 'Only owner can change this' })
        document.openToAll = status;
        await document.save();
        console.log(`DEBUG: ${docId} openToAll changed to ${status}`)
        return res.status(200).json({ success: true, message: 'Document openToAll changed' })
    } catch (e) {
        console.log(`ERROR: while changing document openToAll`)
        console.error(e)
        return res.status(500).json({ success: false, message: 'Something went wrong!! Please try again' })
    }
}

module.exports = {
    createDocument,
    getDocuments,
    addUser,
    getDocumentById,
    deleteDocument,
    changeType,
    openToAll
}