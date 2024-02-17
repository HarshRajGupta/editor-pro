const express = require("express");
const router = express.Router();

const authRouter = require("./auth")
const documentRouter = require("./document")

router.use("/auth", authRouter)
router.use("/document", documentRouter)

module.exports = router;