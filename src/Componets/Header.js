import React from 'react';

import { BsJustify } from 'react-icons/bs'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FaUnlockAlt } from "react-icons/fa";


function Header({ OpenSidebar }) {
    const navigate = useNavigate();
    
    const handelLogout = () => {
        localStorage.removeItem("token");
        navigate('/');
        window.location.reload()
    }

    return (
        <header className='header bg-[black]'>
            <div className='menu-icon'>
                <BsJustify size={20} fill='white' onClick={OpenSidebar} className='cursor-pointer' />
            </div>
            <div className='header-left'>
                {/* <Link to='/dashboard' className='text-white text-[20px]'>Dashboard</Link> */}
            </div>


         

            <div className='header-right flex space-x-8'>


                <button type="button" className="text-white bgsearch
                focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg 
                text-sm px-5 py-2 text-center inline-flex items-center 
                " onClick={handelLogout} >
                    LOGOUT
                    <span className='ml-2 mb-1 '>
                        <FaUnlockAlt className='text-xl text-white font-bold' />
                    </span>

                </button>
            </div>


        </header>
    )
}

export default Header
