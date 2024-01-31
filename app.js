const express = require('express');
const mongoose = require('mongoose');
const Furniture = require('./models/furniture');
const path = require('path');

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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (request, response) => {
  response.render('home');
});

app.get('/addFurniture', async (request, response) => {
  const newFurniture = new Furniture({
    name: 'Wooden Sofa',
    price: 'free',
    description: 'Never used wooden sofa',
    location: 'Wollongong',
  });
  const result = await newFurniture.save();
  console.log(result);
});

app.listen(5001, () => {
  console.log('APP IS LISTENING ON PORT: 5001');
});
