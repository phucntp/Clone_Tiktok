const asyncHandler = require("express-async-handler");
const User = require("../../models/user");
const refreshToken = require("../../utils/refreshToken");
const accessToken = require("../../utils/accessToken");

const handleLogin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!password) {
    res.status(400).json({ message: "Please enter password" });
  }
  if (!username && !email) {
    res.status(400).json({ message: "Please enter username or email" });
  }
  const user = email
    ? await User.findOne({ email })
    : await User.findOne({ username });
  if (user && (await user.matchPassword(password))) {
    user.refreshToken = refreshToken(user._id);
    await user.save();
    res.cookie("jwt", refreshToken(user._id), {
      httpOnly: true,
      secure: true, // only request https://
      sameSite: "None"
    });
    res.json({ accessToken: accessToken(user._id), userInfo: user });
  } else {
    res.sendStatus(401);
  }
});

module.exports = {
  handleLogin
};
