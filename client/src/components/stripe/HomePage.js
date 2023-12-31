import React, {useState} from 'react';
import axios from 'axios';
// MUI Components
import { Card, CardContent, TextField, Button } from '@mui/material';
// import '@mui/material/styles';
// stripe
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
// Util imports
// import {makeStyles} from '@material-ui/core/styles';
// Custom Components
import CardInput from './CardInput';

// const useStyles = makeStyles({
//   root: {
//     maxWidth: 500,
//     margin: '35vh auto',
//   },
//   content: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignContent: 'flex-start',
//   },
//   div: {
//     display: 'flex',
//     flexDirection: 'row',
//     alignContent: 'flex-start',
//     justifyContent: 'space-between',
//   },
//   button: {
//     margin: '2em auto 1em',
//   },
// });

function HomePage() {
//   const classes = useStyles();
  // State
  const [email, setEmail] = useState('');

  const stripe = useStripe();
  const elements = useElements();


  const handleSubmitSub = async (event) => {
    if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
    }

    const result = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
            email: email,
        },
    });

    if (result.error) {
        console.log(result.error.message);
    } else {
        const baseURL = process.env.NODE_ENV === 'production' ? `/api/sub` : `http://localhost:5000/api/sub`;

        const res = await axios.post(baseURL, { 'payment_method': result.paymentMethod.id, 'email': email });
        // eslint-disable-next-line camelcase
        const { client_secret, status } = res.data;

        if (status === 'requires_action') {
            stripe.confirmCardPayment(client_secret).then(function (result) {
                if (result.error) {
                    console.log('There was an issue!');
                    console.log(result.error);
                    // Display error message in your UI.
                    // The card was declined (i.e. insufficient funds, card has expired, etc)
                } else {
                    console.log('You got the money!');
                    // Show a success message to your customer
                }
            });
        } else {
            console.log('You got the money!');
            // No additional information was needed
            // Show a success message to your customer
        }
    }
};
  return (
    <Card >
      <CardContent >
        <TextField
          label='Email'
          id='outlined-email-input'
          helperText={`Email you'll recive updates and receipts on`}
          margin='normal'
          variant='outlined'
          type='email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <CardInput />
        <div >
          <Button variant="contained" color="primary"  onClick={handleSubmitSub}>
            Subscription
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default HomePage;