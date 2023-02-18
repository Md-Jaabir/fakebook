const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  caption: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  tags: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  likes: {
    type: String,
    requred: true
  },
  dislikes: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("posts", postSchema);