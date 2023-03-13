const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    title: { type: String, default: "", require: true },
    music: { type: mongoose.Types.ObjectId, required: false, ref: "Music" },
    description: { type: String, default: "" },
    isLike: { type: String, default: "0" },
    countLike: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
    author: { type: mongoose.Types.ObjectId, required: true, ref: "User" }
  },
  { timestamps: true, minimize: false }
);
const News = mongoose.model("News", newsSchema);
module.exports = News;
