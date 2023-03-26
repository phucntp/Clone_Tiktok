const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, default: "", require: true },
    password: { type: String, require: true, minLength: 6 },
    avatar: { type: String, default: "", require: false },
    name: { type: String, default: "", require: false },
    bio: { type: String, default: "", require: false },
    email: { type: String, require: true, unique: true },
    birthday: { type: String, default: "", require: true },
    users_following: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    users_followed: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    news_created: [{ type: mongoose.Types.ObjectId, ref: "News" }],
    news_liked: [{ type: mongoose.Types.ObjectId, ref: "News" }],
    refreshToken: String
  },
  { timestamps: true, minimize: false }
);
userSchema.methods.matchPassword = async function (enteredPassword) {
  // eslint-disable-next-line no-return-await
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model("User", userSchema);
module.exports = User;
