import React from 'react';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl overflow-hidden dark:from-gray-800 dark:to-gray-900">
      <div className="absolute inset-0 bg-[url('../assets/pattern.svg')] opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side */}
        <div className="space-y-6 text-white dark:text-gray-100">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
          >
            Find & Book <br className="hidden md:block" />
            <span className="text-blue-200">Trusted Doctors</span> Near You
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-blue-100 dark:text-gray-300 max-w-lg"
          >
            Connect instantly with healthcare professionals. Your wellness journey starts here.
          </motion.p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#speciality" 
              className="flex items-center justify-center gap-2 bg-white text-blue-600 rounded-full font-medium shadow-lg hover:shadow-xl transition-all border-2 border-blue-600 hover:bg-blue-50 dark:bg-gradient-to-r dark:from-[#5f6FFF] dark:to-[#8a77ff] dark:text-white dark:border-0 dark:hover:from-[#6e7cff] dark:hover:to-[#a49bff] px-8 py-3"
            >
              Book Appointment
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.a>
            
            <motion.button 
  type="button"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => { if (typeof window !== 'undefined') { window.scrollTo(0,0); } navigate('/doctors'); }}
  className="flex items-center justify-center gap-2 bg-white text-blue-600 rounded-full font-medium shadow-lg hover:shadow-xl transition-all border-2 border-blue-600 hover:bg-blue-50 dark:bg-gradient-to-r dark:from-[#5f6FFF] dark:to-[#8a77ff] dark:text-white dark:border-0 dark:hover:from-[#6e7cff] dark:hover:to-[#a49bff] px-8 py-3"
>
  Meet Our Doctors
</motion.button>
          </div>
          
          <div className="flex items-center gap-3 pt-4">
            <div className="flex -space-x-2">
              
              <img 
                  
                  className="w-28" 
                  src={assets.group_profiles} 
                  alt="Patient" 
                />
              
            </div>
            <div className="text-sm text-blue-100 dark:text-gray-300">
              <p className="font-medium">5000+ Happy Patients</p>
              <p>4.9/5 Average Rating</p>
            </div>
          </div>
        </div>
        
        {/* Right Side */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative hidden md:block"
        >
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -right-20 top-20 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <img 
            className="md:absolute w-full top-0 h-auto rounded-lg " 
            src={assets.header_img} 
            alt="Doctor consulting patient" 
          />
          
          <div className="absolute -bottom-20 -left-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-gray-700 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-300">Average Wait Time</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">Under 15 min</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Header;