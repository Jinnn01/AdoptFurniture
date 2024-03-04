const express = require('express');
const Furniture = require('../models/furniture');
const router = express.Router();
const { furnitureSchema } = require('../middleware/validate');
const WrapAsync = require('../services/WrapAsync');

const validateFurniture = (request, response, next) => {
  const validatedFurniture = furnitureSchema.validate(request.body);
  if (validatedFurniture.error) {
    throw new ExpressError(validatedFurniture.error, 400);
  } else {
    next();
  }
};

// display create furniture form
router.get('/newFurniture', (request, response) => {
  response.render('furnitures/new');
});

// add furniture
router.post(
  '/add',
  validateFurniture,
  WrapAsync(async (request, response, next) => {
    // console.log(validatedFurniture);
    const { fName, fLocation, fPrice, fDescription, fImage } = request.body;
    const newFurniture = new Furniture({
      name: fName,
      location: fLocation,
      price: fPrice,
      description: fDescription,
      img: fImage,
    });
    await newFurniture.save();

    response.redirect(`${newFurniture._id}`);
  })
);

router.get('/', async (request, response) => {
  const allFurnitures = await Furniture.find({});
  response.render('furnitures/index', { allFurnitures });
});

router.get(
  '/:id',
  WrapAsync(async (request, response, next) => {
    const id = request.params.id;
    const furniture = await Furniture.findById(id).populate('comments');
    if (!furniture) throw new ExpressError('Furniture not found', 400);
    response.render('furnitures/detail', { furniture });
  })
);

// display a form for edit info
router.get(
  '/:id/edit',
  WrapAsync(async (request, response) => {
    const id = request.params.id;
    const furniture = await Furniture.findById(id);
    response.render('furnitures/edit', { furniture });
  })
);

// edit item by id
router.patch(
  '/:id',
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
    response.redirect(`/furnitures/${id}`);
  })
);

// delete furniture by id
router.delete(
  '/:id',
  WrapAsync(async (request, response) => {
    const id = request.params.id;
    const deletedFurniture = await Furniture.findByIdAndDelete(id);
    response.redirect('/furnitures');
  })
);
module.exports = router;
