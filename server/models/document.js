const { Schema, model } = require("mongoose")

const Document = new Schema({
    data: {
        type: Object,
        default: ''
    },
    fileName: {
        type: String,
        default: 'untitled'
    },
    type: {
        id: String,
        name: String,
        label: String,
        value: String,
    },
    users: {
        type: Array,
        default: [],
    },
    owner: {
        type: String,
        required: true
    },
    openToAll: {
        type: Boolean,
        default: false
    }
})

module.exports = model("Document", Document)