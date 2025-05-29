import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const Login = () => {
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeField, setActiveField] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { setAToken, backendUrl } = useContext(AdminContext)
  const { setDToken } = useContext(DoctorContext)
  const { theme, toggleTheme } = useTheme()

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      if (state === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        if (data.success) {
          localStorage.setItem('aToken', data.token)
          setAToken(data.token)
          toast.success('🔑 Admin login successful!')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
        if (data.success) {
          localStorage.setItem('dToken', data.token)
          setDToken(data.token)
          toast.success('🔑 Doctor login successful!')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || '🚨 Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-[#f6f9ff] to-[#eef2ff]'} p-4 transition-colors duration-300`}>
      <div className="absolute top-5 right-5">
        <button
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
            </svg>
          )}
        </button>
      </div>
      {theme === 'dark' && (
        <style>{`
          input, textarea, select {
            color: #fff !important;
            background-color: #232a36 !important;
          }
          input::placeholder {
            color: #bbb !important;
            opacity: 1 !important;
          }
          input:-webkit-autofill,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:active {
            -webkit-text-fill-color: #fff !important;
            box-shadow: 0 0 0px 1000px #232a36 inset !important;
            background-color: #232a36 !important;
            color: #fff !important;
          }
        `}</style>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className={`bg-white dark:bg-[#232a36] rounded-3xl shadow-xl overflow-hidden border border-[rgba(255,255,255,0.3)] dark:border-[rgba(0,0,0,0.3)] transition-colors duration-300`}>
          {/* Tab selector */}
          <div className="flex border-b border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setState('Admin')}
              className={`flex-1 py-5 font-medium text-sm transition-all duration-300 ${
                state === 'Admin'
                  ? `text-[#5f6FFF] border-b-2 border-[#5f6FFF] ${theme === 'dark' ? '' : 'bg-[#f8f9ff]'}`
                  : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
              }`}
            >
              ADMIN LOGIN
            </button>
            <button
              onClick={() => setState('Doctor')}
              className={`flex-1 py-5 font-medium text-sm transition-all duration-300 ${
                state === 'Doctor'
                  ? `text-[#5f6FFF] border-b-2 border-[#5f6FFF] ${theme === 'dark' ? '' : 'bg-[#f8f9ff]'}`
                  : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
              }`}
            >
              DOCTOR LOGIN
            </button>
          </div>

          <div className="p-8 pt-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              {state === 'Admin' ? 'Admin Portal' : 'Doctor Portal'}
            </h2>
            <p className="text-gray-500 dark:text-gray-200 text-sm mb-8">
              {state === 'Admin'
                ? 'Access admin dashboard'
                : 'Sign in to doctor account'}
            </p>

            <form onSubmit={onSubmitHandler} className="space-y-5">
              <div className="relative">
                <label
                  className={`absolute left-3 transition-all duration-200 ${
                    activeField === 'email' || email
                      ? 'top-[-0.75rem] text-xs bg-white dark:bg-[#232a36] px-1 text-[#5f6FFF]'
                      : 'top-3 text-gray-400 dark:text-gray-300'
                  }`}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent bg-white dark:bg-[#232a36] text-white placeholder-gray-400 dark:placeholder-gray-300"
                  style={{ color: '#fff', backgroundColor: theme === 'dark' ? '#232a36' : undefined }}
                  onFocus={() => setActiveField('email')}
                  onBlur={() => setActiveField(null)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <label
                  className={`absolute left-3 transition-all duration-200 ${
                    activeField === 'password' || password
                      ? 'top-[-0.75rem] text-xs bg-white dark:bg-[#232a36] px-1 text-[#5f6FFF]'
                      : 'top-3 text-gray-400 dark:text-gray-300'
                  }`}
                >
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent bg-white dark:bg-[#232a36] text-white placeholder-gray-400 dark:placeholder-gray-300"
                  style={{ color: '#fff', backgroundColor: theme === 'dark' ? '#232a36' : undefined }}
                  onFocus={() => setActiveField('password')}
                  onBlur={() => setActiveField(null)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#5f6FFF] to-[#8a77ff] text-white font-medium shadow-md hover:shadow-lg transition-all ${
                  isLoading ? 'opacity-80' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-200">
              {state === 'Admin' ? (
                <p>
                  Doctor login?{' '}
                  <button
                    onClick={() => setState('Doctor')}
                    className="text-[#5f6FFF] font-medium hover:underline"
                  >
                    Click here
                  </button>
                </p>
              ) : (
                <p>
                  Admin login?{' '}
                  <button
                    onClick={() => setState('Admin')}
                    className="text-[#5f6FFF] font-medium hover:underline"
                  >
                    Click here
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-gray-400 dark:text-gray-300">
          <p>By continuing, you agree to our Terms and Conditions</p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login