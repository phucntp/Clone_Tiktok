const express = require("express");
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
const router = express.Router();
router.get("/delete/:filename", async (req, res) => {
  const files = await gfs.find({ filename: req.params.filename }).toArray();
  if (!files || files.length === 0) {
    return res.status(404).json({
      err: "no files exist"
    });
  }
  return gfs.delete(files[0]._id);
});

// @desc    Upload video
// @route   POST /api/videos/upload
// @access  Private
router.post("/upload", upload.single("video"), async (req, res, next) => {
  try {
    // eslint-disable-next-line consistent-return
    await gfs?.find({ filename: req.file.filename }).toArray((err, files) => {
      if (files || files.length) {
        next();
      }
    });
    const profileVideo = `${process.env.SERVER_URL}/api/videos/${req.file.filename}`;

    res.json({
      url: profileVideo
    });
    next();
  } catch (err) {
    console.log(err);
  }
});

// @desc    Get image
// @route   GET /api/video/:filename
// @access  Public
router.get("/:filename", async (req, res) => {
  // eslint-disable-next-line consistent-return
  await gfs?.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "no files exist"
      });
    }
    gfs?.openDownloadStreamByName(req.params.filename).pipe(res);
  });
});

module.exports = router;
