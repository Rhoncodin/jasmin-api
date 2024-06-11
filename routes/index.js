const express = require('express');
const app = express();

const register = require('./auth');
const product = require('./product');

app.use(register);
app.use(product);

module.exports = app;
