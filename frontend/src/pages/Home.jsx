import React from 'react';
import Header from '../compenents/Header.jsx';
import SpecialityMenu from '../compenents/SpecialityMenu.jsx';
import TopDoctors from '../compenents/TopDoctors.jsx';
import Banner from '../compenents/Banner.jsx';
import Testimonials from '../compenents/Testimonials .jsx'; 
import Footer from '../compenents/Footer.jsx'; // New component

const Home = () => {
  return (
    <div className="bg-gray-50 overflow-hidden dark:bg-gray-900 dark:text-gray-100">
      <Header/>
      
        <br></br>
        <SpecialityMenu />
        
        <TopDoctors/>
        <Testimonials />
        <Banner />
      
      
    </div>
  )
}

export default Home;