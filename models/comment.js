const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    text: {
      type: String,
    },
    likes: {
      type: Number,
    },
    user: {
      type: String,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
