const User = require('../../models/user');
const asyncHandler = require('express-async-handler')

const handleLogout = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) {
      res.sendStatus(204)
    }
    const refreshToken = cookies.jwt
    const user = await User.findOne({ refreshToken }).exec()
    if(!user) {
        res.clearCookie('jwt', {secure: true, sameSite: 'None'})
        return res.sendStatus(204)
    }
    user.refreshToken = ''
    await user.save()
    res.clearCookie('jwt', {secure: true, sameSite: 'None'})
    res.sendStatus(204)
  });

module.exports = {
    handleLogout,
};
