const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../../models/user");

const handleForgotPassword = asyncHandler(async (req, res) => {
  const { username, email, newPassword } = req.body;
  if (!newPassword) {
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
    const hashPwd = await bcrypt.hash(newPassword, salt);
    user.password = hashPwd;
    await user.save();
    res.status(200).json({ message: "Password has been updated" });
  } else {
    res.sendStatus(401);
  }
});

module.exports = {
  handleForgotPassword
};
