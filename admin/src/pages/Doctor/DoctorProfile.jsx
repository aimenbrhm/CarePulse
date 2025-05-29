import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
  const { currency } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progressBar, setProgressBar] = useState(0)
  const [activeTab, setActiveTab] = useState('personal')
  
  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgressBar(prev => {
          if (prev >= 90) clearInterval(interval)
          return Math.min(prev + 10, 90)
        })
      }, 300)
      
      return () => clearInterval(interval)
    } else {
      setProgressBar(0)
    }
  }, [isLoading])

  const updateProfile = async (e) => {
    // Add preventDefault to prevent any form submission behavior
    if (e) e.preventDefault()
    
    setIsLoading(true)
    try {
      // Make sure we have the latest data before sending
      const updateData = {
        address: profileData?.address || {},
        fees: profileData?.fees || 0,
        available: profileData?.available || false
      }
      
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`, 
        updateData, 
        { headers: { dToken } }
      )
      
      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        await getProfileData()
        setProgressBar(100)
        setTimeout(() => setProgressBar(0), 500)
      } else {
        toast.error(data.message || 'Update failed')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error(error.response?.data?.message || error.message || 'Update failed')
    } finally {
      setTimeout(() => setIsLoading(false), 500)
    }
  }

  // Ensure we're properly rendering the loading state
  if (!profileData) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#5f6FFF]"></div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 bg-white dark:bg-[#181d25] text-gray-900 dark:text-white transition-colors duration-300">
      {/* Loading progress bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full z-50">
          <div className="h-1 bg-[#5f6FFF]" style={{ width: `${progressBar}%`, transition: 'width 0.3s ease-in-out' }}></div>
        </div>
      )}
      
      <div className="bg-white dark:bg-[#232a36] text-gray-800 dark:text-gray-100 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-[#232a36]">
        {/* Header section */}
        <div className="relative h-64 bg-[#5f6FFF] p-6 sm:p-8">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-.895-3-2-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-.895-3-2-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-.895-3-2-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-.895-3-2-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
              backgroundSize: '30px 30px'
            }}></div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#5f6FFF] to-transparent"></div>
          
          <div className="relative flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Doctor Profile</h1>
            
            {!isEdit && (
              <button 
                className="flex items-center gap-1 sm:gap-2 bg-white dark:bg-[#232a36] text-[#5f6FFF] hover:bg-gray-100 dark:hover:bg-[#181d25] px-3 py-1 sm:px-4 sm:py-2 rounded-full transition-all text-sm sm:text-base"
                onClick={() => setIsEdit(true)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>
        
        {/* Profile content container */}
        <div className="relative z-10 -mt-20 px-4 sm:px-8 pb-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left sidebar */}
            <div className={`w-full lg:w-1/3 ${isEdit ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="bg-white dark:bg-[#232a36] rounded-3xl shadow-md overflow-hidden border border-gray-200 dark:border-[#232a36] mb-6 sm:mb-8">
                <div className="p-4 sm:p-6 flex flex-col items-center">
                  {/* Profile image */}
                  <div className="mb-5 sm:mb-6 relative">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden ring-4 ring-white dark:ring-[#232a36] shadow-lg">
                      <img 
                        className="w-full h-full object-cover"
                        src={profileData.image} 
                        alt="Doctor Profile" 
                      />
                    </div>
                  </div>
                  
                  {/* Name */}
                  <div className="w-full mb-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">{profileData.name}</h2>
                  </div>
                  
                  {/* Specialty & Degree */}
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-200 text-center mb-2">{profileData.degree} - {profileData.speciality}</p>
                  
                  {/* Experience */}
                  <span className="px-3 py-1 bg-gray-100 dark:bg-[#232a36] text-gray-700 dark:text-gray-200 rounded-full text-sm mb-5 sm:mb-6">
                    {profileData.experience}
                  </span>
                  
                  {/* Availability status */}
                  <div className="w-full mb-5 sm:mb-6">
                    <div className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${profileData.available ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`}>
                      <span className={`w-3 h-3 rounded-full ${profileData.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="font-medium">{profileData.available ? 'Available' : 'Not Available'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Mini navigation */}
                <div className="border-t border-gray-200 dark:border-[#232a36]">
                  <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-[#232a36]">
                    <button 
                      className={`py-3 sm:py-4 text-center transition-colors ${activeTab === 'personal' ? 'text-[#5f6FFF] font-medium' : 'text-gray-600 dark:text-gray-200 hover:text-[#5f6FFF]'}`}
                      onClick={() => setActiveTab('personal')}
                    >
                      Personal Info
                    </button>
                    <button 
                      className={`py-3 sm:py-4 text-center transition-colors ${activeTab === 'contact' ? 'text-[#5f6FFF] font-medium' : 'text-gray-600 dark:text-gray-200 hover:text-[#5f6FFF]'}`}
                      onClick={() => setActiveTab('contact')}
                    >
                      Contact Info
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Mobile only tab switcher */}
              <div className="lg:hidden mb-6 sm:mb-8">
                <div className="bg-gray-100 dark:bg-[#232a36] rounded-2xl p-1 flex">
                  <button 
                    className={`flex-1 py-2 rounded-xl text-center text-sm font-medium transition-all ${activeTab === 'personal' ? 'bg-[#5f6FFF] text-white shadow-md' : 'text-gray-600 dark:text-gray-200'}`}
                    onClick={() => setActiveTab('personal')}
                  >
                    Personal Info
                  </button>
                  <button 
                    className={`flex-1 py-2 rounded-xl text-center text-sm font-medium transition-all ${activeTab === 'contact' ? 'bg-[#5f6FFF] text-white shadow-md' : 'text-gray-600 dark:text-gray-200'}`}
                    onClick={() => setActiveTab('contact')}
                  >
                    Contact Info
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right content area */}
            <div className={`w-full lg:w-2/3 ${isEdit ? 'lg:order-1' : 'lg:order-2'}`}>
              {/* Form wrapper to handle mobile form submission */}
              <form onSubmit={updateProfile}>
                {/* Personal Information */}
                <div className={activeTab === 'personal' ? 'block' : 'hidden lg:block'}>
                  <div className="bg-white dark:bg-[#232a36] rounded-3xl shadow-md overflow-hidden border border-gray-200 dark:border-[#232a36] mb-6 sm:mb-8">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center mb-5 sm:mb-6">
                        <div className="w-10 h-10 rounded-full bg-[#5f6FFF]/10 dark:bg-[#5f6FFF]/20 flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-[#5f6FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">Professional Information</h3>
                      </div>
                      
                      <div className="space-y-5 sm:space-y-6">
                        {/* About */}
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2">About</label>
                          <div className="bg-gray-50 dark:bg-white rounded-lg p-3 border border-gray-200 dark:border-gray-300">
                            <p className="text-gray-800 dark:text-gray-900">{profileData.about}</p>
                          </div>
                        </div>
                        
                        {/* Appointment Fee */}
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2">Appointment Fee</label>
                          {isEdit ? (
                            <div className="flex items-center">
                              <span className="bg-gray-200 dark:bg-[#232a36] px-3 py-3 rounded-l-lg text-gray-900 dark:text-gray-900">{currency}</span>
                              <input 
                                className="w-full bg-white text-gray-900 border border-gray-300 rounded-r-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent placeholder:text-gray-900 !text-gray-900"
                                type="number" 
                                value={profileData.fees || ""} 
                                onChange={(e) => setProfileData(prev => ({...prev, fees: e.target.value}))} 
                              />
                            </div>
                          ) : (
                            <div className="bg-gray-50 dark:bg-white rounded-lg p-3 border border-gray-200 dark:border-gray-300">
                              <p className="text-gray-900 font-medium">{currency} {profileData.fees}</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Availability toggle */}
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2">Availability Status</label>
                          {isEdit ? (
                            <div className="flex items-center">
                              <label className="inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer"
                                  checked={profileData.available || false}
                                  onChange={() => setProfileData(prev => ({...prev, available: !prev.available}))}
                                />
                                <div className="relative w-11 h-6 bg-gray-200 dark:bg-[#232a36] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5f6FFF]/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5f6FFF]"></div>
                                <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-200">{profileData.available ? 'Available' : 'Not Available'}</span>
                              </label>
                            </div>
                          ) : (
                            <div className="bg-gray-50 dark:bg-white rounded-lg p-3 border border-gray-200 dark:border-gray-300">
                              <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${profileData.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <p className="text-gray-800 dark:text-gray-900">{profileData.available ? 'Available for appointments' : 'Not available for appointments'}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className={activeTab === 'contact' ? 'block' : 'hidden lg:block'}>
                  <div className="bg-white dark:bg-[#232a36] rounded-3xl shadow-md overflow-hidden border border-gray-200 dark:border-[#232a36] mb-6 sm:mb-8">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center mb-5 sm:mb-6">
                        <div className="w-10 h-10 rounded-full bg-[#5f6FFF]/10 dark:bg-[#5f6FFF]/20 flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-[#5f6FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">Address Information</h3>
                      </div>
                      
                      <div className="space-y-5 sm:space-y-6">
                        {/* Address */}
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2">Address</label>
                          {isEdit ? (
                            <div className="space-y-3">
                              <input 
                                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent placeholder:text-gray-900 !text-gray-900"
                                placeholder="Address line 1"
                                value={profileData.address?.line1 || ""} 
                                onChange={(e) => setProfileData(prev => ({
                                  ...prev, 
                                  address: {...(prev.address || {}), line1: e.target.value}
                                }))} 
                              />
                              <input 
                                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent placeholder:text-gray-900 !text-gray-900"
                                placeholder="Address line 2 (optional)"
                                value={profileData.address?.line2 || ""} 
                                onChange={(e) => setProfileData(prev => ({
                                  ...prev, 
                                  address: {...(prev.address || {}), line2: e.target.value}
                                }))} 
                              />
                            </div>
                          ) : (
                            <div className="bg-gray-50 dark:bg-white rounded-lg p-3 border border-gray-200 dark:border-gray-300">
                              {profileData.address?.line1 ? (
                                <div>
                                  <p className="text-gray-900">{profileData.address.line1}</p>
                                  {profileData.address?.line2 && <p className="text-gray-900 mt-1">{profileData.address.line2}</p>}
                                </div>
                              ) : (
                                <p className="text-gray-900">Not specified</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                {isEdit && (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end mb-6 sm:mb-8">
                    <button 
                      type="button"
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-medium"
                      onClick={() => {
                        setIsEdit(false)
                        getProfileData() // Reset to original data
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className={`px-4 sm:px-6 py-2 sm:py-3 bg-[#5f6FFF] hover:bg-[#4752c4] text-white rounded-xl transition-colors font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving Changes...
                        </div>
                      ) : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile