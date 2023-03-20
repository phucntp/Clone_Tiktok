const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    content: { type: String, default: "", required: true },
    like_count: { type: Number, default: 0, require: true },
    author: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    users_like: [{ type: mongoose.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
