const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const crypto = require("crypto");
const { GridFsStorage } = require("multer-gridfs-storage");
const User = require("../models/user");

const { MONGO_URI_SERVER } = process.env;

const conn = mongoose.createConnection(MONGO_URI_SERVER);

let gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads/image"
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
          bucketName: "uploads/image"
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

// @desc    Upload image
// @route   POST /api/images/upload
// @access  Private
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const profileImage = `${process.env.SERVER_URL}/api/images/${req.file.filename}`;

    res.status(201).send({
      url: profileImage
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/updateAvatar", async (req, res) => {
  const { url, username } = req.body;
  if (!url) {
    return res.status(400).json({ message: "Please enter url" });
  }
  if (!username) {
    return res.status(400).json({ message: "Please enter username" });
  }
  const user = await User.findOne({ username });
  if (user) {
    user.avatar = url;
    await user.save();
    return res.json({ message: "Updated avatar user" });
  }
  return res.sendStatus(401);
});

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
