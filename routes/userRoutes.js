const express = require('express');
const { handleRegister } = require('../controllers/account/registerController')
const { handleLogin } = require('../controllers/account/authController')
const { handleRefreshToken } = require('../controllers/account/refreshTokenController');
const { handleLogout } = require('../controllers/account/logoutController.js')

const router = express.Router();

router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.get('/refresh-token', handleRefreshToken)
router.get('/logout', handleLogout);

module.exports = router;
