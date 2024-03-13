const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    comment: {
      type: String,
    },
    likes: {
      type: Number,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    furniture: {
      type: Schema.Types.ObjectId,
      ref: 'Furniture',
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
