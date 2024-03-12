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
