const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Configuring dotenv
require('dotenv').config();

// Environment variables
const PORT = process.env.PORT || 8080;

// Routers
const currencyRouter = require('./routers/currency');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Setting routers
app.use('/api', currencyRouter);

app.listen(PORT, function () {
  console.log(`Server listening on localhost:${PORT}`);
});
