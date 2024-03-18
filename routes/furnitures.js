const express = require('express');
const Furniture = require('../models/furniture');
const User = require('../models/user');
const Comment = require('../models/comment');

const furnitureController = require('../controllers/furnitures');
const router = express.Router();
const { validateFurniture } = require('../middleware/validate');
const WrapAsync = require('../services/WrapAsync');
const { isLoggedIn, storeReturnTo, isAuthor } = require('../middleware/auth');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');

router.get('/', furnitureController.index);

// display create furniture form
router.get('/newFurniture', isLoggedIn, furnitureController.newForm);

// add furniture
router.post(
  '/add',
  isLoggedIn,
  validateFurniture,
  WrapAsync(furnitureController.createFurniture)
);

router
  .route('/:id')
  .get(WrapAsync(furnitureController.displayDetails)) // display details with comment
  .patch(
    isLoggedIn,
    isAuthor,
    validateFurniture,
    WrapAsync(furnitureController.updateFurniture)
  ) // edit item by id, only owner can edit
  .delete(isLoggedIn, WrapAsync(furnitureController.delete)); // delete furniture by id, only owner can delete

// display a form for edit info:
router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  WrapAsync(furnitureController.editForm)
);

module.exports = router;
