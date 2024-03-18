const User = require('../models/user');

module.exports.signUpForm = (request, response) => {
  response.render('users/signup');
};

module.exports.signUp = async (request, response) => {
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
};

module.exports.loginForm = (request, response) => {
  response.render('users/login');
};

module.exports.login = async (request, response) => {
  request.flash('success', 'Welcome back');
  const redirectUrl = response.locals.returnTo || '/furnitures';
  response.redirect(redirectUrl);
};

module.exports.logout = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'See you next time');
    res.redirect('/furnitures');
  });
};
