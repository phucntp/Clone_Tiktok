const express = require("express");
const {
  handleGetAll,
  handleGetMusic
} = require("../controllers/music/musicController");

const routerMusic = express.Router();

routerMusic.get("/all", handleGetAll);
routerMusic.get("/:id", handleGetMusic);

module.exports = routerMusic;
