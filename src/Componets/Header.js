import React, { useState } from 'react';

import { BsJustify } from 'react-icons/bs'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FaUnlockAlt } from "react-icons/fa";
import Dropdown from 'react-bootstrap/Dropdown';
import "../../src/all.css"

function Header({ OpenSidebar }) {
    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedMode, setSelectedMode] = useState('');

    const handelLogout = () => {
        localStorage.removeItem("astro_logged_in");
        navigate('/');
        window.location.reload()
    }

    //payment mode
    // const handlePaymentModeSelect = (mode) => {
    //     setSelectedMode(mode);
    //     setShowDropdown(false);

    //     // Make API call based on the selected payment mode
    //     fetch(`http://localhost:4700/api/payments/${mode}/amount`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ amount: 9}),
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data);
    //         // Handle response as needed
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //         // Handle error
    //     });
    // };
    const handlePaymentModeSelect = (mode) => {
        let selectedModeAbbreviation;
    
        // Map the payment mode to its abbreviation
        switch (mode) {
            case 'RozerPay':
                selectedModeAbbreviation = 'R';
                break;
            case 'PhonePe':
                selectedModeAbbreviation = 'P';
                break;
            case 'Both':
                selectedModeAbbreviation = 'B';
                break;
            default:
                selectedModeAbbreviation = '';
                break;
        }
    
        setSelectedMode(selectedModeAbbreviation);
        setShowDropdown(false);
    
        // Make API call based on the selected payment mode abbreviation
        fetch(`http://localhost:4700/api/payments/${selectedModeAbbreviation}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Handle response as needed
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error
        });
    };


    return (
        <header className='header bg-[#3a0843]'>
            <div className='menu-icon'>
                <BsJustify size={20} fill='white' onClick={OpenSidebar} className='cursor-pointer' />
            </div>
            <div className='header-left'>
                {/* <Link to='/dashboard' className='text-white text-[20px]'>Dashboard</Link> */}
            </div>


            <div className='header-right flex space-x-8'>


                {/* <div class="relative inline-block text-left">
                    <div>
                        <button type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-2 py-2 text-sm font-bold text-[#44023d] shadow-sm  ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded={showDropdown} aria-haspopup="true" onClick={() => setShowDropdown(!showDropdown)}>
                            Payment Mode Select
                            <svg className={`${showDropdown ? 'transform rotate-180' : ''} -mr-1 h-5 w-5 text-gray-400`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    {showDropdown && (
                        <div className="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-300" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                            <div className="py-1" role="none">
                            <a href="#" className={`text-center border-b border-gray-200 font-bold block px-2 py-2 text-sm text-black ${selectedMode === 'RozerPay' ? 'bg-yellow-500' : ''}`} role="menuitem" tabIndex="-1" id="menu-item-0" onClick={() => handlePaymentModeSelect('RozerPay')}>
                                    RozerPay
                                </a>
                                <a href="#" className={`text-center border-b border-gray-200 font-bold block px-2 py-2 text-sm text-black ${selectedMode === 'PhonePe' ? 'bg-yellow-500' : ''}`} role="menuitem" tabIndex="-1" id="menu-item-1" onClick={() => handlePaymentModeSelect('PhonePe')}>
                                    PhonePe
                                </a>
                                <a href="#" className={`text-center font-bold block px-2 py-2 text-sm text-black ${selectedMode === 'Both' ? 'bg-yellow-500' : ''}`} role="menuitem" tabIndex="-1" id="menu-item-2" onClick={() => handlePaymentModeSelect('Both')}>
                                    Both
                                </a>
                            </div>
                        </div>
                    )}

                </div> */}

                <button type="button" className="text-[#3a0843] bg-white
                focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg 
                text-sm px-5 py-2 text-center inline-flex items-center 
                " onClick={handelLogout} >
                    LOGOUT
                    <span className='ml-2 mb-1 '>
                        <FaUnlockAlt className='text-xl text-[#3a0843] font-bold' />
                    </span>
                </button>
            </div>
        </header>
    )
}

export default Header
