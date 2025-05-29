import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SpecialityMenu = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900 dark:text-gray-100" id="speciality">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4"
          >
            Find by Speciality
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Expert care across all major medical specialties. Find the right doctor for your needs.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 px-4 sm:px-0">
          {specialityData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <Link 
                onClick={() => scrollTo(0,0)}  
                className="flex flex-col items-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all duration-300 border border-transparent dark:border-gray-700 dark:hover:border-[#5f6FFF] hover:border-blue-100"
                to={`/doctors/${item.speciality}`}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-4">
                  <img className="w-full h-full sm:w-12 sm:h-12 object-contain" src={item.image} alt={item.speciality} />
                </div>
                <p className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-100 text-center">{item.speciality}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SpecialityMenu;