const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// eslint-disable-next-line prefer-destructuring
const MONGO_URI = process.env.MONGO_URI;
console.log('process.env.MONGO_URI', MONGO_URI);

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};
module.exports = { connectDb };
