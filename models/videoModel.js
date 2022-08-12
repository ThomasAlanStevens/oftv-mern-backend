const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  categories: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
    required: true,
    unique: true,
  },
  icon: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  watch: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Video", videoSchema);
