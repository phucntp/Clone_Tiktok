const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const crypto = require("crypto");
const { GridFsStorage } = require("multer-gridfs-storage");

const router = express.Router();
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

// @desc    function to delete image
const deleteImage = async (filename) => {
  const image = await gfs.find({ filename }).toArray();
  if (image.length > 0) await gfs.delete(image[0]._id);
};

// @desc    Upload user profile image
// @route   POST /api/images/upload
// @access  Private
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const profilePicture = `${process.env.SERVER_URL}/api/videos/${req.file.filename}`;

    res.status(201).send({
      video: `${profilePicture}?v=${new Date().getTime()}`
    });
  } catch (err) {
    console.log(err);
  }
});

// @desc    Upload background image for project
// @route   POST /api/images/upload/projectBgUpload/:projectId
// @access  Private

// @desc    Get image
// @route   GET /api/images/:filename
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
