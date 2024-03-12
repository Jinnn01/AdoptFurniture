const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./services/ErrorHandling');
const session = require('express-session');
const flash = require('connect-flash');
const furnitureRouter = require('./routes/furnitures');
const commentRouter = require('./routes/comments');
const userRouter = require('./routes/users');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

mongoose
  .connect('mongodb://127.0.0.1:27017/adoptfurniture')
  .then(() => {
    console.log('MongoDB connected!');
  })
  .catch((error) => {
    console.log('Mongo Connection Error:');
    console.log(error);
  });

const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

const sessionConfigs = {
  secret: 'adoptfurnitureforyournexthome!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    // a week
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfigs));
// set up for passport.js
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// install user in session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((request, response, next) => {
  console.log(request.session);
  response.locals.currentUser = request.user;
  response.locals.success = request.flash('success');
  response.locals.error = request.flash('error');
  next();
});

app.get('/', (request, response) => {
  response.render('home');
});

app.use('/', userRouter);
app.use('/furnitures', furnitureRouter);
app.use('/furnitures/:id/comment', commentRouter);
// nothing is matched
app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404));
});

// basic error handling
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something went wrong';
  res.render('./error', { statusCode, err });
  // res.status(statusCode).send(message);
});

app.listen(5001, () => {
  console.log('APP IS LISTENING ON PORT: 5001');
});
