const express = require('express');
const mongoose = require('mongoose');
const Furniture = require('../models/furniture');
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
    const randomFurniture = new Furniture({
      name: `${name(textureDescriptors)} ${name(furnitureNames)}`,
      location: `${suburbs[random30].suburb}, ${suburbs[random30].city}`,
    });
    await randomFurniture.save();
  }
};

seedDB().then(() => mongoose.connection.close());
