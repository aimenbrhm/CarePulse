import express from 'express'
import Stripe from 'stripe'
import axios from 'axios'

const router = express.Router()

// Stripe setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// PayPal setup (using HTTP API)
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_SECRET = process.env.PAYPAL_SECRET
const PAYPAL_API = process.env.PAYPAL_API || 'https://api-m.sandbox.paypal.com'

// Stripe: Create Checkout Session
router.post('/create-stripe-session', async (req, res) => {
  try {
    const { appointmentId } = req.body
    // TODO: Lookup appointment details and price
    const amount = 5000 // e.g., 50.00 USD in cents
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Appointment Payment' },
          unit_amount: amount
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/my-appointments?success=true`,
      cancel_url: `${req.headers.origin}/my-appointments?canceled=true`,
      metadata: { appointmentId }
    })
    res.json({ sessionId: session.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PayPal: Create Order
router.post('/create-paypal-order', async (req, res) => {
  try {
    const { appointmentId } = req.body
    // TODO: Lookup appointment details and price
    const amount = '50.00'
    // Get access token
    const basicAuth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64')
    const tokenRes = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, 'grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    const accessToken = tokenRes.data.access_token
    // Create order
    const orderRes = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, {
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: 'USD', value: amount } }]
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    res.json({ orderID: orderRes.data.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PayPal: Capture Payment
router.post('/confirm-paypal-payment', async (req, res) => {
  try {
    const { orderId } = req.body
    // Get access token
    const basicAuth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64')
    const tokenRes = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, 'grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    const accessToken = tokenRes.data.access_token
    // Capture order
    const captureRes = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {}, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    // TODO: Mark appointment as paid in DB
    res.json({ success: true, details: captureRes.data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router