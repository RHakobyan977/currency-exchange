const express = require('express');
const NodeCache = require('node-cache');
const axios = require('axios');
const { StatusCodes } = require('http-status-codes');

// Environment variables
const CACHE_STD_TTL = parseInt(process.env.CACHE_STD_TTL || 10);
const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;

// Constants
const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  ILS: 'ILS'
};

const cache = new NodeCache({ stdTTL: CACHE_STD_TTL }); // Cached items' time-to-live

const router = express.Router();

router.get('/quote',(req, res) => {
  try {
    // Query params
    const { amount, from_currency_code, to_currency_code } = req.query;

    // Checking if exchange rates are already cached
    if (cache.has(to_currency_code)) {
      let exchange_rate = cache.get(to_currency_code);

      // If just flipped currencies
      if (exchange_rate === 1) {
        exchange_rate = 1 / cache.get(from_currency_code);
      }

      // Calculating expected amount of quote currency
      const expected_amount = exchange_rate * parseFloat(amount);

      return res.status(StatusCodes.OK).json({
        exchange_rate,
        currency_code: to_currency_code,
        amount: expected_amount
      });
    } else {
      const query = new URLSearchParams({
        apikey: API_KEY,
        base_currency: from_currency_code,
        currencies: Object.values(CURRENCIES).join(','),
        value: amount
      }).toString();

      // URL for latest exchange rates
      const url = `${BASE_URL}/latest?${query}`;

      axios.get(url)
        .then(result => {
          const exchange_rates = result.data.data;

          // Caching exchange rate
          cache.mset(Object.values(exchange_rates).map(exchange_rate => ({
            key: exchange_rate.code,
            val: exchange_rate.value
          })));

          const exchange_rate = exchange_rates[to_currency_code].value;

          // Calculating expected amount of quote currency
          const expected_amount = exchange_rate * parseFloat(amount);

          return res.status(StatusCodes.OK).json({
            exchange_rate,
            currency_code: to_currency_code,
            amount: expected_amount
          });
        })
        .catch(error => {
          return result.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status_code: StatusCodes.INTERNAL_SERVER_ERROR,
            message: error
          });
        });
    }
  } catch (error) {
    return result.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status_code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error
    });
  }
});

module.exports = router;
