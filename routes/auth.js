const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    verifyToken,
} = require("../controllers/auth");


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/").post(verifyToken);

module.exports = router;