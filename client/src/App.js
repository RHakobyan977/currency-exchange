import { useState, useEffect } from 'react';
import axios from 'axios';

// Material UI Components
import Switch from '@mui/material/Switch';

// Components
import Loader from './Components/Loader/Loader';
import Dropdown from 'react-dropdown';
import { HiSwitchHorizontal } from 'react-icons/hi';

// Styles
import './App.css';
import 'react-dropdown/style.css';

// Environment variables
const BASE_URL = process.env.REACT_APP_BASE_URL;

// Constants
const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  ILS: 'ILS'
};

function App() {
  const [ loading, setLoading ] = useState(false);
  const [ slowLoading, setSlowLoading ] = useState(false);
  const [ amount, setAmount ] = useState(0); // integer, in cents (1/100 of a unit)
  const [ currencies ] = useState(Object.values(CURRENCIES));
  const [ fromCurrency, setFromCurrency ] = useState(CURRENCIES.USD);
  const [ toCurrency, setToCurrency ] = useState(CURRENCIES.ILS);
  const [ exchangeRate, setExchangeRate ] = useState(0);
  const [ expectedAmount, setExpectedAmount ] = useState(0);

  useEffect(() => {
    if (amount > 0) {
      convert();
    }
  }, [ amount, fromCurrency, toCurrency ]);

  function convert() {
    setLoading(true);

    const query = new URLSearchParams({
      from_currency_code: fromCurrency,
      to_currency_code: toCurrency,
      amount
    }).toString();

    const url = `${BASE_URL}/api/quote?${query}`;

    axios.get(url)
      .then(res => new Promise(resolve => {
        if (slowLoading) {
          // Simulating slow loading (0-1 sec delay)
          setTimeout(() => resolve(res), Math.random() * 1000);
        } else {
          resolve(res);
        }
      }))
      .then(res => {
        const { exchange_rate, amount } = res.data;

        setExchangeRate(exchange_rate);
        setExpectedAmount(amount);

        setLoading(false);
      });
  }

  function handleAmountChange(event) {
    setAmount(Math.abs(event.target.value));
  }

  function handleFromCurrencyChange(event) {
    const value = event.value;

    // Flipping in case the opposite currency is selected
    if (value === toCurrency) {
      flip();
    } else {
      setFromCurrency(value);
    }
  }

  function handleToCurrencyChange(event) {
    const value = event.value;

    // Flipping in case the opposite currency is selected
    if (value === fromCurrency) {
      flip();
    } else {
      setToCurrency(value);
    }
  }

  function flip() {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  }

  return (
    <div className="App">
      <div className="heading">
        <p className="slow-loading-section">
          <span>Slow loading simulation is </span>
          {slowLoading ? (
            <span className="switch-status">ON</span>
          ) : (
            <span className="switch-status switch-off">OFF</span>
          )}
        </p>
        <Switch
          color="success"
          value={slowLoading}
          onChange={() => setSlowLoading(!slowLoading)}
        />
      </div>
      <div className="container">
        <div className="amount">
          <h3>Amount</h3>
          <input
            type="number"
            placeholder="Enter the amount"
            min={0}
            onChange={handleAmountChange}
          />
        </div>
      </div>
      <div className="container">
        <div className="middle">
          <h3>From</h3>
          <Dropdown
            options={currencies}
            value={fromCurrency}
            placeholder="From"
            onChange={handleFromCurrencyChange}
          />
        </div>
        <div className="switch">
          <HiSwitchHorizontal
            size="30px"
            onClick={() => flip()}
          />
        </div>
        <div className="right">
          <h3>To</h3>
          <Dropdown
            options={currencies}
            value={toCurrency}
            placeholder="To"
            onChange={handleToCurrencyChange}
          />
        </div>
      </div>
      {(amount > 0 && !loading) && (
        <div className="result">
          <h2>Exchange Rate:</h2>
          <p>{exchangeRate.toFixed(2)}</p>
          <h2>Expected Amount:</h2>
          <p>{(expectedAmount / 100).toFixed(2)} {toCurrency}</p>
        </div>
      )}
      {loading && <Loader/>}
    </div>
  );
}

export default App;
