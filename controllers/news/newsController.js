/* eslint-disable consistent-return */
const asyncHandler = require("express-async-handler");
const News = require("../../models/news");
const User = require("../../models/user");
const { convertDataToPagination } = require("../../utils/pagination");

const handleGetNews = asyncHandler(async (req, res) => {
  const { type, limit, currentPage } = req.query; // type = 0: foryou type = 1 following
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
    const pagination = {
      total: newsData.length,
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
      if (Number(limit) < newsData.length) {
        const newListNews = convertDataToPagination(newsData, Number(limit));
        pagination.totalPage = newListNews.length;
        if (pagination.currentPage > pagination.totalPage) {
          return res.status(404).json({
            message: `Not found current page, max ${pagination.totalPage} page and min 1 page`
          });
        }
        newsData = newListNews[pagination.currentPage - 1];
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
      pagination.limit = newsData.length;
      if (Number(currentPage)) {
        return res.status(400).json({ message: "limit is require" });
      }
    }
    return res.status(200).json({ pagination, listNews: newsData });
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
