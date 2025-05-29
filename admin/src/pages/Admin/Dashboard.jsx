import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)
  const navigate = useNavigate()
  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])
  return dashData && (
    <div className='m-5 bg-white text-gray-900 dark:bg-[#151a23] dark:text-gray-200 transition-colors duration-300'>
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white dark:bg-[#1d2330] p-4 min-w-52 rounded border-2 border-gray-100 dark:border-gray-800 cursor-pointer hover:scale-105 transition-all w-full md:w-auto'>
          <img className='w-14' src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600 dark:text-white'>{dashData.doctors}</p>
            <p className='text-gray-600 dark:text-white'>Doctors</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white dark:bg-[#1d2330] p-4 min-w-52 rounded border-2 border-gray-100 dark:border-gray-800 cursor-pointer hover:scale-105 transition-all w-full md:w-auto'>
          <img className='w-14 ' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600 dark:text-white'>{dashData.appointments}</p>
            <p className='text-gray-600 dark:text-white'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white dark:bg-[#1d2330] p-4 min-w-52 rounded border-2 border-gray-100 dark:border-gray-800 cursor-pointer hover:scale-105 transition-all w-full md:w-auto'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600 dark:text-white'>{dashData.patients}</p>
            <p className='text-gray-600 dark:text-white'>Patients</p>
          </div>
        </div>
      </div>
      <div className='bg-white dark:bg-[#1d2330]'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border dark:border-gray-800'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>
        <div className='pt-4 border border-t-0 dark:border-gray-800'>
          {dashData.latestAppointments.slice(0, 10).map((item, index) => (
            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100 dark:hover:bg-[#2a3340]' key={index}>
              <img className='rounded-full w-10' src={item.docData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium dark:text-white'>{item.docData.name}</p>
                <p className='text-gray-600 dark:text-white'>{slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled
                ? <p className='text-red-400 text-xs font-medium '>Cancelled</p>
                : item.isCompleted
                  ? <p className='text-green-500 text-xs font-medium'>Approved</p>
                  : <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
              }
            </div>
          ))}
          <div className="flex justify-center mt-2 mb-3">
            <button
              onClick={() => navigate('/all-appointments')}
              className="relative px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white text-xs font-medium rounded-full shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
