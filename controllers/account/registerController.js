const User = require('../../models/user');
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')

const handleRegister = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if(!username || !email || !password) {
      res.status(400).json({'message': 'Please enter full information'})
  }
  const duplicateEmail = User.findOne({email})
  const duplicateUsername = User.findOne({username})
  if(duplicateEmail || duplicateUsername) {
     res.status(400).json({'message': 'User already exists'})
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(password, salt)
    await User.create({ username, email, password: hashPwd });
    res.status(201).json({ success: `New user ${username} created` });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error('Registering failed');
  }
  });

module.exports = {
  handleRegister,
};
