const jwt = require("jsonwebtoken");

const refreshToken = (id) =>
  jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
module.exports = refreshToken;
