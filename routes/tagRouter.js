const express = require("express");
const {
  handleGetAll,
  handleGetTag,
  handleCreateTag
} = require("../controllers/tag/tagController");

const routerTag = express.Router();

routerTag.get("/all", handleGetAll);
routerTag.get("/:id", handleGetTag);
routerTag.post("/create", handleCreateTag);

module.exports = routerTag;
