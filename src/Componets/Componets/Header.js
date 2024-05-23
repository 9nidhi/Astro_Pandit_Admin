// // Header.js
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { FaMoon, FaRegMoon, FaCog, FaUser,FaBars } from 'react-icons/fa';

// const Header = ({ isDarkMode, setIsDarkMode,toggleSidebar  }) => {
//   const toggleDarkMode = () => {
//     setIsDarkMode((prevMode) => !prevMode);
//   };

//   useEffect(() => {
//     if (isDarkMode) {
//       document.body.classList.add('dark-mode');
//     } else {
//       document.body.classList.remove('dark-mode');
//     }
//   }, [isDarkMode]);

//   return (
//     <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 w-full fixed shadow-lg">
//       <div className="flex">
//         <div className="w-full border-gray-200">
//           <div className="h-16 justify-between items-center mx-auto px-4 flex">
//             <div>
//               <h1 className="text-white text-2xl font-extrabold">Admin Clothing Store</h1>
//             </div>
//             <div className="relative px-10 mt-3">
//               <button className="menu-toggle" onClick={toggleSidebar}>
//                 <FaBars className='text-2xl text-white' />
//               </button>
//             </div>
//             <div className="md:space-x-6 justify-end items-center ml-auto flex space-x-3">
//               <div className="relative">
//                 <button className="dark-mode-toggle" onClick={toggleDarkMode}>
//                   {isDarkMode ? (
//                     <FaMoon className='text-2xl text-white'/>
//                   ) : (
//                     <FaRegMoon className='text-2xl text-white'/>
//                   )}
//                 </button>
//               </div>
//               <div className="relative">
//                 <Link to="/settings" className="text-white">
//                   <FaCog className='text-2xl cursor-pointer' />
//                 </Link>
//               </div>
//               <div className="relative">
//                 <Link to="/profile" className="text-white">
//                   <FaUser className='text-2xl cursor-pointer' />
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Header;
