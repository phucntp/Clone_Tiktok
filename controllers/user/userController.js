/* eslint-disable consistent-return */
const asyncHandler = require("express-async-handler");
const User = require("../../models/user");

const handleGetAll = asyncHandler(async (req, res) => {
  const { type, limit } = req.query; // type = 0: foryou type = 1 following
  const { cookies } = req;
  let userList = JSON.parse(JSON.stringify(await User.find()));
  if (type) {
    if (!cookies?.jwt) {
      userList = [];
    } else {
      const refreshToken = cookies.jwt;
      const users = JSON.parse(
        JSON.stringify(await User.findOne({ refreshToken }))
      );
      userList = userList.filter((item) =>
        type === "1"
          ? users.users_following.includes(item._id)
          : users.users_followed.includes(item._id)
      );
    }
  }

  if (userList) {
    if (limit) {
      userList = limit < userList.length ? userList.slice(0, limit) : userList;
    }
    return res.status(200).json(userList);
  }
  res.sendStatus(404);
  throw new Error("Users is empty");
});

const handleGetUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = JSON.parse(JSON.stringify(await User.findOne({ username })));

  if (user) {
    return res.status(200).json(user);
  }
  res.sendStatus(404);
  throw new Error("User is empty");
});

const handleFollowing = asyncHandler(async (req, res) => {
  const { idUserFollow } = req.body;
  const { cookies } = req;
  if (!cookies?.jwt) {
    res.sendStatus(204);
  }
  const refreshToken = cookies.jwt;
  if (!idUserFollow) {
    return res.status(400).json({ message: "Id user follow is require" });
  }
  const user = await User.findOne({ refreshToken });
  const userFollow = await User.findOne({ _id: idUserFollow });
  if (!user) {
    return res.sendStatus(401);
  }
  if (!userFollow) {
    return res.sendStatus(404);
  }
  if (user && userFollow) {
    const usersFollowing = JSON.parse(
      JSON.stringify(
        await User.findOne({ refreshToken }).populate("users_following")
      )
    );
    const indexUser = usersFollowing.users_following.findIndex(
      (item) => item._id === idUserFollow
    );
    if (indexUser < 0) {
      await User.findOneAndUpdate(
        { refreshToken },
        {
          $push: {
            users_following: userFollow
          }
        }
      );
      await User.findOneAndUpdate(
        { _id: idUserFollow },
        {
          $push: {
            users_followed: user
          }
        }
      );
    } else {
      await User.findOneAndUpdate(
        { refreshToken },
        {
          $pull: {
            users_following: userFollow
          }
        }
      );
      await User.findOneAndUpdate(
        { _id: idUserFollow },
        {
          $pull: {
            users_followed: user
          }
        }
      );
    }
    return res
      .status(200)
      .json({ message: indexUser < 0 ? "followed user" : "unfollowed user" });
  }

  res.sendStatus(404);
  throw new Error("User is empty");
});

module.exports = {
  handleGetAll,
  handleGetUser,
  handleFollowing
};
