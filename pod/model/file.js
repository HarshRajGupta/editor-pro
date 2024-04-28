const { Schema, model } = require("mongoose");

const File = new Schema({
  data: {
    type: Object,
    default: "",
  },
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true
  }
});

module.exports = model("file", File);
