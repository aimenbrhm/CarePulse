import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'


const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progressBar, setProgressBar] = useState(0)
  const [activeTab, setActiveTab] = useState('personal')

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

  const calculateProfileCompletion = () => {
    if (!userData) return 0
    
    const fields = [
      !!userData.name,
      !!userData.phone,
      !!userData.address?.line1,
      !!userData.gender,
      !!userData.dob,
      !!userData.image
    ]
    
    return Math.round((fields.filter(Boolean).length / fields.length) * 100)
  }

  const updateUserProfileData = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)

      image && formData.append('image', image)
      
      const { data } = await axios.post(
        backendUrl + '/api/user/update-profile', 
        formData, 
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
        setProgressBar(100)
        setTimeout(() => setProgressBar(0), 500)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setTimeout(() => setIsLoading(false), 500)
    }
  }

  if (!userData) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#5f6FFF]"></div>
    </div>
  )

  const completionPercentage = calculateProfileCompletion()

  return (
    <div className="max-w-5xl mx-auto dark:bg-gray-900 dark:text-white">
      {/* Loading progress bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full z-50">
          <div className="h-1 bg-[#5f6FFF]" style={{ width: `${progressBar}%`, transition: 'width 0.3s ease-in-out' }}></div>
        </div>
      )}
      
      <div className="bg-white text-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:bg-gray-800 dark:text-white">
        {/* Header section */}
        <div className="relative h-64 bg-gradient-to-r from-[#5f6FFF] to-[#8a77ff] p-8">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-.895-3-2-3-3 .895-3 2 .895 3 2 3zm63 31c1.657 0 3-1.343 3-3s-.895-3-2-3-3 .895-3 2 .895 3 2 3zM34 90c1.657 0 3-1.343 3-3s-.895-3-2-3-3 .895-3 2 .895 3 2 3zm56-76c1.657 0 3-1.343 3-3s-.895-3-2-3-3 .895-3 2 .895 3 2 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
              backgroundSize: '30px 30px'
            }}></div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#8a77ff] to-transparent"></div>
          
          <div className="relative flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-white">My Profile</h1>
            
            {!isEdit && (
              <button 
                className="flex items-center gap-2 bg-white text-[#5f6FFF] hover:bg-gray-100 px-4 py-2 rounded-full transition-all dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
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
        <div className="relative z-10 -mt-20 px-8 pb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left sidebar */}
            <div className={`w-full lg:w-1/3 ${isEdit ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-200 mb-8 dark:bg-gray-800 dark:text-white">
                <div className="p-6 flex flex-col items-center">
                  {/* Profile image */}
                  <div className="mb-6 relative">
                    {isEdit ? (
                      <label htmlFor="image" className="cursor-pointer group relative">
                        <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                          <img 
                            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                            src={image ? URL.createObjectURL(image) : userData.image || assets.default_profile} 
                            alt="Profile" 
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="bg-white p-2 rounded-full">
                              <svg className="w-6 h-6 text-[#5f6FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <input 
                          onChange={(e) => setImage(e.target.files[0])} 
                          type="file" 
                          id="image" 
                          accept="image/*"
                          className="hidden" 
                        />
                      </label>
                    ) : (
                      <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                        <img 
                          className="w-full h-full object-cover"
                          src={userData.image || assets.default_profile} 
                          alt="Profile" 
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Name */}
                  <div className="w-full mb-2">
                    {isEdit ? (
                      <input 
                        className="w-full text-center text-2xl font-bold text-black bg-white border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent dark:bg-white dark:text-black dark:border-gray-700 placeholder:text-black"
                        type="text" 
                        value={userData.name || ''} 
                        onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} 
                        placeholder="Your name"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">{userData.name}</h2>
                    )}
                  </div>
                  
                  {/* Email */}
                  <p className="mb-6 text-center text-gray-700 dark:text-white">{userData.email}</p>
                  
                  {/* Profile completion */}
                  <div className="w-full mb-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-white">Profile completion</span>
                      <span className={`font-medium ${completionPercentage >= 80 ? 'text-green-600' : completionPercentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          completionPercentage >= 80 ? 'bg-green-500' : 
                          completionPercentage >= 50 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${completionPercentage}%`, transition: 'width 0.5s ease' }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Mini navigation */}
                <div className="border-t border-gray-200">
                  <div className="grid grid-cols-2 divide-x divide-gray-200">
                    <button 
                      className={`py-4 text-center transition-colors ${activeTab === 'personal' ? 'text-[#5f6FFF] font-medium' : 'text-white hover:text-[#5f6FFF]'}`}
                      onClick={() => setActiveTab('personal')}
                    >
                      Personal Info
                    </button>
                    <button 
                      className={`py-4 text-center transition-colors ${activeTab === 'contact' ? 'text-[#5f6FFF] font-medium' : 'text-white hover:text-[#5f6FFF]'}`}
                      onClick={() => setActiveTab('contact')}
                    >
                      Contact Info
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Mobile only tab switcher */}
              <div className="lg:hidden mb-8">
                <div className="bg-gray-100 rounded-2xl p-1 flex">
                  <button 
                    className={`flex-1 py-2 rounded-xl text-center text-sm font-medium transition-all ${activeTab === 'personal' ? 'bg-[#5f6FFF] text-white shadow-md' : 'text-black'}`}
                    onClick={() => setActiveTab('personal')}
                  >
                    Personal Info
                  </button>
                  <button 
                    className={`flex-1 py-2 rounded-xl text-center text-sm font-medium transition-all ${activeTab === 'contact' ? 'bg-[#5f6FFF] text-white shadow-md' : 'text-black'}`}
                    onClick={() => setActiveTab('contact')}
                  >
                    Contact Info
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right content area */}
            <div className={`w-full lg:w-2/3 ${isEdit ? 'lg:order-1' : 'lg:order-2'}`}>
              {/* Personal Information */}
              <div className={`transition-all duration-300 ${(activeTab === 'personal' || activeTab === '') ? 'opacity-100 block' : 'hidden'} lg:opacity-100 lg:block`}>
                <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-200 mb-8 dark:bg-gray-800 dark:text-white">
                  <div className="p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-full bg-[#5f6FFF]/10 flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-[#5f6FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h3>
                    </div>
                    <div className="space-y-6">
                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Gender</label>
                        {isEdit ? (
  <select
    className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent dark:bg-white text-black dark:text-black dark:border-gray-700 placeholder:text-black"
    value={userData.gender || ""}
    onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}
  >
    <option value="">Select gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
  </select>
) : (
  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
    <p className="text-black">{userData.gender || "Not specified"}</p>
  </div>
)}
                      </div>
                      {/* Date of Birth */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Date of Birth</label>
                        {isEdit ? (
                          <input 
                            className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent dark:bg-white text-black dark:text-black dark:border-gray-700 placeholder:text-black"
                            type="date" 
                            value={userData.dob || ""} 
                            onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))} 
                          />
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <p className="text-black">{userData.dob ? new Date(userData.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Not specified"}</p>
                          </div>
                        )}
                      </div>
                      
                    </div>
                  </div>
                </div>
                {/* Mobile action buttons */}
                {isEdit && (
                  <div className="lg:hidden flex flex-col gap-4 items-center justify-center mb-8 sm:flex-row sm:gap-4 sm:justify-center">
                    <button 
                      className="w-48 sm:w-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-medium"
                      onClick={() => {
                        setIsEdit(false)
                        setImage(false)
                        loadUserProfileData() // Reset to original data
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button 
                      className={`w-48 sm:w-auto px-4 py-2 bg-gradient-to-r from-[#5f6FFF] to-[#8a77ff] hover:from-[#4a5ae8] hover:to-[#7a5fff] text-white rounded-xl transition-all font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      onClick={updateUserProfileData}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving Changes...
                        </span>
                      ) : <span>Save Changes</span>}
                    </button>
                  </div>
                )}
                {/* Contact Information */}
                <div className={`${activeTab === 'contact' ? 'block' : 'hidden'} lg:block`}>{/* Mobile: only show on Contact tab; Desktop: always show */}
                  <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-200 mb-8 dark:bg-gray-800 dark:text-white lg:hidden">
                    <div className="p-6">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 rounded-full bg-[#5f6FFF]/10 flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-[#5f6FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Information</h3>
                      </div>
                      <div className="space-y-6">
                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Phone Number</label>
                          {isEdit ? (
                            <input 
                              className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent dark:bg-white text-black dark:text-black dark:border-gray-700 placeholder:text-black"
                              type="text" 
                              value={userData.phone || ""} 
                              onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} 
                              placeholder="Your phone number"
                            />
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-black">{userData.phone || "Not specified"}</p>
                            </div>
                          )}
                        </div>
                        {/* Address */}
                        <div>
                          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Address</label>
                          {isEdit ? (
                            <div className="space-y-3">
                              <input 
                                className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent dark:bg-white text-black dark:text-black dark:border-gray-700 placeholder:text-black"
                                placeholder="Address line 1"
                                value={userData.address?.line1 || ""} 
                                onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} 
                              />
                              <input 
                                className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent dark:bg-white text-black dark:text-black dark:border-gray-700 placeholder:text-black"
                                placeholder="Address line 2 (optional)"
                                value={userData.address?.line2 || ""} 
                                onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} 
                              />
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              {userData.address?.line1 ? (
                                <div>
                                  <p className="text-black">{userData.address.line1}</p>
                                  {userData.address.line2 && <p className="mt-1 text-black">{userData.address.line2}</p>}
                                </div>
                              ) : (
                                <p className="text-black">Not specified</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Desktop version remains unchanged below via lg:block */}
                  <div className="hidden lg:block">
                    {/* Original desktop Contact Info content here (already present in your code) */}
                    <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-200 mb-8 dark:bg-gray-800 dark:text-white">
                      <div className="p-6">
                        <div className="flex items-center mb-6">
                          <div className="w-10 h-10 rounded-full bg-[#5f6FFF]/10 flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-[#5f6FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Information</h3>
                        </div>
                        <div className="space-y-6">
                          {/* Phone */}
                          <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Phone Number</label>
                            {isEdit ? (
                              <input 
                                className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent dark:bg-white text-black dark:text-black dark:border-gray-700 placeholder:text-black"
                                type="text" 
                                value={userData.phone || ""} 
                                onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} 
                                placeholder="Your phone number"
                              />
                            ) : (
                              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <p className="text-black">{userData.phone || "Not specified"}</p>
                              </div>
                            )}
                          </div>
                          {/* Address */}
                          <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Address</label>
                            {isEdit ? (
                              <div className="space-y-3">
                                <input 
                                  className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent dark:bg-white text-black dark:text-black dark:border-gray-700 placeholder:text-black"
                                  placeholder="Address line 1"
                                  value={userData.address?.line1 || ""} 
                                  onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} 
                                />
                                <input 
                                  className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF] focus:border-transparent dark:bg-white text-black dark:text-black dark:border-gray-700 placeholder:text-black"
                                  placeholder="Address line 2 (optional)"
                                  value={userData.address?.line2 || ""} 
                                  onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} 
                                />
                              </div>
                            ) : (
                              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                {userData.address?.line1 ? (
                                  <div>
                                    <p className="text-black">{userData.address.line1}</p>
                                    {userData.address.line2 && <p className="mt-1 text-black">{userData.address.line2}</p>}
                                  </div>
                                ) : (
                                  <p className="text-black">Not specified</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Desktop action buttons */}
        {isEdit && (
          <div className="hidden lg:flex flex-row gap-4 justify-center mb-8">
            <button 
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-medium"
              onClick={() => {
                setIsEdit(false)
                setImage(false)
                loadUserProfileData() // Reset to original data
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              className={`px-6 py-3 bg-gradient-to-r from-[#5f6FFF] to-[#8a77ff] hover:from-[#4a5ae8] hover:to-[#7a5fff] text-white rounded-xl transition-all font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={updateUserProfileData}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Changes...
                </div>
              ) : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyProfile