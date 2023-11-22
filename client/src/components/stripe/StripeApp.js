import React from 'react';
// Components
import HomePage from './HomePage';
// Stripe
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
// Styles
// import '../index.scss';

const stripePromise = loadStripe('pk_test_51OFJVzD3rnaRGeMUR8E2C1rfyoSeoCatL7RLc59M0TYVyWCxbaNhSlbEUqcOZxSyUhIrUoqBBa8QwRbbk5zSKXbs00i4qQsEIu');

function App() {
  return (
    <Elements stripe={stripePromise}>
      <HomePage />
    </Elements>
  );
}

export default App;