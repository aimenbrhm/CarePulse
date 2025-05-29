import React from 'react';
import { assets } from '../assets/assets';
import { FaHeartbeat, FaUserMd, FaCalendarAlt, FaChartLine, FaShieldAlt, FaMobileAlt } from 'react-icons/fa';
import { RiTeamFill } from 'react-icons/ri';
import { GiHealthNormal } from 'react-icons/gi';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const About = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen dark:from-gray-900 dark:to-gray-800 dark:text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#5f6FFF] to-[#3a4bff] text-white pt-28 pb-32 px-4 dark:from-blue-900 dark:to-blue-800">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/medical-cross.png')]"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <GiHealthNormal className="text-5xl mx-auto mb-6 text-blue-100 dark:text-white" />
          </motion.div>
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-4 text-white dark:text-white"
          >
            About <span className="text-blue-100">CarePulse</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl md:text-2xl max-w-2xl mx-auto font-light text-blue-100 dark:text-white"
          >
            Revolutionizing healthcare through technology and compassion
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Our Story */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row gap-12 items-center mb-20"
        >
          <div className="lg:w-1/2">
            <div className="relative group">
              <img 
                src={assets.about_image} 
                alt="CarePulse team" 
                className="rounded-3xl shadow-2xl w-full h-auto object-cover transform group-hover:scale-[1.01] transition duration-500"
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-white p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-lg dark:bg-gray-800">
              <RiTeamFill className="text-[#5f6FFF] text-3xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Our Story</h2>
            <div className="space-y-6 text-gray-600 dark:text-white">
              <p className="text-lg leading-relaxed">
                Founded in 2023, CarePulse began with a simple mission: to make healthcare accessible and stress-free. 
                Our team of healthcare professionals and technologists saw the challenges patients faced in managing 
                their care and knew there had to be a better way.
              </p>
              <p className="text-lg leading-relaxed">
                Today, CarePulse serves thousands of patients across the country, connecting them with top healthcare 
                providers and giving them control over their medical journey. We're proud to be at the forefront of 
                the digital health revolution.
              </p>
              <p className="font-medium text-gray-800 dark:text-white text-lg">
                Every day, we work to fulfill our promise: putting patients first in everything we do.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border-t-4 border-[#5f6FFF] hover:shadow-2xl transition duration-300"
          >
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <FaHeartbeat className="text-[#5f6FFF] text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Our Mission</h3>
            <p className="text-gray-600 dark:text-white text-lg">
              To empower individuals with intuitive tools that simplify healthcare management, 
              while providing providers with innovative solutions to deliver exceptional care.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border-t-4 border-[#5f6FFF] hover:shadow-2xl transition duration-300"
          >
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <FaChartLine className="text-[#5f6FFF] text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Our Vision</h3>
            <p className="text-gray-600 dark:text-white text-lg">
              A world where healthcare is seamless, personalized, and accessible to all - 
              where technology bridges gaps and creates meaningful connections between patients and providers.
            </p>
          </motion.div>
        </div>

        {/* Why Choose Us */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Why Choose CarePulse</h2>
          <p className="text-gray-600 dark:text-white max-w-2xl mx-auto text-lg">
            We're redefining what it means to manage your healthcare with these core advantages
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: <FaCalendarAlt className="text-[#5f6FFF] text-2xl" />,
              title: "Efficiency",
              desc: "Streamlined appointment scheduling that fits into your busy lifestyle, with automated reminders and waitlist options to get you seen faster."
            },
            {
              icon: <FaUserMd className="text-[#5f6FFF] text-2xl" />,
              title: "Quality Care",
              desc: "Access to a carefully vetted network of trusted healthcare professionals in your area, with verified patient reviews and transparent qualifications."
            },
            {
              icon: <FaMobileAlt className="text-[#5f6FFF] text-2xl" />,
              title: "Digital First",
              desc: "Our mobile-first platform gives you complete control of your healthcare journey from anywhere, with secure access to all your medical information."
            },
            {
              icon: <FaShieldAlt className="text-[#5f6FFF] text-2xl" />,
              title: "Security",
              desc: "Military-grade encryption protects your sensitive health data, with HIPAA-compliant protocols ensuring your information is always secure."
            },
            {
              icon: <FaHeartbeat className="text-[#5f6FFF] text-2xl" />,
              title: "Personalization",
              desc: "AI-powered recommendations and health insights tailored to your unique profile, helping you make informed decisions about your care."
            },
            {
              icon: <RiTeamFill className="text-[#5f6FFF] text-2xl" />,
              title: "Dedicated Support",
              desc: "Our care coordinators are available 24/7 to help with scheduling, insurance questions, or finding the right specialist for your needs."
            }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-xl transition duration-300 group hover:bg-gradient-to-br from-[#5f6FFF] to-[#3a4bff]"
            >
              <div className="bg-blue-100 group-hover:bg-white w-14 h-14 rounded-full flex items-center justify-center mb-6 transition duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-white dark:text-white mb-3">{item.title}</h3>
              <p className="text-gray-600 group-hover:text-blue-50 dark:text-white">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-[#5f6FFF] to-[#3a4bff] rounded-3xl shadow-2xl p-12 text-white mb-20 dark:from-blue-900 dark:to-blue-800"
        >
          <h2 className="text-3xl font-bold mb-12 text-center">CarePulse By The Numbers</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10K+", label: "Patients Served" },
              { value: "500+", label: "Healthcare Partners" },
              { value: "24/7", label: "Support Availability" },
              { value: "98%", label: "Patient Satisfaction" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-4"
              >
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team CTA */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 bg-gradient-to-br from-[#5f6FFF] to-[#3a4bff] p-12 text-white flex flex-col justify-center dark:from-blue-900 dark:to-blue-800">
              <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
              <p className="text-blue-100 mb-6 text-lg">
                We're always looking for passionate individuals to join our team of healthcare innovators.
              </p>
              <button className="bg-white text-[#5f6FFF] font-medium py-3 px-8 rounded-lg transition duration-300 hover:bg-blue-50 w-fit transform hover:-translate-y-1 dark:bg-gray-900 dark:text-white">
                Explore Careers
              </button>
            </div>
            <div className="md:w-1/2 p-12 bg-gradient-to-br from-gray-50 to-white dark:bg-gray-800">
              <h3 className="text-2xl font-bold text-black dark:text-black mb-4">Partner With Us</h3>
              <p className="text-black dark:text-black mb-6 text-lg">
                Healthcare providers: Discover how CarePulse can help you deliver better patient experiences.
              </p>
              <button className="bg-gradient-to-r from-[#5f6FFF] to-[#3a4bff] text-white font-medium py-3 px-8 rounded-lg transition duration-300 hover:from-[#4a5ae8] hover:to-[#2d3bd6] w-fit transform hover:-translate-y-1 dark:from-blue-900 dark:to-blue-800">
                Learn About Partnerships
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;