const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const documentRouter = require("./document");

const { authHandler } = require("../middlewares");


router.use("/auth", authRouter);
router.use("/document", authHandler, documentRouter);

module.exports = router;
