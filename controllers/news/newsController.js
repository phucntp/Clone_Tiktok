/* eslint-disable consistent-return */
const asyncHandler = require("express-async-handler");
const News = require("../../models/news");
const User = require("../../models/user");

const handleGetNews = asyncHandler(async (req, res) => {
  const { type, limit } = req.query; // type = 0: foryou type = 1 following
  const { cookies } = req;
  let newsData = JSON.parse(JSON.stringify(await News.find()));
  if (type) {
    if (!cookies?.jwt) {
      newsData = [];
    } else {
      const refreshToken = cookies.jwt;
      const usersFollowing = JSON.parse(
        JSON.stringify(await User.findOne({ refreshToken }))
      );
      newsData = newsData.filter((item) =>
        usersFollowing.users_following.includes(item.author)
      );
    }
  }

  if (newsData) {
    if (limit) {
      newsData = limit < newsData.length ? newsData.slice(0, limit) : newsData;
    }
    return res.status(200).json(newsData);
  }
  res.sendStatus(404);
  throw new Error("News is empty");
});

const handleGetNewsId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const newsData = JSON.parse(JSON.stringify(await News.findOne({ _id: id })));

  if (newsData) {
    return res.status(200).json(newsData);
  }
  res.sendStatus(404);
  throw new Error("News is empty");
});

const handleFavorite = asyncHandler(async (req, res) => {
  const { idNews } = req.body;
  const { cookies } = req;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }
  const refreshToken = cookies.jwt;
  if (!idNews) {
    return res.status(400).json({ message: "NewsId is require" });
  }
  const user = await User.findOne({ refreshToken });
  const news = await News.findOne({ _id: idNews });
  if (!user) {
    return res.sendStatus(401);
  }
  if (!news) {
    return res.sendStatus(404);
  }
  if (user && news) {
    const usersLikeNews = JSON.parse(
      JSON.stringify(await News.findOne({ _id: idNews }).populate("users_like"))
    );
    const indexUser = usersLikeNews.users_like.findIndex(
      (item) => item._id === user._id
    );

    if (indexUser < 0) {
      await News.findOneAndUpdate(
        { _id: idNews },
        {
          $push: {
            users_like: user
          }
        }
      );
    } else {
      await News.findOneAndUpdate(
        { _id: idNews },
        {
          $pull: {
            users_like: user._id
          }
        }
      );
    }
    return res
      .status(200)
      .json({ message: indexUser < 0 ? "liked news" : "unlike news" });
  }

  res.sendStatus(404);
  throw new Error("News is empty");
});

module.exports = {
  handleGetNews,
  handleGetNewsId,
  handleFavorite
};
