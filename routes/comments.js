const express = require('express');
const router = express.Router({ mergeParams: true });
const Furniture = require('../models/furniture');
const Comment = require('../models/comment');
const User = require('../models/user');
const { validateComment } = require('../middleware/validate');
const WrapAsync = require('../services/WrapAsync');
const { isLoggedIn, isCommentAuthor } = require('../middleware/auth');

// TODO: ADD USER
// add comment
router.post(
  '/',
  isLoggedIn,
  validateComment,
  WrapAsync(async (request, response) => {
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
  })
);

// delete comment: should have a middleware to handle the deleting, for example: if furniture is deleted first, then the comment should be deleted by follow
// only this user or the furniture poster can delete this comment

router.delete(
  '/:commentID',
  isLoggedIn,
  isCommentAuthor,
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
