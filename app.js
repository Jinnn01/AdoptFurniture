const express = require('express');
const mongoose = require('mongoose');
const Furniture = require('./models/furniture');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

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

app.get('/', (request, response) => {
  response.render('home');
});

// set up for add a new furniture
// 1. display form
app.get('/addFurniture', (request, response) => {
  response.render('furnitures/new');
});

// 2. store item in db
app.post('/furnitures', async (request, response) => {
  const { fName, fLocation, fPrice, fDescription, fImage } = request.body;
  // console.log(
  //   'Request recieved!',
  //   fName,
  //   fLocation,
  //   fPrice,
  //   fDescription,
  //   fImage
  // );
  const newFurniture = new Furniture({
    name: fName,
    location: fLocation,
    price: fPrice,
    description: fDescription,
    img: fImage,
  });
  await newFurniture.save();
  response.redirect('furnitures');
});

// get all furnitures
app.get('/furnitures', async (request, response) => {
  const allFurnitures = await Furniture.find({});
  response.render('furnitures/index', { allFurnitures });
});

// get detail by id
app.get('/furnitures/:id', async (request, response) => {
  const id = request.params.id;
  const furniture = await Furniture.findById(id);
  response.render('furnitures/detail', { furniture });
});

// display a form for edit info
app.get('/furnitures/:id/edit', async (request, response) => {
  const id = request.params.id;
  const furniture = await Furniture.findById(id);
  response.render('furnitures/edit', { furniture });
});

// edit item by id
app.patch('/furnitures/:id', async (request, response) => {
  const id = request.params.id;
  const { fName, fLocation } = request.body;
  const editedFurniture = await Furniture.findByIdAndUpdate(id, {
    name: fName,
    location: fLocation,
  });
  response.redirect(`/furnitures/${id}`);
});

// delete by id
app.delete('/furnitures/:id', async (request, response) => {
  const id = request.params.id;
  const deletedFurniture = await Furniture.findByIdAndDelete(id);
  response.redirect('/furnitures');
});

app.listen(5001, () => {
  console.log('APP IS LISTENING ON PORT: 5001');
});
