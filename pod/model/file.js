const { Schema, model } = require("mongoose");

const File = new Schema({
  data: {
    type: Object,
    default: "",
  },
  documentId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  }
}, {
  timestamps: true
});

module.exports = model("file", File);
