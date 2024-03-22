const express = require('express');
const mongoose = require('mongoose');
const Furniture = require('../models/furniture');
const User = require('../models/user');
const path = require('path');
const suburbs = require('./suburbs');
const { textureDescriptors, furnitureNames } = require('./furnitures');

mongoose
  .connect('mongodb://127.0.0.1:27017/adoptfurniture')
  .then(() => {
    console.log('MongoDB connected!');
  })
  .catch((error) => {
    console.log('Mongo Connection Error:');
    console.log(error);
  });
const name = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Furniture.deleteMany({});
  // add random data to the database
  for (let i = 0; i < 36; i++) {
    const random30 = Math.floor(Math.random() * 20);
    const price = Math.floor(Math.random() * 20) + 10;
    const furnitureName = `${name(textureDescriptors)} ${name(furnitureNames)}`;
    const furnitureImg = {
      url: `https://source.unsplash.com/random/300×300/?furniture,${i}`,
      filename: `${furnitureName}${random30}`,
    };
    const randSuburb = suburbs[random30].suburb;
    const randObject = suburbs.find(
      (location) => location.suburb === randSuburb
    );
    const randCity = randObject.city;
    const latitude = randObject.latitude;
    const longitude = randObject.longitude;
    const randomFurniture = new Furniture({
      name: furnitureName,
      location: `${randSuburb}, ${randCity}`,
      geolocation: {
        type: 'Point',
        coordinates: [latitude, longitude],
      },
      img: furnitureImg,
      description:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. A aperiam, cum ducimus consequuntur rerum ea beatae ullam nesciunt nobis tenetur provident dolor facilis ipsam? Quis officia repudiandae minima quod necessitatibus!',
      price,
    });
    const user = await User.findById('65f3d07d89d1730eb91c4707');
    user.furnitures.push(randomFurniture);
    const savingUser = await user.save();
    const savingFurniture = await randomFurniture.save();
  }
};

seedDB().then(() => mongoose.connection.close());
