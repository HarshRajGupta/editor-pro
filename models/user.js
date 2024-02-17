const { Schema, model } = require("mongoose");

const User = new Schema({
    userName: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
});

module.exports = model("User", User);
