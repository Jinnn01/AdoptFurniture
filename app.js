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
const { request } = require('http');

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

const validateFurniture = (request, response, next) => {
  const validatedFurniture = furnitureSchema.validate(request.body);
  if (validatedFurniture.error) {
    // const msg = validatedFurniture.error.details.map((el) =>
    //   el.message.join(',')
    // );
    throw new ExpressError(validatedFurniture.error, 400);
  } else {
    next();
  }
};

app.get('/', (request, response) => {
  response.render('home');
});

// set up for add a new furniture
// 1. display form
app.get('/addFurniture', (request, response) => {
  response.render('furnitures/new');
});

// 2. store item in db
app.post(
  '/furnitures',
  validateFurniture,
  WrapAsync(async (request, response, next) => {
    // console.log(validatedFurniture);
    const { fName, fLocation, fPrice, fDescription, fImage } = request.body;
    const newFurniture = new Furniture({
      name: fName,
      location: fLocation,
      price: fPrice,
      description: fDescription,
      img: fImage,
    });
    await newFurniture.save();

    response.redirect(`furnitures/${newFurniture._id}`);
  })
);

// get all furnitures
app.get('/furnitures', async (request, response) => {
  const allFurnitures = await Furniture.find({});
  response.render('furnitures/index', { allFurnitures });
});

// get detail by id
app.get(
  '/furnitures/:id',
  WrapAsync(async (request, response, next) => {
    const id = request.params.id;
    const furniture = await Furniture.findById(id).populate('comments');
    if (!furniture) throw new ExpressError('Furniture not found', 400);
    response.render('furnitures/detail', { furniture });
  })
);

// display a form for edit info
app.get(
  '/furnitures/:id/edit',
  WrapAsync(async (request, response) => {
    const id = request.params.id;
    const furniture = await Furniture.findById(id);
    response.render('furnitures/edit', { furniture });
  })
);

// edit item by id
app.patch(
  '/furnitures/:id',
  validateFurniture,
  WrapAsync(async (request, response) => {
    const id = request.params.id;
    const { fName, fLocation, fPrice, fDescription, fImage } = request.body;
    const editedFurniture = await Furniture.findByIdAndUpdate(id, {
      name: fName,
      location: fLocation,
      price: fPrice,
      description: fDescription,
      img: fImage,
    });
    response.redirect(`/furnitures/${id}`);
  })
);

// delete by id
app.delete(
  '/furnitures/:id',
  WrapAsync(async (request, response) => {
    const id = request.params.id;
    const deletedFurniture = await Furniture.findByIdAndDelete(id);
    response.redirect('/furnitures');
  })
);

// display comment form
app.get('/furnitures/:id/comment/new', (request, response) => {
  const id = request.params.id;
  response.render('furnitures/comment', { id });
});

// add comment
app.post(
  '/furnitures/:id/comment',
  WrapAsync(async (request, response) => {
    const id = request.params.id;
    const { comment } = request.body;
    const furniture = await Furniture.findById(id);
    const newComment = new Comment({
      text: comment,
    });
    await furniture.comments.push(newComment);
    furniture.save();
    newComment.save();
    response.redirect(`/furnitures/${id}`);
  })
);
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
