# Currency Exchange Server (NodeJS/Express App)

This sample application is designed to get quotes for specified currency pairs from:

- https://freecurrencyapi.net/

## Prerequisites
- Please make sure you have:
    - node.js installed (https://nodejs.org/)

## Setup
   - run `npm install` in root project folder

## Usage

To run the project, please open command line and run:
 - `npm start`
    - It will start the API server at port 3001

## Endpoints

 - `GET /api/quote` - get exchanged currency rate
### Query parameters
 - `from_currency_code` - String, 3 letters currency code. Currency to convert from. Examples: USD, EUR, ILS.
 - `to_currency_code` - String, 3 letters currency code. Currency to convert to. Examples: USD, EUR, ILS.
 - `amount` - Integer. The amount to convert in cents. Example: 100 (1 USD).
 
### Examples
 - Request: `http://localhost:3001/api/quote?from_currency_code=ILS&to_currency_code=EUR&amount=123500`
 - Response: 
     ```
     {
        "exchange_rate": 0.2542653004,
        "amount": 31402,
        "currency_code": "EUR"
     }
     ```
