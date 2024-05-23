
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './Componets/Header';
import Sidebar from './Componets/Sidebar';
import Home from './Componets/Home'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from './Componets/Login';

import Payment from './Componets/Category/Payme';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevOpen) => !prevOpen);
  };

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  }

  useEffect(() => {
    const loggedIn = localStorage.getItem('astro_logged_in') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  return (
    <>
     <Router>
        {isLoggedIn ? (
          <div className='grid-container'>
            <Header OpenSidebar={OpenSidebar} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
            <Routes>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/payment" element={<Payment isDarkMode={isDarkMode} />} />
             
            </Routes>
            <ToastContainer closeButton={false} position="bottom-left" />
          </div>
        ) : (
          
          <Routes>
            <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          </Routes>
        )}
         <ToastContainer closeButton={false} position="bottom-left" />
      </Router>
    </>
    
  );
}


export default App;
