import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      await fetch('/api/payment/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      }).then(res => res.json()).then(data => data.clientSecret),
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    );

    if (error) {
      console.error(error);
    } else if (paymentIntent.status === 'succeeded') {
      onSuccess(); // Call this after successful payment
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <CardElement className="card-element" />
      <button type="submit" disabled={!stripe}>
        Pay ${amount}
      </button>
    </form>
  );
};

export const PaymentModal = ({ amount, onSuccess, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg w-96">
      <button onClick={onClose} className="float-right font-bold">×</button>
      <Elements stripe={stripePromise}>
        <CheckoutForm amount={amount} onSuccess={onSuccess} />
      </Elements>
    </div>
  </div>
);