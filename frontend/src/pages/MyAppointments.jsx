import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { loadStripe } from '@stripe/stripe-js'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import PrescriptionList from '../components/PrescriptionList'

// Dynamically load Stripe public key from environment variable if available
const stripePromise = loadStripe(import.meta.env.VITE_REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_51R2A9CKVomqfC25fyJr563aihg2dd8oZHDItlbAheVo9njpllfhI5gxSxK1Wy55woEXOLzVkbu6v40fjdWWw7YfF00AMIyVEuo');

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [paymentType, setPaymentType] = useState('')
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
      if (data.success) {
        setAppointments(data.appointments.reverse())
        console.log(data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const handlePayOnline = (appointment) => {
    setSelectedAppointment(appointment)
    setShowPaymentModal(true)
  }

  const handleStripePayment = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/payments/create-stripe-session', {
        appointmentId: selectedAppointment._id
      }, { headers: { token } })
      const stripe = await stripePromise
      await stripe.redirectToCheckout({ sessionId: data.sessionId })
    } catch (error) {
      toast.error('Stripe payment error: ' + error.message)
    }
  }

  const handlePayPalApprove = async (orderId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/payments/confirm-paypal-payment', {
        appointmentId: selectedAppointment._id,
        orderId
      }, { headers: { token } })
      if (data.success) {
        toast.success('Payment successful!')
        setShowPaymentModal(false)
        getUserAppointments()
      } else {
        toast.error('Payment failed!')
      }
    } catch (error) {
      toast.error('PayPal payment error: ' + error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div className="dark:text-white">
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b dark:text-white'>My appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b dark:border-gray-700' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-zinc-600 dark:text-white'>
              <p className='text-neutral-800 font-semibold dark:text-white'>{item.docData.name}</p>
              <p className='dark:text-white'>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1 dark:text-white'>Address:</p>
              <p className='text-xs dark:text-gray-200'>{item.docData.address.line1}</p>
              <p className='text-xs dark:text-gray-200'>{item.docData.address.line2}</p>
              <p className='text-sm mt-1'><span className='text-sm text-neutral-700 font-medium dark:text-white'>Date & Time: </span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end'>
              {!item.cancelled && !item.isCompleted &&
                <button
                  className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 dark:text-gray-200 dark:border-gray-500'
                  onClick={() => handlePayOnline(item)}
                >
                  Pay Online
                </button>
              }
              {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300 dark:text-gray-200 dark:border-gray-500'>Cancel appointment</button>}
              {/* Prescription List for user */}
              <PrescriptionList appointmentId={item._id} />
              {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500 dark:text-red-400 dark:border-red-400'>Appointment Cancelled</button>}
              {item.isCompleted && (
                <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500 dark:text-green-400 dark:border-green-400'>Appointment Completed</button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded shadow-lg p-6 min-w-[320px] dark:bg-gray-800'>
            <h2 className='font-bold mb-4 dark:text-white'>Choose Payment Method</h2>
            {!paymentType && (
              <div className='flex flex-col gap-3'>
                <button onClick={() => setPaymentType('stripe')} className='bg-blue-500 text-white py-2 rounded dark:bg-blue-600'>Pay with Credit Card</button>
                <button onClick={() => setPaymentType('paypal')} className='bg-yellow-400 text-black py-2 rounded dark:bg-yellow-500 dark:text-white'>Pay with PayPal</button>
                <button onClick={() => setShowPaymentModal(false)} className='mt-2 text-gray-500 dark:text-gray-200'>Cancel</button>
              </div>
            )}
            {paymentType === 'stripe' && (
              <div>
                <button onClick={handleStripePayment} className='bg-blue-500 text-white py-2 rounded w-full dark:bg-blue-600'>Proceed to Stripe</button>
                <button onClick={() => setPaymentType('')} className='mt-2 text-gray-500 w-full dark:text-gray-200'>Back</button>
              </div>
            )}
            {paymentType === 'paypal' && (
              <PayPalScriptProvider options={{ 'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test' }}>
                <PayPalButtons
                  createOrder={async (data, actions) => {
                    const res = await axios.post(backendUrl + '/api/payments/create-paypal-order', {
                      appointmentId: selectedAppointment._id
                    }, { headers: { token } })
                    return res.data.orderID
                  }}
                  onApprove={async (data, actions) => {
                    await handlePayPalApprove(data.orderID)
                  }}
                  onCancel={() => setShowPaymentModal(false)}
                  onError={(err) => toast.error('PayPal error: ' + err)}
                />
                <button onClick={() => setPaymentType('')} className='mt-2 text-gray-500 w-full dark:text-gray-200'>Back</button>
              </PayPalScriptProvider>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyAppointments
