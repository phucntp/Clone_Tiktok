/* eslint-disable consistent-return */
const asyncHandler = require("express-async-handler");
const User = require("../../models/user");

const handleLogout = asyncHandler(async (req, res) => {
  const { cookies } = req;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }
  const refreshToken = cookies.jwt;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("jwt", { secure: true, sameSite: "None" });
    return res.sendStatus(204);
  }
  user.refreshToken = "";
  await user.save();
  res.clearCookie("jwt", { secure: true, sameSite: "None" });
  res.sendStatus(200);
});

module.exports = {
  handleLogout
};
