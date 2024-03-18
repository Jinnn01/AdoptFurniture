const express = require('express');
const multer = require('multer');

const furnitureController = require('../controllers/furnitures');
const router = express.Router();
const { validateFurniture } = require('../middleware/validate');
const WrapAsync = require('../services/WrapAsync');
const { isLoggedIn, storeReturnTo, isAuthor } = require('../middleware/auth');
const upload = multer();

router.get('/', furnitureController.index);
// display create furniture form
router.get('/newFurniture', isLoggedIn, furnitureController.newForm);

// add furniture
router.post(
  '/add',
  upload.array('fImage'),
  // isLoggedIn,
  // validateFurniture,
  // WrapAsync(furnitureController.createFurniture)
  WrapAsync(async (request, response) => {
    console.log(request.files);
  })
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
