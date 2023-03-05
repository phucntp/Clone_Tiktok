const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../../models/user");

const handleRegister = asyncHandler(async (req, res) => {
  const { username, email, password, birthday } = req.body;
  if (!username || !email || !password || !birthday) {
    return res.status(400).json({ message: "Please enter full information" });
  }
  const duplicateEmail = await User.findOne({ email }).exec();
  console.log(duplicateEmail, "dup");
  console.log(email, "email");
  const duplicateUsername = await User.findOne({ username }).exec();
  if (duplicateEmail || duplicateUsername) {
    console.log(123);
    return res.status(400).json({ message: "User already exists" });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(password, salt);
    await User.create({ username, email, birthday, password: hashPwd });
    return res.status(201).json({ success: `New user ${username} created` });
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
});

module.exports = {
  handleRegister
};
