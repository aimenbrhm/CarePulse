import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const DoctorDashboard = () => {
  const { dToken, dashData, setDashData, getDashData, completeAppointment, cancelAppointment, getAppointments, appointments = [] } = useContext(DoctorContext)
  const { currency, slotDateFormat } = useContext(AppContext)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    if (dToken) {
      getDashData();
      getAppointments(); // Ensure appointments are loaded when dashboard mounts
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [dToken])

  // DEBUG: Log today's appointments and all appointments for troubleshooting
  useEffect(() => {
    if (appointments && appointments.length > 0) {
      console.log('ALL APPOINTMENTS:', appointments);
      const today = new Date();
      const filtered = appointments.filter(appointment => {
        if (!appointment.slotDate) return false;
        // Try to parse slotDate as both ISO and custom format
        let appointmentDate;
        if (typeof appointment.slotDate === 'string' && appointment.slotDate.includes('_')) {
          // Custom format: e.g. '18_4_2025_10_30' (DD_MM_YYYY_HH_mm)
          const [day, month, year, hour = 0, minute = 0] = appointment.slotDate.split('_').map(Number);
          appointmentDate = new Date(year, month - 1, day, hour, minute);
        } else {
          appointmentDate = new Date(appointment.slotDate);
        }
        return (
          appointmentDate.getDate() === today.getDate() &&
          appointmentDate.getMonth() === today.getMonth() &&
          appointmentDate.getFullYear() === today.getFullYear() &&
          !appointment.cancelled &&
          !appointment.isCompleted
        );
      });
      console.log('TODAYS APPOINTMENTS:', filtered);
    }
  }, [appointments]);

  // --- DEBUG: Log appointments to help user see what is missing for earnings ---
  useEffect(() => {
    if (appointments.length > 0) {
      console.log('ALL APPOINTMENTS:', appointments);
    }
  }, [appointments]);

  // --- Dynamic Chart Data Generation ---
  // Defensive: always use array
  const safeAppointments = Array.isArray(appointments) ? appointments : [];

  // --- Earnings by Month (use backend stat for current month, fallback to sum if needed) ---
  // Use dashData.earnings if available for current month
  let totalEarningsForMonth = 0;
  if (dashData && dashData.earnings) {
    totalEarningsForMonth = Number(dashData.earnings) || 0;
  } else {
    // fallback: sum all payment.amounts from appointments
    safeAppointments.forEach(app => {
      if (app.payment && (typeof app.payment.amount === 'number' || typeof app.payment.amount === 'string') && app.slotDate) {
        let dateObj;
        if (typeof app.slotDate === 'string' && app.slotDate.includes('_')) {
          const [day, month, year] = app.slotDate.split('_').map(Number);
          dateObj = new Date(year, month - 1, day);
        } else {
          dateObj = new Date(app.slotDate);
        }
        const amount = Number(app.payment.amount);
        if (!isNaN(dateObj) && !isNaN(amount) && dateObj.getMonth() === new Date().getMonth() && dateObj.getFullYear() === new Date().getFullYear()) {
          totalEarningsForMonth += amount;
        }
      }
    });
  }

  // Chart: Show current month's total as a single bar (visual summary)
  const earningsData = [
    { name: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }), value: totalEarningsForMonth }
  ];

  // --- Appointments by Day (for current month, dynamic X axis) ---
  const appointmentsByDay = Array(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()).fill(0);
  safeAppointments.forEach(app => {
    if (app.slotDate) {
      let dateObj;
      if (typeof app.slotDate === 'string' && app.slotDate.includes('_')) {
        const [day, month, year] = app.slotDate.split('_').map(Number);
        dateObj = new Date(year, month - 1, day);
      } else {
        dateObj = new Date(app.slotDate);
      }
      if (!isNaN(dateObj) && dateObj.getMonth() === new Date().getMonth() && dateObj.getFullYear() === new Date().getFullYear()) {
        appointmentsByDay[dateObj.getDate() - 1] += 1;
      }
    }
  });
  const appointmentsData = appointmentsByDay.map((value, idx) => ({
    name: String(idx + 1),
    value
  }));

  // Fetch today's appointments dynamically from all appointments
  const todaysAppointments = appointments.filter(appointment => {
    if (!appointment.slotDate) return false;
    const appointmentDate = new Date(appointment.slotDate);
    const today = new Date();
    return (
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear() &&
      !appointment.cancelled &&
      !appointment.isCompleted
    );
  });

  // Helper to robustly format slotDate
  function formatSlotDate(slotDate) {
    if (!slotDate) return 'N/A';
    if (typeof slotDate === 'string' && slotDate.includes('_')) {
      // Custom format: e.g. '18_4_2025_10_30' (DD_MM_YYYY_HH_mm)
      const [day, month, year, hour = 0, minute = 0] = slotDate.split('_').map(Number);
      const d = new Date(year, month - 1, day, hour, minute);
      if (!isNaN(d)) return d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    } else {
      const d = new Date(slotDate);
      if (!isNaN(d)) return d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    }
    return 'N/A';
  }

  // --- Appointments Filtering for Tabs ---
  let filteredAppointments = [];
  // Defensive: Ensure dashData.latestAppointments is always an array
  const safeLatestAppointments = (dashData && Array.isArray(dashData.latestAppointments)) ? dashData.latestAppointments : [];

  if (activeTab === 'all') {
    filteredAppointments = safeAppointments.slice(-10).reverse();
  } else {
    filteredAppointments = safeLatestAppointments.filter(app => {
      if (activeTab === 'upcoming') {
        return !app.cancelled && !app.isCompleted;
      } else if (activeTab === 'completed') {
        return app.isCompleted;
      } else if (activeTab === 'cancelled') {
        return app.cancelled;
      }
      return true;
    });
  }

  if (!dashData) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#5f6FFF]"></div>
    </div>
  )

  return (
    <div className="p-4 md:p-6 w-full max-w-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div className="w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-left">Doctor Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-200 text-left">Welcome back! Here's your overview</p>
        </div>
        <div className="w-full md:w-auto">
          <div className="relative">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <motion.div 
          whileHover={{ y: isMobile ? 0 : -5 }}
          className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-[#232a36] dark:to-[#232a36] rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-[#232a36]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-200 text-left">Total Earnings</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mt-1">{currency}{dashData.earnings}</p>
              <p className="text-xs md:text-sm text-green-500 dark:text-green-300 mt-2 flex items-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                12% from last month
              </p>
            </div>
            <div className="p-2 md:p-3 rounded-lg bg-white dark:bg-gray-800">
              <img className="w-6 h-6 md:w-8 md:h-8" src={assets.earning_icon} alt="Earnings" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: isMobile ? 0 : -5 }}
          className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-[#232a36] dark:to-[#232a36] rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-[#232a36]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-200 text-left">Appointments</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mt-1">{dashData.appointments}</p>
              <p className="text-xs md:text-sm text-blue-500 dark:text-blue-300 mt-2 flex items-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                5 new today
              </p>
            </div>
            <div className="p-2 md:p-3 rounded-lg bg-white dark:bg-gray-800">
              <img className="w-6 h-6 md:w-8 md:h-8" src={assets.appointments_icon} alt="Appointments" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: isMobile ? 0 : -5 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-[#232a36] dark:to-[#232a36] rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-[#232a36]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-200 text-left">Active Patients</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mt-1">{dashData.patients}</p>
              <p className="text-xs md:text-sm text-purple-500 dark:text-purple-300 mt-2 flex items-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                3 new this week
              </p>
            </div>
            <div className="p-2 md:p-3 rounded-lg bg-white dark:bg-gray-800">
              <img className="w-6 h-6 md:w-8 md:h-8" src={assets.patients_icon} alt="Patients" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Keep ONLY the Motivational/Insight Card */}
      <div className="w-full mb-6 md:mb-8">
        <div className="flex flex-col items-center justify-center rounded-xl md:rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-[#232a36] text-white bg-[#5f6FFF] dark:bg-[#7c3aed]">
          <div className="flex items-center gap-3 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 animate-bounce">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            </svg>
            <h2 className="text-xl md:text-2xl font-bold">Welcome, Doctor!</h2>
          </div>
          <p className="text-base md:text-lg font-medium mb-2 text-center max-w-2xl">
            "Every day you make a difference. Thank you for your dedication to patient care!"
          </p>
          <p className="text-sm md:text-base text-center opacity-90 max-w-2xl">
            Here's a quick tip: <span className="font-semibold">Stay updated with your patients' progress</span> and don't forget to review your upcoming appointments regularly. If you need to analyze trends, check the charts below for valuable insights!
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-[#232a36]">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-left">Earnings to  This Month</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="value" fill="#5f6FFF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-right text-sm text-gray-600 dark:text-gray-300 font-semibold">
            Total to this month: {currency}{totalEarningsForMonth}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-[#232a36]">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-left">Appointments This Month</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentsData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="value" fill="#5f6FFF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Appointments Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 dark:border-[#232a36] overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 dark:border-[#232a36]">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 md:mb-0 text-left">Patient Appointments</h3>
          <div className="flex flex-wrap gap-1 md:gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-lg ${activeTab === 'all' ? 'bg-[#5f6FFF] text-white' : 'text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-lg ${activeTab === 'upcoming' ? 'bg-[#5f6FFF] text-white' : 'text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-lg ${activeTab === 'completed' ? 'bg-[#5f6FFF] text-white' : 'text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-lg ${activeTab === 'cancelled' ? 'bg-[#5f6FFF] text-white' : 'text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              Cancelled
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-[#181d25]">
            <thead className="bg-gray-50 dark:bg-[#181d25]">
              <tr>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Patient</th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Service</th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-[#181d25]">
              {filteredAppointments.map((item, index) => (
                <motion.tr 
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10">
                        <img className="h-8 w-8 md:h-10 md:w-10 rounded-full" src={item.userData.image} alt="" />
                      </div>
                      <div className="ml-2 md:ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.userData.name}</div>
                        <div className="text-xs md:text-sm text-gray-500 dark:text-gray-200 truncate max-w-[100px] md:max-w-none">{item.userData.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatSlotDate(item.slotDate)}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-200">Consultation</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    {item.cancelled ? (
                      <span className="px-2 py-1 rounded bg-red-100 text-red-600 text-xs">Cancelled</span>
                    ) : item.isCompleted ? (
                      <span className="px-2 py-1 rounded bg-green-100 text-green-600 text-xs">Completed</span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-600 text-xs">Pending</span>
                    )}
                  </td>
                  <td className="px-2 md:px-4 py-4 whitespace-nowrap text-sm font-medium">
                    {!item.cancelled && !item.isCompleted && (
                      <div className="flex justify-start space-x-1 md:space-x-2">
                        <motion.button
                          whileHover={{ scale: isMobile ? 1 : 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => cancelAppointment(item._id)}
                          className="text-red-600 dark:text-red-300 hover:text-red-900 text-xs md:text-sm"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: isMobile ? 1 : 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => completeAppointment(item._id)}
                          className="text-green-600 dark:text-green-300 hover:text-green-900 text-xs md:text-sm"
                        >
                          Complete
                        </motion.button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View All Button for 'All' Tab */}
        {activeTab === 'all' && appointments.length > 10 && (
          <div className="flex justify-end px-4 pb-4">
            <button
              onClick={() => window.location.href = '/doctor-appointments'}
              className="mt-2 px-4 py-2 bg-[#5f6FFF] text-white rounded-lg hover:bg-[#4953c8] transition"
            >
              View All
            </button>
          </div>
        )}
      </div>

      {/* Appointment Detail Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full mx-2 sm:mx-auto"
              >
                <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                        Appointment Details
                      </h3>
                      <div className="mt-2">
                        <div className="flex items-center mb-4">
                          <div className="flex-shrink-0 h-10 w-10 md:h-12 md:w-12">
                            <img className="h-10 w-10 md:h-12 md:w-12 rounded-full" src={selectedAppointment.userData.image} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-base md:text-lg font-medium text-gray-900 dark:text-white">{selectedAppointment.userData.name}</div>
                            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-200 truncate max-w-[200px]">{selectedAppointment.userData.email}</div>
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-200">Date & Time</p>
                              <p className="text-xs md:text-sm font-medium text-gray-900 dark:text-white">{formatSlotDate(selectedAppointment.slotDate)}</p>
                            </div>
                            <div>
                              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-200">Service</p>
                              <p className="text-xs md:text-sm font-medium text-gray-900 dark:text-white">{selectedAppointment.service}</p>
                            </div>
                            <div>
                              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-200">Status</p>
                              <p className="text-xs md:text-sm font-medium text-gray-900 dark:text-white">
                                {selectedAppointment.cancelled ? "Cancelled" : 
                                 selectedAppointment.isCompleted ? "Completed" : "Pending"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-200">Patient ID</p>
                              <p className="text-xs md:text-sm font-medium text-gray-900 dark:text-white">{selectedAppointment._id.slice(0, 8)}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-200 mb-2">Notes</p>
                          <p className="text-xs md:text-sm text-gray-900 dark:text-white">
                            {selectedAppointment.notes || "No notes available for this appointment."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  {!selectedAppointment.cancelled && !selectedAppointment.isCompleted && (
                    <>
                      <button
                        type="button"
                        onClick={() => completeAppointment(selectedAppointment._id)}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 dark:bg-green-900 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm mb-2 sm:mb-0"
                      >
                        Complete
                      </button>
                      <button
                        type="button"
                        onClick={() => cancelAppointment(selectedAppointment._id)}
                        className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-red-700 dark:text-red-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm mb-2 sm:mb-0"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedAppointment(null)}
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DoctorDashboard