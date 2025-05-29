import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaShieldAlt, FaCalendarAlt, FaSyncAlt, FaUserMd, FaLock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'How do I book an appointment?',
    answer: 'Go to the Doctors page, select a doctor, and choose an available slot to book your appointment. The process is seamless and takes just a few clicks.',
    icon: <FaCalendarAlt className="text-[#5f6FFF] text-2xl mr-3" />,
  },
  {
    question: 'Is my medical data secure?',
    answer: 'Absolutely. Your medical data is encrypted using advanced security protocols and is only accessible to you and authorized healthcare providers.',
    icon: <FaShieldAlt className="text-[#5f6FFF] text-2xl mr-3" />,
  },
  {
    question: 'Can I cancel appointments?',
    answer: 'Yes, you can easily cancel your appointments from the My Appointments page with a single click.',
    icon: <FaSyncAlt className="text-[#5f6FFF] text-2xl mr-3" />,
  },
  {
    question: 'Who are the doctors on this platform?',
    answer: 'All doctors are highly qualified, verified professionals with years of experience in their respective fields.',
    icon: <FaUserMd className="text-[#5f6FFF] text-2xl mr-3" />,
  },
  {
    question: 'How is my privacy protected?',
    answer: 'We employ strict privacy policies and cutting-edge encryption to ensure your information remains confidential and protected at all times.',
    icon: <FaLock className="text-[#5f6FFF] text-2xl mr-3" />,
  },
  {
    question: 'Can I access my medical record anytime?',
    answer: 'Yes, your medical record is always accessible from your profile, allowing you to view and share your health history securely.',
    icon: <FaLock className="text-[#5f6FFF] text-2xl mr-3" />,
  },
  {
    question: 'Is there support for international patients?',
    answer: 'Yes, our platform is designed to support patients globally, with multi-language support and international payment options.',
    icon: <FaShieldAlt className="text-[#5f6FFF] text-2xl mr-3" />,
  },
  {
    question: 'How do I give feedback about my experience?',
    answer: 'After your appointment, you can leave a review and rating for your doctor directly from the My Appointments or Reviews page.',
    icon: <FaUserMd className="text-[#5f6FFF] text-2xl mr-3" />,
  },
  {
    question: 'How do I submit a review for my doctor?',
    answer: 'After your appointment is completed, go to the Reviews page and click on “Leave a Review” for your doctor.',
    icon: <FaUserMd className="text-[#5f6FFF] text-2xl mr-3" />,
  },
  {
    question: 'How do I update my profile information?',
    answer: 'Go to your Profile page, click Edit, and update your details such as name, email, or password. Don’t forget to save your changes!',
    icon: <FaUserMd className="text-[#5f6FFF] text-2xl mr-3" />,
  },
];

import { useEffect } from 'react';

const FAQ = () => {
  const [openStates, setOpenStates] = useState(Array(faqs.length).fill(false));
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggle = idx => {
    setOpenStates(prev => {
      let updated = [...prev];
      if (isMobile) {
        // Only one open at a time on mobile
        updated = Array(faqs.length).fill(false);
        updated[idx] = !prev[idx];
      } else {
        // Desktop: toggle both in the row
        const siblingIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
        const shouldOpen = !prev[idx] || (siblingIdx >= 0 && siblingIdx < prev.length && !prev[siblingIdx]);
        updated[idx] = shouldOpen;
        if (siblingIdx >= 0 && siblingIdx < prev.length) {
          updated[siblingIdx] = shouldOpen;
        }
      }
      return updated;
    });
  };



  // Ensure only one FAQ is open at a time, even with grid layout
  // (the current logic already enforces this, but grid layout may cause a visual illusion)


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f8faff] via-[#e9e9ff] to-[#f6f7ff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4 flex flex-col items-center justify-center overflow-hidden">

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-[#5f6FFF] via-[#7f8fff] to-[#5f6FFF] bg-clip-text text-transparent mb-4 drop-shadow-lg">
          Frequently Asked Questions
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Everything you need to know about using our advanced healthcare platform.
        </p>
      </motion.div>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {faqs.map((faq, idx) => {
          const isOpen = openStates[idx];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="rounded-2xl shadow-xl bg-white dark:bg-gray-800 border border-[#e6eaff] dark:border-gray-700 overflow-hidden mb-4 md:mb-0"
            >
              <button
                onClick={() => handleToggle(idx)}
                className="w-full flex items-center justify-between px-3 py-4 md:px-6 md:py-5 focus:outline-none bg-gradient-to-r from-[#5f6FFF] to-[#8a77ff] text-white rounded-xl font-semibold shadow-md hover:brightness-105 focus:ring-2 focus:ring-[#5f6FFF] transition-all text-base md:text-lg"
              >
                <span className="flex items-center text-base md:text-lg font-semibold text-white">
                  {faq.icon}
                  {faq.question}
                </span>
                <span className="ml-2 md:ml-4">
                  {isOpen ? (
                    <FaChevronUp className="text-white text-xl md:text-2xl transition-transform duration-300" />
                  ) : (
                    <FaChevronDown className="text-white text-xl md:text-2xl transition-transform duration-300" />
                  )}
                </span>
              </button>
              <div className="relative">
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="px-4 md:px-8 pb-5 md:pb-6 text-gray-700 dark:text-gray-200 text-sm md:text-base leading-relaxed"
                  >
                    <div className="border-t border-[#e6eaff] dark:border-gray-700 pt-3 md:pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center"
      >
        <span className="block w-full sm:w-auto px-4 py-3 md:px-8 md:py-4 rounded-xl bg-gradient-to-r from-[#5f6FFF] to-[#8a77ff] text-white font-bold text-base md:text-xl shadow-lg tracking-wide mx-auto">
          Still have questions? <a href="/contact" className="underline hover:text-[#e9e9ff]">Contact us</a>
        </span>
      </motion.div>
    </div>
  );
};

export default FAQ;
