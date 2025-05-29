import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const { theme, toggleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const logout = () => {
    setToken(false);
    localStorage.removeItem('token');
    navigate('/');
  };

  const navLinks = [
    { path: '/', name: 'HOME' },
    { path: '/doctors', name: 'DOCTORS' },
    { path: '/about', name: 'ABOUT US' },
    { path: '/blog', name: 'BLOG' },
    { path: '/faq', name: 'FAQ' },
    { path: '/contact', name: 'CONTACT US' },
    { path: '/reviews', name: 'FEEDBACK' }
  ];

  const userMenu = [
    { name: 'My Profile', action: () => navigate('/my-profile') },
    { name: 'My Appointments', action: () => navigate('/my-appointments') },
    { name: 'My Medical Record', action: () => navigate('/my-medical-record') },
    { name: 'Logout', action: logout }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
            className="flex-shrink-0 cursor-pointer"
          >
            <svg width={200} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40">
              <path 
                d="M10,20 L20,20 L25,10 L30,30 L35,15 L40,20 L50,20" 
                fill="none" 
                stroke="#5f6FFF" 
                strokeWidth="3" 
                strokeLinecap="round"
              />
              <path 
                d="M50,20 C50,16 55,10 60,10 C67,10 67,18 60,22 C55,24 50,23 50,20 Z" 
                fill="#5f6FFF"
              />
              <text x="70" y="25" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="16">
                <tspan className="logo-care" fill="#0f172a">Care</tspan><tspan fontWeight="600" fill="#5f6FFF">Pulse</tspan>
              </text>
            </svg>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => 
                    `relative px-1 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-[#5f6FFF]' : theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && (
                        <motion.div 
                          layoutId="navUnderline"
                          className={`absolute bottom-0 left-0 w-full h-0.5 ${theme === 'dark' ? 'bg-[#5f6FFF]' : 'bg-[#5f6FFF]'}`}
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="ml-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-200"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.7.7M4.34 19.66l-.7.7M21 12h-1M4 12H3m16.66 7.66l-.7-.7M4.34 4.34l-.7-.7M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                </svg>
              )}
            </button>

            {/* User/Auth Section */}
            {token && userData ? (
              <div className="relative ml-4">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img 
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#5f6FFF]/30 hover:border-[#5f6FFF]/50 transition-all"
                    src={userData.image || assets.default_profile} 
                    alt="User" 
                  />
                  <svg 
                    className={`w-4 h-4 text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 dark:bg-gray-700"
                    >
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b dark:text-gray-200">
                          <p>Hello, {userData.name?.split(' ')[0] || 'User'}</p>
                        </div>
                        {userMenu.map((item) => (
                          <button
                            key={item.name}
                            onClick={item.action}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { console.log('Navigating to /login'); navigate('/login'); }}
                className="ml-4 px-6 py-2 bg-gradient-to-r from-[#5f6FFF] to-[#8a77ff] text-white font-medium rounded-full shadow-sm hover:shadow-md transition-all"
              >
                Create account
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {token && userData && (
              <div className="mr-4">
                <img 
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#5f6FFF]/30"
                  src={userData.image || assets.default_profile} 
                  alt="User" 
                />
              </div>
            )}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none dark:text-gray-200 dark:hover:text-white"
            >
              <svg
                className={`h-6 w-6 transition-transform ${showMenu ? 'hidden' : 'block'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`h-6 w-6 transition-transform ${showMenu ? 'block' : 'hidden'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Fixed Version */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowMenu(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white shadow-xl z-50 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
                <svg width={160} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40">
                  <path 
                    d="M10,20 L20,20 L25,10 L30,30 L35,15 L40,20 L50,20" 
                    fill="none" 
                    stroke="#5f6FFF" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                  />
                  <path 
                    d="M50,20 C50,16 55,10 60,10 C67,10 67,18 60,22 C55,24 50,23 50,20 Z" 
                    fill="#5f6FFF"
                  />
                  <text x="70" y="25" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="16">
                    <tspan className="logo-care" fill="#0f172a">Care</tspan><tspan fontWeight="600" fill="#5f6FFF">Pulse</tspan>
                  </text>
                </svg>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-4 py-2 h-[calc(100%-68px)] overflow-y-auto">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setShowMenu(false)}
                    className={({ isActive }) => 
                      `block px-4 py-3 text-base font-medium rounded-lg my-1 ${
                        isActive ? 'bg-[#5f6FFF]/10 text-[#5f6FFF]' : theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}

                {token ? (
                  <div className="border-t mt-2 pt-2 dark:border-gray-700">
                    {userMenu.filter(item => item.name !== 'Logout').map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          item.action();
                          setShowMenu(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg my-1 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        {item.name}
                      </button>
                    ))}
                    {/* Dark Mode Toggle for Mobile */}
                    <button
                      onClick={toggleTheme}
                      className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg my-1 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white flex items-center gap-2"
                    >
                      <span>Dark Mode</span>
                      {theme === 'dark' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.7.7M4.34 19.66l-.7.7M21 12h-1M4 12H3m16.66 7.66l-.7-.7M4.34 4.34l-.7-.7M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                        </svg>
                      )}
                    </button>
                    {/* Logout always last */}
                    {userMenu.filter(item => item.name === 'Logout').map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          item.action();
                          setShowMenu(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-base font-medium text-red-500 hover:bg-gray-100 rounded-lg my-1 dark:text-red-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      navigate('/login');
                      setShowMenu(false);
                    }}
                    className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-[#5f6FFF] to-[#8a77ff] text-white font-medium rounded-lg shadow-sm"
                  >
                    Create account
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;