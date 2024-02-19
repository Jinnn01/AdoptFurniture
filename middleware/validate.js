const Joi = require('joi');

module.exports.furnitureSchema = Joi.object({
  fName: Joi.string().required(),
  fLocation: Joi.string().required(),
  fPrice: Joi.number().min(0),
  fDescription: Joi.string().allow(''),
  fImage: Joi.string().allow(''),
});
