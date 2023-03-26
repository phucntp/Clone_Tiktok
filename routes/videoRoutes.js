const express = require("express");
const { gfs, upload } = require("../config/upload");

const router = express.Router();

// @desc    function to delete video
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
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const profileVideo = `${process.env.SERVER_URL}/api/videos/${req.file.filename}`;

    res.status(201).send({
      video: profileVideo
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
  await gfs?.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "no files exist"
      });
    }
    return gfs?.openDownloadStreamByName(req.params.filename).pipe(res);
  });
});

module.exports = router;
