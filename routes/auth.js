const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    verifyToken,
    guestLogin
} = require("../controllers/auth");


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/guest").post(guestLogin);
router.route("/").post(verifyToken);

module.exports = router;