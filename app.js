const express = require('express');
const mongoose = require('mongoose');
const Furniture = require('./models/furniture');
const Comment = require('./models/comment');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./services/ErrorHandling');
const { furnitureSchema, commentSchema } = require('./middleware/validate');
const WrapAsync = require('./services/WrapAsync');
const Joi = require('joi');
const furnitureRouter = require('./routes/furnitures');
const commentRouter = require('./routes/comments');

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

app.get('/', (request, response) => {
  response.render('home');
});

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
