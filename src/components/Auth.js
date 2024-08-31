// src/components/Auth.js
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import formBackgroundImage from '../img/Background/background.png'; // Import the background image
import sideImage from '../img/Background/company.png'; // Import the left side image

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        gender: '',
        phoneNumber: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin ? 'http://localhost:8000/api/login/' : 'http://localhost:8000/api/register/';
        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8-15}$/;

        if (!regex.test(formData.password)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Password',
                text: 'Password must be 8-15 characters long and include at least one letter, one number, and one special character.',
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        try {
            const response = await axios.post(url, formData);
            Swal.fire({
                icon: 'success',
                title: isLogin ? 'Login Successful' : 'Registration Successful',
                text: response.data.success || response.data.message,
                timer: 2000,
                showConfirmButton: false,
            });
            // Redirect or update state as necessary
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: isLogin ? 'Login Failed' : 'Registration Failed',
                text: error.response.data.error,
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-cover bg-no-repeat"
            style={{
                backgroundImage: `url(${formBackgroundImage})`,
                backgroundSize: 'cover',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
            }}
        >
            {/* Container with enhanced shadow */}
            <div className="flex bg-white rounded-lg shadow-2xl w-[1000px] h-[500px]">
                {/* Left Side Image */}
                <div
                    className="hidden md:block md:w-1/2 bg-cover bg-center rounded-l-lg"
                    style={{
                        backgroundImage: `url(${sideImage})`,
                        width: '500px',
                        height: '500px',
                    }}
                ></div>

                {/* Login/Register Form */}
                <div className="p-8 w-full md:w-1/2 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Login' : 'Register'}</h2>
                    <form onSubmit={handleSubmit}>
                        {isLogin ? (
                            <>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="relative mb-4">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="relative mb-4">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-2"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-2"
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                        >
                            {isLogin ? 'Login' : 'Register'}
                        </button>
                        <p
                            className="mt-4 text-center cursor-pointer text-blue-500 hover:underline"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin
                                ? "Don't have an account? Register"
                                : 'Already have an account? Login'}
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Auth;
