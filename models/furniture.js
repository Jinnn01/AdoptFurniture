const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const furnitureSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: String,
  description: String,
  location: String,
});

const Furniture = mongoose.model('Furniture', furnitureSchema);
module.exports = Furniture;
