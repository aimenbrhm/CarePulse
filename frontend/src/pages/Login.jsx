import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()
  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeField, setActiveField] = useState(null)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, password, email })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('✨ Account created successfully!')
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { password, email })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('🔑 Login successful!')
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || '🚨 Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
  if (token) navigate('/')
}, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4 dark:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[rgba(255,255,255,0.3)] dark:bg-[#0a0a12] dark:text-white">
          {/* Tab selector */}
          <div className="flex border-b border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setState('Login')}
              className={`flex-1 py-5 font-medium text-sm transition-all duration-300 ${
                state === 'Login' 
                  ? 'text-[#5f6FFF] border-b-2 border-[#5f6FFF] bg-[#f8f9ff] dark:bg-gray-900 dark:text-white' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
              }`}
            >
              SIGN IN
            </button>
            <button
              onClick={() => setState('Sign Up')}
              className={`flex-1 py-5 font-medium text-sm transition-all duration-300 ${
                state === 'Sign Up' 
                  ? 'text-[#5f6FFF] border-b-2 border-[#5f6FFF] bg-[#f8f9ff] dark:bg-gray-900 dark:text-white' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
              }`}
            >
              SIGN UP
            </button>
          </div>

          <div className="p-8 pt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-1 dark:text-white">
              {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-500 text-sm mb-8 dark:text-gray-300">
              {state === 'Sign Up' 
                ? 'Join us today' 
                : 'Sign in to continue'}
            </p>

            <form onSubmit={onSubmitHandler} className="space-y-5">
              {state === 'Sign Up' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent bg-white text-gray-800 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      onFocus={() => setActiveField('name')}
                      onBlur={() => setActiveField(null)}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Full Name"
                    />
                  </div>
                </motion.div>
              )}

              <div className="relative">
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent bg-white text-gray-800 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  onFocus={() => setActiveField('email')}
                  onBlur={() => setActiveField(null)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email Address"
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent bg-white text-gray-800 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  onFocus={() => setActiveField('password')}
                  onBlur={() => setActiveField(null)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
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
                  state === 'Sign Up' ? 'Create Account' : 'Sign In'
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-300">
              {state === 'Sign Up' ? (
                <p>
                  Already have an account?{' '}
                  <button 
                    onClick={() => setState('Login')} 
                    className="text-[#5f6FFF] font-medium hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => setState('Sign Up')} 
                    className="text-[#5f6FFF] font-medium hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          <p>By continuing, you agree to our Terms and Conditions</p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login