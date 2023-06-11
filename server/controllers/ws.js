const User = require("../models/user");
const Document = require("../models/document");

const getDocument = async (data) => {
    try {
        const { userEmail, docId } = data;
        const Doc = await Document.findById(docId);
        if (!Doc) return { success: false, message: 'Document does not exist' }
        const permit = Doc.users.find(email => email === userEmail);
        if (!permit) return { success: false, message: 'You are not allowed to view this document' }
        return { success: true, message: 'Document fetched', document: Doc }

    } catch (e) {
        console.log(e);
        return { success: false, message: e }
    }
}

module.exports = {
    getDocument
}