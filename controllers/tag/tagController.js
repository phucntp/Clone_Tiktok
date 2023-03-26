/* eslint-disable consistent-return */
const asyncHandler = require("express-async-handler");
const Tag = require("../../models/tag");

const handleGetAll = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  let tagList = JSON.parse(JSON.stringify(await Tag.find()));
  if (tagList) {
    if (limit) {
      tagList = limit < tagList.length ? tagList.slice(0, limit) : tagList;
    }
    return res.status(200).json(tagList);
  }
  res.sendStatus(404);
  throw new Error("List tag is empty");
});

const handleGetTag = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tag = JSON.parse(JSON.stringify(await Tag.findOne({ _id: id })));

  if (tag) {
    return res.status(200).json(tag);
  }
  res.sendStatus(404);
  throw new Error("Tag is empty");
});

module.exports = {
  handleGetAll,
  handleGetTag
};
