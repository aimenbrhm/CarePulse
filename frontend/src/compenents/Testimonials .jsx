import React from 'react';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Found the perfect cardiologist within minutes. The appointment was seamless and the doctor was exceptional.",
      name: "Sarah Johnson",
      role: "Heart Patient",
      rating: 5
    },
    {
      quote: "As a busy professional, the ability to book appointments online has been a game-changer for my health.",
      name: "Michael Chen",
      role: "Tech Entrepreneur",
      rating: 5
    },
    {
      quote: "The doctors on this platform are highly qualified and truly care about their patients. Highly recommend!",
      name: "Emma Rodriguez",
      role: "Teacher",
      rating: 4
    }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4"
          >
            What Our Patients Say
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Don't just take our word for it - hear from our community.
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all p-8"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold mr-4">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{testimonial.name}</p>
                  <p className="text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials;