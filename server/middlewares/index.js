const { User, Document } = require("../models");
const jwt = require("jsonwebtoken");

const authHandler = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(403).json({ success: false, message: "Please login" });
    return await jwt.verify(token, process.env.JWT_SECRET, async (err, userdata) => {
        if (err) {
            console.error(err)
            return res.status(403).json({ success: false, error: `Invalid Token`, message: err });
        }
        const user = await User.findByPk(userdata.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        req.user = user;
        return next();
    });
}

const guestHandler = async (req, _, next) => {
    const { guestId } = req.cookies;
    if (!guestId) return next();
    jwt.verify(guestId, process.env.JWT_SECRET, async (err, userdata) => {
        if (err) {
            console.error(err)
            req.cookies.guestId = null;
            return next();
        }
        const user = await User.findByPk(userdata.id);
        if (!user) return next();
        req.user = user;
        return next();
    });
}

const documentHandler = async (req, res, next) => {
    try {
        const user = req.user;
        const documentId = req.params.id;
        let document = await user.getDocuments({ where: { id: documentId } });
        if (!document.length) {
            document = await Document.findAll({ where: { id: documentId, status: true } });
            if (!document || !document.length) return res.status(404).json({
                success: false,
                message: "Document not found",
            });
        }
        const ownedDocument = await user.getOwnedDocuments({ where: { id: documentId } });
        req.document = document[0];
        req.ownedDocument = ownedDocument[0];
        return next();
    } catch (e) {
        console.error("ERROR: while fetching document", e);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!! Please try again",
        });
    }
}

module.exports = { authHandler, documentHandler, guestHandler };