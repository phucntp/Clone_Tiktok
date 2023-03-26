const express = require("express");
const {
  handleGetAll,
  handleGetTag
} = require("../controllers/tag/tagController");

const routerTag = express.Router();

routerTag.get("/all", handleGetAll);
routerTag.get("/:id", handleGetTag);

module.exports = routerTag;
