const express = require('express');
const {
  getProducts,
  createProducts,
  updateProducts,
  deleteProducts,
} = require('../controllers/product');

const { uploadImage } = require('../middleware/upload');
const app = express();

app.get('/products', getProducts);
app.post('/products', uploadImage, createProducts);
app.put('/products', uploadImage, updateProducts);
app.delete('/products/:id', deleteProducts);

module.exports = app;
