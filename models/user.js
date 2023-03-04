const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, default: "", require: true },
    password: { type: String, require: true, minLength: 6 },
    avatar: { type: String, default: null, require: false },
    email: { type: String, require: true, unique: true },
    birthday: { type: String, default: "", require: true },
    refreshToken: String
  },
  { timestamps: true, minimize: false }
);
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model("User", userSchema);
module.exports = User;
