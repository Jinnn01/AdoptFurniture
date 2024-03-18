const Furniture = require('../models/furniture');
const User = require('../models/user');
const Comment = require('../models/comment');

module.exports.createComment = async (request, response) => {
  const currentUserID = response.locals.currentUser._id;
  const id = request.params.id;
  const { comment } = request.body;
  const furniture = await Furniture.findById(id);
  const commenter = await User.findById(currentUserID);
  const newComment = new Comment({
    comment: comment,
    furniture: furniture,
    user: commenter,
  });
  commenter.comments.push(newComment);
  furniture.comments.push(newComment);
  // push info to the new Comment
  await furniture.save();
  await newComment.save();
  await commenter.save();
  request.flash('success', 'Successfully made a comment!');
  response.redirect(`/furnitures/${id}`);
};

module.exports.delete = async (request, response) => {
  const { id, commentID } = request.params;
  // delete comment for a furniture
  const deleteCommentFromFurniture = await Furniture.findByIdAndUpdate(id, {
    $pull: {
      comments: { $eq: commentID },
    },
  });
  const comment = await Comment.findByIdAndDelete(commentID);
  if (!comment) {
    request.flash('error', "Can't delete this comment");
  }

  request.flash('success', 'Successfully deleted a comment!');
  response.redirect(`/furnitures/${id}`);
};
