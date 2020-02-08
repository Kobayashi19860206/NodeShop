const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

// Like a mini Express app pluggable into the other Express app
const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', (req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

// /admin/add-product => POST
router.post('/add-product', (req, res) => {
  // Get body of incoming request with body field provided by Express
  // By default, request doesn't try to parse incoming request body. To do that, have to register a parser by adding another middleware (done above)
  // Once parser is registered, yields JavaScript object with key-value pair
  console.log(req.body);
  // Don't have to set status code and location header using this Express convenience method
  res.redirect('/');
});

module.exports = router;
