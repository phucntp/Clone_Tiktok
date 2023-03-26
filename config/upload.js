const mongoose = require("mongoose");
const multer = require("multer");
const crypto = require("crypto");
const { GridFsStorage } = require("multer-gridfs-storage");

const { MONGO_URI_SERVER } = process.env;

const conn = mongoose.createConnection(MONGO_URI_SERVER);

let gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
});

// Create storage engine
const storage = new GridFsStorage({
  url: MONGO_URI_SERVER,
  file: (req, file) =>
    new Promise((resolve, reject) => {
      // eslint-disable-next-line consistent-return
      crypto.randomBytes(16, (err) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    })
});

const upload = multer({ storage });

module.exports = { gfs, upload };
