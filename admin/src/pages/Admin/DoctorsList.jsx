import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const {doctors , aToken , getAllDoctors, changeAvailability} = useContext(AdminContext)
  useEffect(()=>{
  if (aToken) {
    getAllDoctors()
  }
  },[aToken])
  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300'>
      <h1 className='text-lg text-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6 '> 
        {
          doctors.map((item,index)=>(
            <div className='border border-indigo-200 dark:border-gray-700 rounded-xl max-w-56 overflow-hidden cursor-pointer group bg-white dark:bg-gray-800 dark:text-white' key={index}> 
           <img className='bg-indigo-50 dark:bg-gray-900 group-hover:bg-primary trasition-all duration-500' src={item.image} alt="" />
           <div className='p-4 '> 
            <p className='text-neutral-800 dark:text-white text-lg font-medium'>{item.name}</p>
            <p className='text-zinc-600 dark:text-gray-300 text-sm '>{item.speciality}</p>
            <div className='mt-2 flex items-center gap-1 text-sm '>
              <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} />
              <p>available</p>
            </div>
           </div>
  
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctorsList
