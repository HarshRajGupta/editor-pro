const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verify,
  guest,
} = require("../controllers/auth");

const { authHandler, guestHandler } = require("../middlewares");

router.get("/", authHandler, verify);
router.get("/guest", guestHandler, guest);
router.post("/register", guestHandler, register);
router.post("/login", login);

module.exports = router;
