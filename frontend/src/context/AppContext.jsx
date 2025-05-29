import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
export const AppContext = createContext()

const AppContextProvider = (props) => {
    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [doctors,setDoctors] = useState([])
    const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
    const [userData, setUserData] = useState(false) 

const getDoctorsData = async () => {
  try {
     const {data} = await axios.get(backendUrl + '/api/doctor/list')
     if (data.success) {
       // Ensure every doctor has a rating property
       setDoctors(data.doctors.map(doc => ({ ...doc, rating: typeof doc.rating === 'number' ? doc.rating : 0 })));
     } else {
      toast.error(data.message)
     }
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
}
const loadUserProfileData = async ()=>{
  try {
    const {data} = await axios.get(backendUrl + '/api/user/get-profile',{headers:{token}})
    if (data.success) {
      setUserData(data.userData)
    } else {
      // Token is invalid or expired
      setToken(false)
      localStorage.removeItem('token')
      setUserData(false)
      toast.error('Session expired or invalid. Please log in again.')
    }
  } catch (error) {
    setToken(false)
    localStorage.removeItem('token')
    setUserData(false)
    toast.error('Session expired or invalid. Please log in again.')
  }
}
const value = {
  doctors, getDoctorsData,
  currencySymbol,
  token,setToken,
  backendUrl,
  userData, setUserData ,
  loadUserProfileData
 }
useEffect(()=>{
  getDoctorsData()
},[])
useEffect(()=>{
 if (token) {
   loadUserProfileData()
 } else {
  setUserData(false)
 }
},[token])
return(
  <AppContext.Provider value={value}>
    {props.children}
  </AppContext.Provider>

)
}
export default AppContextProvider