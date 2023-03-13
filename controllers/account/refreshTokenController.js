/* eslint-disable consistent-return */
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const accessToken = require("../../utils/accessToken");

const handleRefreshToken = asyncHandler(async (req, res) => {
  const { cookies } = req;
  if (!cookies?.jwt) {
    res.sendStatus(401);
  }
  const refreshToken = cookies.jwt;
  const user = await User.findOne({ refreshToken }).populate("_id");
  if (!user) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    console.log(decoded);
    console.log(user._id, "user");
    if (err || user._id !== decoded.id) return res.sendStatus(403);
    res.json({ accessToken: accessToken(user._id) });
  });
});

module.exports = {
  handleRefreshToken
};
