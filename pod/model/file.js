const { Schema, model } = require("mongoose");

const File = new Schema({
  data: {
    type: Object,
    default: "",
  },
  id: {
    type: String,
    required: true,
    unique: true,
  }
});

module.exports = model("file", File);
