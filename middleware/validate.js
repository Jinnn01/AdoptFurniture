const Joi = require('joi');
const ExpressError = require('../services/ErrorHandling');

const furnitureSchema = Joi.object({
  fName: Joi.string().required(),
  fSuburb: Joi.string().required(),
  fCity: Joi.string().required(),
  fPrice: Joi.number().min(0),
  fDescription: Joi.string().allow(''),
  DeleteImgs: Joi.array(),
});

const commentSchema = Joi.object({
  comment: Joi.string().required(),
  likes: Joi.number().min(0),
  user: Joi.string(),
});

module.exports.userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().required(),
});

module.exports.validateComment = (request, response, next) => {
  const validatedComment = commentSchema.validate(request.body);
  if (validatedComment.error) {
    request.flash('error', 'Please enter validated info');
    throw new ExpressError(validatedComment.error, 400);
  } else {
    next();
  }
};

module.exports.validateFurniture = (request, response, next) => {
  const validatedFurniture = furnitureSchema.validate(request.body);
  if (validatedFurniture.error) {
    throw new ExpressError(validatedFurniture.error, 400);
  } else {
    next();
  }
};
