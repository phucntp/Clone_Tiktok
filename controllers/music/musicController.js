/* eslint-disable consistent-return */
const asyncHandler = require("express-async-handler");
const Music = require("../../models/music");

const handleGetAll = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  let musicList = JSON.parse(JSON.stringify(await Music.find()));
  if (musicList) {
    if (limit) {
      musicList =
        limit < musicList.length ? musicList.slice(0, limit) : musicList;
    }
    return res.status(200).json(musicList);
  }
  res.sendStatus(404);
  throw new Error("List music is empty");
});

const handleGetMusic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const music = JSON.parse(JSON.stringify(await Music.findOne({ _id: id })));

  if (music) {
    return res.status(200).json(music);
  }
  res.sendStatus(404);
  throw new Error("Music is empty");
});

module.exports = {
  handleGetAll,
  handleGetMusic
};
