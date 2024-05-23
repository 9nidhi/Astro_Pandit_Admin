// Sidebar.js
import React from 'react';
import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { MdProductionQuantityLimits } from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen }) => {
    const location = useLocation();

    return (
        <div className={`h-screen flex  ${isSidebarOpen ? 'translate-x-0 mt-16' : '-translate-x-64 mt-16'} transition-transform`}>
            <div className="bg-gradient-to-b from-[#3f51b5] via-[#3f51b5] to-[#2c3e50] w-64 lg:flex lg:flex-col  shadow-lg">
                <div className="flex-col pt-5 flex ">
                    <div className="h-full flex-col justify-between px-4 flex">
                        <div className="space-y-4 ">
                            <ul className="space-y-2">
                                <li>
                                    {/* <Link
                                        to="/"
                                        className={`text-white font-bold rounded-lg px-4 py-2.5 flex items-center block transition-all duration-200 ${location.pathname === '/' ? 'bg-[#f0eaef] bg-opacity-20 text-white shadow-lg' : ' text-white'
                                    }`}
                                    > */}
                                    <Link
                                        to="/"
                                        onClick={toggleSidebar} 
                                        className={`text-white font-bold rounded-lg px-4 py-2.5 flex items-center block transition-all duration-200 ${location.pathname === '/'
                                                ? 'bg-[#f0eaef] bg-opacity-20 text-white shadow-lg'
                                                : ' text-white'
                                            }`}
                                    >
                                        <AiOutlineDashboard className="mr-4 text-2xl" /> DashBoard
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/category"
                                        className={`text-white font-bold rounded-lg px-4 py-2.5 flex items-center block transition-all duration-200 ${location.pathname === '/' ? 'bg-[#f0eaef] bg-opacity-20 text-white shadow-lg' : ' text-white'
                                            }`}
                                    >
                                        <BiCategoryAlt className="mr-4 text-2xl" /> Category
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/subcategory"
                                        className={`text-white font-bold rounded-lg px-4 py-2.5 flex items-center block transition-all duration-200 ${location.pathname === '/' ? 'bg-[#f0eaef] bg-opacity-20 text-white shadow-lg' : ' text-white'
                                            }`}
                                    >
                                        <BiCategoryAlt className="mr-4 text-2xl" /> Sub Category
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/getproduct"
                                        className={`text-white font-bold rounded-lg px-4 py-2.5 flex items-center block transition-all duration-200 ${location.pathname === '/' ? 'bg-[#f0eaef] bg-opacity-20 text-white shadow-lg' : ' text-white'
                                            }`}
                                    >
                                        <MdProductionQuantityLimits className="mr-4 text-2xl" />  Product
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
