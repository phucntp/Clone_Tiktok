/* eslint-disable consistent-return */
const asyncHandler = require("express-async-handler");
const User = require("../../models/user");
const { convertDataToPagination } = require("../../utils/pagination");

const handleGetAll = asyncHandler(async (req, res) => {
  const { type, limit, currentPage } = req.query; // type = 0: foryou type = 1 following
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
    const pagination = {
      total: userList.length,
      limit: 0,
      currentPage: Number(currentPage),
      totalPage: 1
    };
    // eslint-disable-next-line no-restricted-globals
    if (currentPage === "null" || pagination.currentPage <= 0) {
      return res.status(404).json({
        message: `Not found current page, min 1 page`
      });
    }
    pagination.currentPage = pagination.currentPage || 1;
    if (Number(limit) > 0) {
      pagination.limit = Number(limit);
      if (Number(limit) < userList.length) {
        const newListUser = convertDataToPagination(userList, Number(limit));
        pagination.totalPage = newListUser.length;
        if (pagination.currentPage > pagination.totalPage) {
          return res.status(404).json({
            message: `Not found current page, max ${pagination.totalPage} page and min 1 page`
          });
        }
        userList = newListUser[pagination.currentPage - 1];
      } else if (pagination.currentPage > pagination.totalPage) {
        return res.status(404).json({
          message: "Not found current page, only 1 page"
        });
      }
    } else if (Number(limit) <= 0 || limit === "null") {
      return res.status(404).json({
        message: `Not found, max ${pagination.total} limit and min 1 limit`
      });
    } else {
      pagination.limit = userList.length;
      if (Number(currentPage)) {
        return res.status(400).json({ message: "limit is require" });
      }
    }
    return res.status(200).json({ pagination, listNews: userList });
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
