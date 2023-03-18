const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    title: { type: String, default: "", require: true },
    url: { type: String, default: "", require: true },
    music: { type: mongoose.Types.ObjectId, required: false, ref: "Music" },
    description: { type: String, default: "" },
    like_count: { type: Number, default: 0 },
    share_count: { type: Number, default: 0 },
    comment_count: { type: Number, default: 0 },
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
    users_like: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    users_share: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
    author: { type: mongoose.Types.ObjectId, required: true, ref: "User" }
  },
  { timestamps: true, minimize: false }
);
const News = mongoose.model("News", newsSchema);
module.exports = News;
