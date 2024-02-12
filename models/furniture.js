const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const furnitureSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: Number,
  description: String,
  location: String,
  img: String,
});

const Furniture = mongoose.model('Furniture', furnitureSchema);
module.exports = Furniture;
