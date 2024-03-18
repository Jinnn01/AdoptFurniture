const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const userController = require('../controllers/users');
const passport = require('passport');
const { storeReturnTo } = require('../middleware/auth');
const WrapAsync = require('../services/WrapAsync');

// display form
router.get('/signup', userController.signUpForm);

// operate the data, add new user
router.post('/signup', WrapAsync(userController.signUp));

// login
router.get('/login', userController.loginForm);

router.post(
  '/login',
  storeReturnTo,
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  WrapAsync(userController.login)
);

router.get('/logout', userController.logout);

module.exports = router;
