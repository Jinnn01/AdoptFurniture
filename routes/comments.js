const express = require('express');
const router = express.Router({ mergeParams: true });
const Furniture = require('../models/furniture');
const Comment = require('../models/comment');
const { commentSchema } = require('../middleware/validate');
const WrapAsync = require('../services/WrapAsync');
const { isLoggedIn } = require('../middleware/auth');

const validateComment = (request, response, next) => {
  const validatedComment = commentSchema.validate(request.body);
  if (validatedComment.error) {
    request.flash('error', 'Please enter validated info');
    throw new ExpressError(validatedComment.error, 400);
  } else {
    next();
  }
};
// TODO: ADD USER
// add comment
router.post(
  '/',
  isLoggedIn,
  validateComment,
  WrapAsync(async (request, response) => {
    const id = request.params.id;
    const { comment } = request.body;
    const furniture = await Furniture.findById(id);
    const newComment = new Comment({
      comment: comment,
    });
    furniture.comments.push(newComment);
    await furniture.save();
    await newComment.save();
    request.flash('success', 'Successfully made a comment!');
    response.redirect(`/furnitures/${id}`);
  })
);

// delete comment: should have a middleware to handle the deleting, for example: if furniture is deleted first, then the comment should be deleted by follow
router.delete(
  '/:commentID',
  WrapAsync(async (request, response) => {
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
    // console.log(`Got furniture${id} and comment ${commentID}`);
    request.flash('success', 'Successfully deleted a comment!');
    response.redirect(`/furnitures/${id}`);
  })
);

module.exports = router;
