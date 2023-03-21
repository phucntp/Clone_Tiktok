/* eslint-disable consistent-return */
const asyncHandler = require("express-async-handler");
const News = require("../../models/news");
const User = require("../../models/user");

const handleGetNews = asyncHandler(async (req, res) => {
  const newsData = JSON.parse(JSON.stringify(await News.find()));

  if (newsData) {
    return res.status(200).json(newsData);
  }
  res.sendStatus(404);
  throw new Error("News is empty");
});

const handleGetNewsId = asyncHandler(async (req, res) => {
  const { id } = req;
  const newsData = JSON.parse(JSON.stringify(await News.find({ _id: id })));

  if (newsData) {
    return res.status(200).json(newsData);
  }
  res.sendStatus(404);
  throw new Error("News is empty");
});

const handleFavorite = asyncHandler(async (req, res) => {
  const { cookies } = req;
  const { userId, newsId } = req.body;
  console.log(userId, "userId");
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }
  if (!userId) {
    return res.status(400).json({ message: "UserId is require" });
  }
  if (!newsId) {
    return res.status(400).json({ message: "NewsId is require" });
  }
  const user = await User.findOne({ _id: userId });
  const news = await News.findOne({ _id: newsId });
  if (!user) {
    return res.sendStatus(401);
  }
  if (!news) {
    return res.sendStatus(404);
  }
  if (user && news) {
    const usersLikeNews = JSON.parse(
      JSON.stringify(await News.findOne({ _id: newsId }).populate("users_like"))
    );
    const indexUser = usersLikeNews.users_like.findIndex(
      (item) => item._id === userId
    );

    if (indexUser < 0) {
      await News.findOneAndUpdate(
        { _id: newsId },
        {
          $push: {
            users_like: user
          }
        }
      );
    } else {
      await News.findOneAndUpdate(
        { _id: newsId },
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
