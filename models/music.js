const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    url: { type: String, required: true }
  },
  { timestamps: true }
);

const Music = mongoose.model("Music", musicSchema);
module.exports = Music;
