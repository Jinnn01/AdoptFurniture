const Furniture = require('../models/furniture');

const getAllFurniture = async () => {
  const allFurniture = await Furniture.find();
  return allFurniture;
};

module.exports = { getAllFurniture };
