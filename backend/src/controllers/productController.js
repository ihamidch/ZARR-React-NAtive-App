const shopifyService = require('../services/shopifyService');

const getProducts = async (req, res) => {
  try {
    const products = await shopifyService.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

const getProductByHandle = async (req, res) => {
  try {
    const product = await shopifyService.getProductByHandle(req.params.handle);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

const getCollections = async (req, res) => {
  try {
    const collections = await shopifyService.getCollections();
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching collections', error: error.message });
  }
};

const getProductsByCollection = async (req, res) => {
  try {
    const products = await shopifyService.getProductsByCollection(req.params.handle);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching collection products', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductByHandle,
  getCollections,
  getProductsByCollection,
};
