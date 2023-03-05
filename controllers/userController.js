const asyncHandler = require("express-async-handler");
const User = require("../models/user");

const handleRegister = asyncHandler(async (req, res) => {
  // const { projectId, background } = req.body;
  // await User.updateOne(
  //   { _id: req.user._id },
  //   { $set: { [`projectsThemes.${projectId}.background`]: background } }
  // );
  // res.status(200);
  try {
    const { username, email, password } = req.body;
    await User.create({ username, email, password });

    res.status(201).json({ success: `New user ${username} created` });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Registering failed");
  }
});

module.exports = {
  handleRegister
};
