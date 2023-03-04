const User = require("../../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const handleForgotPassword = asyncHandler(async (req, res) => {
  const { username, email, new_password } = req.body;
  if (!new_password) {
    res.status(400).json({ message: "Please enter new password" });
  }
  if (!username && !email) {
    res.status(400).json({ message: "Please enter username or email" });
  }
  const user = email
    ? await User.findOne({ email })
    : await User.findOne({ username });
  if (user) {
    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(new_password, salt);
    user.password = hashPwd;
    await user.save();
    res.sendStatus(201);
  } else {
    res.sendStatus(401);
  }
});

module.exports = {
  handleForgotPassword
};
