const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    comment: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, required: false, ref: "User" }
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
