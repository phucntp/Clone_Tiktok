const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const MONGO_URI = process.env.MONGO_URI_SERVER || process.env.MONGO_URI;
const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};
module.exports = { connectDb };
