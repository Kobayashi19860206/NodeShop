const path = require('path');

const express = require('express');

const productsController = require('../controllers/products');

const router = express.Router();

// Using get so that the order doesn't matter in app.js (then it's an exact match, unlike with router.use [same for app.use])
router.get('/', productsController.getProducts);

module.exports = router;
