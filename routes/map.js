const express = require('express');
const router = express.Router({ mergeParams: true });
const MapController = require('../controllers/map');

router.get('/', MapController.viewMap);

module.exports = router;
