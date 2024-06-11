const express = require('express');
const { login, register, registerAdmin } = require('../controllers/auth');

const app = express();

app.post('/register', register);
app.post('/register-admin', registerAdmin);
app.post('/login', login);

module.exports = app;
