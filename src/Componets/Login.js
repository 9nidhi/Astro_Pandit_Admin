import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BsFillPersonFill } from 'react-icons/bs'; // Importing person icon
import { RiLockPasswordFill } from 'react-icons/ri'; // Importing lock icon
// import { FaEye, FaEyeSlash } from "react-icons/fa";

const initialForm = {
  username: '',
  password: '',
};

const Login = ({ setIsLoggedIn }) => {
  const [loginData, setLoginData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error('Please enter username and password.');
      return;
    }

    try {
      const response = await fetch('https://tronixpayment.axispay.cloud/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('astro_logged_in', 'true'); // Store login status
        setIsLoggedIn(true); // Set isLoggedIn to true
        navigate('/dashboard'); // Navigate to dashboard
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center  shadow-[rgba(255,255,255,0.24) 0px 3px 8px] bg-[#000]">
      <div className="max-w-xs w-full p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-[#44023d] mb-6 text-center">Astro Pandit</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">
            Username
          </label>
          <div className="relative">
            <BsFillPersonFill className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
            <input
              type="text"
              id="email"
              className="pl-10 mt-1 block w-full rounded-md border-2 border-gray-300  px-3 py-2"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">
            Password
          </label>
          <div className="relative">
            <RiLockPasswordFill className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'} // Show password if showPassword is true
              id="password"
              className="pl-10 mt-1 block w-full rounded-md border-2 border-gray-300  px-3 py-2"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
         
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
              className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-400 focus:outline-none"
            >
              {showPassword ? <FaEye /> :  <FaEyeSlash />
}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="py-2 px-4 w-full text-white font-semibold rounded-md"
            style={{backgroundColor:"#44023d"}}
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
