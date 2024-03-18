const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const userController = require('../controllers/users');
const passport = require('passport');
const { storeReturnTo } = require('../middleware/auth');
const WrapAsync = require('../services/WrapAsync');

router
  .route('/signup')
  .get(userController.signUpForm) // display form
  .post(WrapAsync(userController.signUp));
// operate the data, add new user

// login
router
  .route('/login')
  .get(userController.loginForm)
  .post(
    storeReturnTo,
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
    }),
    WrapAsync(userController.login)
  );

router.get('/logout', userController.logout);

module.exports = router;
