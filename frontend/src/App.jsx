import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment' 
import Reviews from './pages/Reviews'
import MedicalRecord from './pages/MedicalRecord'
import Navbar from './compenents/Navbar'
import Footer from './compenents/Footer'
import ScrollToTop from './components/ScrollToTop';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Blog from './pages/Blog';
import FAQ from './pages/FAQ';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
      <Navbar/>
      <ScrollToTop />
       <Routes>
        <Route  path='/' element={<Home/>}/>
        <Route  path='/doctors' element={<Doctors/>}/>
        <Route  path='/doctors/:speciality' element={<Doctors/>}/>
        <Route  path='/login' element={<Login/>}/>
        <Route  path='/about' element={<About/>}/>
        <Route  path='/blog' element={<Blog/>}/>
        <Route  path='/faq' element={<FAQ/>}/>
        <Route  path='/contact' element={<Contact/>}/>
        <Route  path='/my-profile' element={<PrivateRoute><MyProfile/></PrivateRoute>}/>
        <Route  path='/my-appointments' element={<PrivateRoute><MyAppointments/></PrivateRoute>}/>
        <Route  path='/my-medical-record' element={<PrivateRoute><MedicalRecord/></PrivateRoute>}/>
        <Route  path='/appointment/:docId' element={<PrivateRoute><Appointment/></PrivateRoute>}/>
        <Route  path='/reviews' element={<Reviews/>}/>
       </Routes>
       <br />
       <Footer />
    </div>
  )
}

export default App
