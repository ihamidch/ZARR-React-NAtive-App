const express = require('express');
const router = express.Router();
const { getProducts, getProductByHandle, getCollections, getProductsByCollection } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/collections', getCollections);
router.get('/collections/:handle', getProductsByCollection);
router.get('/:handle', getProductByHandle);

module.exports = router;
