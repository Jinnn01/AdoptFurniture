const Comment = require('../models/comment');
const User = require('../models/user');
module.exports.isLoggedIn = (request, response, next) => {
  if (!request.isAuthenticated()) {
    // check which url user is visiting
    request.session.returnTo = request.originalUrl;
    request.flash('error', 'you must sign in');
    return response.redirect('/login');
  }
  next();
};
module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    // store the returnTo url in the local variables
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isAuthor = async (request, response, next) => {
  const id = request.params.id;
  const currentUserID = response.locals.currentUser._id;
  const poster = await User.findOne({ furnitures: { $eq: id } });
  if (!poster._id.equals(currentUserID)) {
    request.flash('error', 'Sorry, you have no access');
    return response.redirect(`/furnitures/${id}`);
  }
  next();
};

module.exports.isCommentAuthor = async (request, response, next) => {
  const { id, commentID } = request.params;
  const currentUserID = response.locals.currentUser._id;
  const comment = await Comment.findById(commentID);
  if (!comment.user._id.equals(currentUserID)) {
    request.flash('error', 'Sorry, you have no access');
    return response.redirect(`/furnitures/${id}`);
  }
  next();
};
