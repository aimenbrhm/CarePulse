import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 overflow-hidden bg-white dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-200 dark:bg-blue-900 rounded-full filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-indigo-200 dark:bg-indigo-900 rounded-full filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full filter blur-3xl opacity-10 animate-float animation-delay-4000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid md:grid-cols-2">
            {/* Content */}
            <div className="p-12 sm:p-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white dark:text-gray-100 mb-6"
              >
                Your Health Journey <br className="hidden sm:block" />Starts Here
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-lg text-blue-100 dark:text-gray-400 mb-8 max-w-lg"
              >
                Join our community of patients who found the perfect care with just a few clicks.
              </motion.p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => { if (typeof window !== 'undefined') { window.scrollTo(0,0); } navigate('/login'); }}
  className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 border-2 border-blue-600 hover:bg-blue-50 dark:bg-gradient-to-r dark:from-[#5f6FFF] dark:to-[#8a77ff] dark:text-white dark:border-0 dark:hover:from-[#6e7cff] dark:hover:to-[#a49bff]"
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
  </svg>
  Get Started
</motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { navigate('/doctors'); scrollTo(0,0) }}
                  className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 border-2 border-blue-600 hover:bg-blue-50 dark:bg-gradient-to-r dark:from-[#5f6FFF] dark:to-[#8a77ff] dark:text-white dark:border-0 dark:hover:from-[#6e7cff] dark:hover:to-[#a49bff]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Browse Doctors
                </motion.button>
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-10 flex items-center gap-3"
              >
                <div className="flex -space-x-2">

                    <img 
                    
                      className="w-28" 
                      src={assets.group_profiles} 
                      alt="Patient" 
                    />
                  
                </div>
                <div className="text-white dark:text-gray-100">
                  <p className="font-medium">Trusted by thousands</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm">4.9/5</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Image */}
            <div className="hidden md:block relative">
              <div className="absolute inset-0 bg-gradient-to-l from-blue-500 to-transparent opacity-20 dark:from-blue-400 dark:to-transparent"></div>
              <img 
                className="w-full h-full object-cover" 
                src={assets.appointment_img} 
                alt="Doctor and patient" 
              />
              
              {/* Floating badge */}
              <div className="absolute bottom-8 left-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg max-w-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">Instant Appointments</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Book same-day visits with top specialists in your area.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner;