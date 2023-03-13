const express = require("express");
const {
  handleGetNews,
  handleGetNewsId
} = require("../controllers/news/newsController");

const routerNews = express.Router();

routerNews.get("/all", handleGetNews);
routerNews.get("/:id", handleGetNewsId);

module.exports = routerNews;
