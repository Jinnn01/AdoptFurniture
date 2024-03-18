const express = require('express');
const router = express.Router({ mergeParams: true });
const Furniture = require('../models/furniture');
const Comment = require('../models/comment');
const User = require('../models/user');
const commentController = require('../controllers/comments');
const { validateComment } = require('../middleware/validate');
const { isLoggedIn, isCommentAuthor } = require('../middleware/auth');
const WrapAsync = require('../services/WrapAsync');

// add comment
router.post(
  '/',
  isLoggedIn,
  validateComment,
  WrapAsync(commentController.createComment)
);

// delete comment: 
// only this user can delete this comment, if furniture is deleted, its comments will be deleted as well
router.delete(
  '/:commentID',
  isLoggedIn,
  isCommentAuthor,
  WrapAsync(commentController.delete)
);

module.exports = router;
