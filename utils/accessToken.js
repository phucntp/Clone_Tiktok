const jwt = require('jsonwebtoken')

const accessToken = (id) =>
  jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30d' });
module.exports = accessToken;