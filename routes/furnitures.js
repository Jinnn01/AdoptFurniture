const express = require('express');
const Furniture = require('../models/furniture');
const User = require('../models/user');
const Comment = require('../models/comment');
const router = express.Router();
const { furnitureSchema } = require('../middleware/validate');
const WrapAsync = require('../services/WrapAsync');
const { isLoggedIn } = require('../middleware/auth');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');

const validateFurniture = (request, response, next) => {
  const validatedFurniture = furnitureSchema.validate(request.body);
  if (validatedFurniture.error) {
    throw new ExpressError(validatedFurniture.error, 400);
  } else {
    next();
  }
};

// display create furniture form
router.get('/newFurniture', isLoggedIn, (request, response) => {
  response.render('furnitures/new');
});

// add furniture
router.post(
  '/add',
  isLoggedIn,
  validateFurniture,
  WrapAsync(async (request, response, next) => {
    const currentUserID = response.locals.currentUser._id;
    console.log(currentUserID);
    // console.log(validatedFurniture);
    const { fName, fLocation, fPrice, fDescription, fImage } = request.body;
    const newFurniture = new Furniture({
      name: fName,
      location: fLocation,
      price: fPrice,
      description: fDescription,
      img: fImage,
    });
    // add furniture in that user.furnitures
    const user = await User.findById(currentUserID);
    user.furnitures.push(newFurniture);
    const savingUser = await user.save();
    const savingFurniture = await newFurniture.save();
    // console.log('Saved furniture', savingFurniture);
    request.flash('success', 'Successfully add a new furniture!');
    response.redirect(`${newFurniture._id}`);
  })
);

router.get('/', async (request, response) => {
  const allFurnitures = await Furniture.find({});
  response.render('furnitures', { allFurnitures });
});

router.get(
  '/:id',
  WrapAsync(async (request, response) => {
    const id = request.params.id;
    const furniture = await Furniture.findById(id).populate('comments');
    const commentersID = furniture.comments.map((comment) => comment.user);
    console.log(commentersID);
    if (!furniture) {
      request.flash('error', "Can't find the furniture");
      return response.redirect('/furnitures');
    }
    // find who post this furniture
    const poster = await User.findOne({ furnitures: { $eq: id } });
    // find all the comments based on the furniture, and populate the user info asscociate with this comment
    const comments = await Comment.find({ furniture: { $eq: id } }).populate(
      'user'
    );
    response.render('furnitures/detail', { furniture, poster, comments });
  })
);

// display a form for edit info:
// TODO: only the post owner can edit/ delete this furniture
router.get(
  '/:id/edit',
  isLoggedIn,
  WrapAsync(async (request, response) => {
    const id = request.params.id;
    const furniture = await Furniture.findById(id);
    response.render('furnitures/edit', { furniture });
  })
);

// edit item by id, only owner can edit
router.patch(
  '/:id',
  isLoggedIn,
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
    if (!editedFurniture) {
      request.flash('error', "Cant't update the furniture");
    }
    request.flash('success', 'Successfully updated a furniture!');
    response.redirect(`/furnitures/${id}`);
  })
);

// delete furniture by id, only owner can delete
router.delete(
  '/:id',
  isLoggedIn,
  WrapAsync(async (request, response) => {
    const id = request.params.id;
    const deletedFurniture = await Furniture.findByIdAndDelete(id);
    request.flash('success', 'Successfully deleted a furniture!');
    response.redirect('/furnitures');
  })
);
module.exports = router;
