const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware/auth');
const WrapAsync = require('../services/WrapAsync');

// display form
router.get('/signup', (request, response) => {
  response.render('users/signup');
});

// operate the data, add new user
router.post(
  '/signup',
  WrapAsync(async (request, response) => {
    try {
      const { username, email, password } = request.body;
      const user = new User({ email, username });
      // register user-> hash the password
      const registerUser = await User.register(user, password);
      request.flash('success', 'Thannk you for sign up');
      // after user sign up, we will automatically log user in
      request.login(user, function (err) {
        if (err) {
          return next(err);
        }
        return response.redirect('/furnitures');
      });
    } catch (e) {
      request.flash('error', e.message);
      response.redirect('/signup');
    }
  })
);
// login
router.get('/login', (request, response) => {
  response.render('users/login');
});

router.post(
  '/login',
  storeReturnTo,
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  WrapAsync(async (request, response) => {
    request.flash('success', 'Welcome back');
    const redirectUrl = response.locals.returnTo || '/furnitures';
    response.redirect(redirectUrl);
  })
);

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'See you next time');
    res.redirect('/furnitures');
  });
});

module.exports = router;
