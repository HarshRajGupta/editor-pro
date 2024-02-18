const mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
    const URL = url || process.env.MONGO_URL;
    if (!URL) throw new Error("MONGO_URL is not defined");
    await mongoose.connect(URL);
    console.log("DEBUG: MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
