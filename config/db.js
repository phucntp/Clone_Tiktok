const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

dotenv.config();

// eslint-disable-next-line prefer-destructuring
// const MONGO_URI = process.env.MONGO_URI;
const uri =
  "mongodb+srv://phucqaz1234:phucqwert2000@cluster0.imp9cqm.mongodb.net/test";
const client = new MongoClient(uri);
// console.log("process.env.MONGO_URI", MONGO_URI);

const connectDb = async () => {
  try {
    await mongoose.connect(uri)
    console.log("done");
    // await client.connect();
    // await listDatabases(client);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};
module.exports = { connectDb };
