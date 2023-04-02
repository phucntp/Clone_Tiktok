/* eslint-disable consistent-return */
const asyncHandler = require("express-async-handler");
const Tag = require("../../models/tag");
const User = require("../../models/user");

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

const handleCreateTag = asyncHandler(async (req, res) => {
  const { tags } = req.body;
  if (!tags) {
    return res.status(400).json({ message: "Please enter tags" });
  }
  const { cookies } = req;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }
  const refreshToken = cookies.jwt;
  const user = await User.findOne({ refreshToken });

  if (!user) {
    return res.sendStatus(401);
  }

  try {
    if (tags) {
      tags.map(async (tag) => {
        const findTag = await Tag.findOne({ name: tag });
        if (!findTag) {
          await Tag.create({ name: tag, author: user._id });
        }
      });
    }
    return res.status(201).json({ success: `Tags created` });
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
});

module.exports = {
  handleGetAll,
  handleGetTag,
  handleCreateTag
};
