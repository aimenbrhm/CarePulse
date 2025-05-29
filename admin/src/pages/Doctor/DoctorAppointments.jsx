import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';
import PrescriptionUpload from '../../components/PrescriptionUpload';
import PrescriptionList from '../../components/PrescriptionList';

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (dToken) {
      const fetchData = async () => {
        setIsLoading(true);
        await getAppointments();
        setIsLoading(false);
      };
      fetchData();
    }
  }, [dToken]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className='w-full mx-auto p-8 bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-800 dark:text-white'>Appointment Management</h2>
        <div className='flex items-center'>
          <span className='mr-2 text-sm text-gray-600 dark:text-gray-200'>Total Appointments:</span>
          <span className='px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium'>
            {appointments.length}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto transition-colors duration-300 w-full sm:min-w-[1100px] min-w-0'
        >
          {/* Table Header */}
          <div className='hidden sm:grid grid-cols-12 gap-4 py-4 px-4 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-200 font-medium text-base border-b dark:border-gray-700 w-full'>
            <div className='col-span-1'>#</div>
            <div className='col-span-3'>Patient</div>
            <div className='col-span-1'>Payment</div>
            <div className='col-span-1'>Age</div>
            <div className='col-span-3'>Date & Time</div>
            <div className='col-span-1'>Fees</div>
            <div className='col-span-2'>Status</div>
          </div>

          {appointments.length === 0 ? (
            <div className='p-8 text-center text-gray-500 dark:text-gray-200'>
              <img src={assets.empty_icon} alt="No appointments" className='w-24 mx-auto mb-4 opacity-70' />
              <p className='text-lg'>No appointments found</p>
              <p className='text-sm'>When patients book appointments, they'll appear here</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className='divide-y divide-gray-100 dark:divide-gray-700'
              style={{ fontSize: '1rem' }}
            >
              <AnimatePresence>
                {appointments.reverse().map((item, index) => (
                  <motion.div
                    key={item._id}
                    variants={itemVariants}
                    className='flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:gap-8 items-start sm:items-center py-4 px-2 sm:px-12 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 w-full text-sm sm:text-base'
                  >
                    {/* Mobile View Header */}
                    <div className='sm:hidden flex justify-between items-center mb-2'>
                      <span className='text-sm font-medium text-gray-500 dark:text-gray-200'>Appointment #{index + 1}</span>
                      {item.cancelled ? (
                        <span className='px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-medium'>Cancelled</span>
                      ) : item.isCompleted ? (
                        <span className='px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium'>Approved</span>
                      ) : (
                        <span className='px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-medium'>Pending</span>
                      )}
                    </div>

                    {/* Index */}
                    <div className='hidden sm:block text-gray-500 dark:text-gray-200 text-sm'>{index + 1}</div>

                    {/* Patient Info */}
                    <div className='col-span-3 flex items-center space-x-3'>
                      <img 
                        className='w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm' 
                        src={item.userData.image || assets.default_profile} 
                        alt={item.userData.name} 
                      />
                      <div>
                        <p className='font-medium text-gray-800 dark:text-white'>{item.userData.name}</p>
                        <p className='text-xs text-gray-500 dark:text-gray-200 sm:hidden'>Age: {calculateAge(item.userData.dob)}</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className='col-span-1'>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.payment ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                      }`}>
                        {item.payment ? 'Online' : 'Cash'}
                      </span>
                    </div>

                    {/* Age */}
                    <div className='hidden sm:block text-gray-600 dark:text-gray-200 text-sm'>
                      {calculateAge(item.userData.dob)}
                    </div>

                    {/* Date & Time */}
                    <div className='col-span-3'>
                      <p className='text-gray-800 dark:text-white font-medium'>{slotDateFormat(item.slotDate)}</p>
                      <p className='text-sm text-gray-500 dark:text-gray-200'>{item.slotTime}</p>
                    </div>

                    {/* Fees */}
                    <div className='text-gray-800 dark:text-white font-medium'>
                      {currency}{item.amount}
                    </div>

                    {/* Actions/Status */}
                    <div className='col-span-2 flex flex-col gap-2 justify-end sm:justify-start'>
                      {item.cancelled ? (
                        <span className='px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-medium hidden sm:inline-flex'>
                          Cancelled
                        </span>
                      ) : item.isCompleted ? (
                        <span className='px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium hidden sm:inline-flex'>
                          Approved
                        </span>
                      ) : (
                        <div className='flex space-x-2'>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => cancelAppointment(item._id)}
                            className='p-2 bg-red-50 dark:bg-red-900 text-red-500 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-800 transition-colors'
                            aria-label='Cancel appointment'
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => completeAppointment(item._id)}
                            className='p-2 bg-green-50 dark:bg-green-900 text-green-500 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-800 transition-colors'
                            aria-label='Complete appointment'
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.button>
                        </div>
                      )}
                      {/* Prescription Upload & List */}
                      <PrescriptionUpload appointmentId={item._id} onUploaded={() => {}} />
                      <PrescriptionList appointmentId={item._id} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default DoctorAppointments;