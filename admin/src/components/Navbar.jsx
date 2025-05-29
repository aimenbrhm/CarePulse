import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const logout = () => {
    navigate('/');
    aToken && setAToken('');
    aToken && localStorage.removeItem('aToken');
    dToken && setDToken('');
    dToken && localStorage.removeItem('dToken');
  };

  // Role and color scheme based on user type
  const isAdmin = !!aToken;
  const primaryColor = isAdmin ? 'indigo' : 'teal';
  const gradientFrom = isAdmin ? '#5f6FFF' : '#14b8a6';
  const gradientTo = isAdmin ? '#8a77ff' : '#0d9488';

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-50 w-full shadow-md border-b border-gray-100`}
      style={{
        background: `linear-gradient(to right, ${gradientFrom}15, ${gradientTo}10)`,
        backdropFilter: 'blur(8px)'
      }}
    >
      <div className="w-full px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo Section with Badge Next to it */}
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate(isAdmin ? '/admin' : '/doctor')}
              className="cursor-pointer flex items-center"
            >
              <svg width={130} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40">
                <path
                  d="M10,20 L20,20 L25,10 L30,30 L35,15 L40,20 L50,20"
                  fill="none"
                  stroke={gradientFrom}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M50,20 C50,16 55,10 60,10 C67,10 67,18 60,22 C55,24 50,23 50,20 Z"
                  fill={gradientFrom}
                />
                <text x="70" y="25" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="16">
                  <tspan fill={theme === 'dark' ? '#fff' : '#0f172a'}>Care</tspan><tspan fontWeight="600" fill={gradientFrom}>Pulse</tspan>
                </text>
              </svg>
            </motion.div>
            
            {/* Role Badge - Next to logo on desktop, centered on mobile */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium
                bg-${primaryColor}-100 text-${primaryColor}-800
                border border-${primaryColor}-200
                absolute left-1/2 transform -translate-x-1/2 sm:static sm:transform-none
                hidden sm:block
              `}
            >
              {isAdmin ? 'Admin Dashboard' : 'Doctor Portal'}
            </motion.div>
            
            {/* Mobile-only badge (centered) */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium
                bg-${primaryColor}-100 text-${primaryColor}-800
                border border-${primaryColor}-200
                absolute left-1/2 transform -translate-x-1/2
                sm:hidden
              `}
            >
              {isAdmin ? 'Admin Dashboard' : 'Doctor Portal'}
            </motion.div>
          </div>

          {/* Desktop only: show logout and dark mode toggle */}
          <div className="hidden md:flex items-center gap-2">
            <button
              className="relative px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white text-xs font-medium rounded-full shadow-sm hover:shadow-md transition-all overflow-hidden"
              onClick={logout}
            >
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </span>
            </button>
            <button
              className="ml-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;