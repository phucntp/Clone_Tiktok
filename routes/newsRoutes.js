const express = require("express");
const {
  handleGetNews,
  handleGetNewsId,
  handleFavorite
} = require("../controllers/news/newsController");

const routerNews = express.Router();

routerNews.get("/all", handleGetNews);
routerNews.get("/:id", handleGetNewsId);
routerNews.post("/favorite", handleFavorite);

module.exports = routerNews;
