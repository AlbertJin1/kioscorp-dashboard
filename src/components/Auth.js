import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import formBackgroundImage from '../img/Background/background.png';
import sideImage from '../img/Background/company.png';

const Auth = ({ setIsAuthenticated, setLoggedInUser }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [isOwnerRegistration, setIsOwnerRegistration] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        gender: '',
        phoneNumber: '',
        email: '',
        secretPasskey: '', // For Owner registration
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPasskey, setShowPasskey] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const togglePasskeyVisibility = () => {
        setShowPasskey(!showPasskey);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        // Define the API endpoint based on the registration type
        const url = isLogin
            ? 'http://localhost:8000/api/login/'
            : isOwnerRegistration
                ? 'http://localhost:8000/api/register-owner/'  // Owner registration endpoint
                : 'http://localhost:8000/api/register/';       // Regular registration endpoint

        // Validation
        if (isLogin) {
            if (!formData.username || !formData.password) {
                Swal.fire({
                    icon: 'error',
                    title: 'Incomplete Form',
                    text: 'Please fill out all the required fields.',
                    timer: 2000,
                    showConfirmButton: false,
                });
                setIsSubmitting(false);
                return;
            }
        } else {
            // Check for required fields and matching passwords
            if (
                !formData.username ||
                !formData.password ||
                !formData.firstName ||
                !formData.lastName ||
                !formData.gender ||
                !formData.phoneNumber ||
                !formData.email ||
                (formData.password !== formData.confirmPassword) // Check for confirm password
            ) {
                Swal.fire({
                    icon: 'error',
                    title: 'Incomplete Form',
                    text: formData.password !== formData.confirmPassword
                        ? 'Passwords do not match.'
                        : 'Please fill out all the required fields.',
                    timer: 2000,
                    showConfirmButton: false,
                });
                setIsSubmitting(false);
                return;
            }

            // Phone number validation (11 digits)
            if (formData.phoneNumber.length !== 11) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Phone Number',
                    text: 'Phone number must be exactly 11 digits long.',
                    timer: 2000,
                    showConfirmButton: false,
                });
                setIsSubmitting(false);
                return;
            }
        }

        const regex = /^.{8,}$/;

        if (!regex.test(formData.password)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Password',
                text: 'Password must be at least 8 characters long.',
                timer: 2000,
                showConfirmButton: false,
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(url, {
                username: formData.username,
                email: !isLogin ? formData.email : undefined,
                password: formData.password,
                firstName: !isLogin ? formData.firstName : undefined,
                lastName: !isLogin ? formData.lastName : undefined,
                gender: !isLogin ? formData.gender : undefined,
                phoneNumber: !isLogin ? formData.phoneNumber : undefined,
                secretPasskey: isOwnerRegistration ? formData.secretPasskey : undefined, // Include passkey only for owner registration
            });

            if (isLogin) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('firstName', response.data.firstName);
                localStorage.setItem('lastName', response.data.lastName);
                localStorage.setItem('email', response.data.email);
                localStorage.setItem('gender', response.data.gender);
                localStorage.setItem('phoneNumber', response.data.phoneNumber);
                localStorage.setItem('role', response.data.role); // Store role in localStorage
                setIsAuthenticated(true);
                setLoggedInUser({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    phoneNumber: response.data.phoneNumber,
                    role: response.data.role,
                });
            } else {
                setFormData({
                    username: '',
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: '',
                    gender: '',
                    phoneNumber: '',
                    email: '',
                    secretPasskey: '', // Clear secret passkey after registration
                });
                setIsLogin(true);
            }
            Swal.fire({
                icon: 'success',
                title: isLogin ? 'Login Successful' : 'Registration Successful',
                text: response.data.success || response.data.message,
                timer: 2000,
                showConfirmButton: false,
            });
            setIsSubmitting(false);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: isLogin ? 'Login Failed' : 'Registration Failed',
                text: error.response?.data?.error || 'Something went wrong!',
                timer: 2000,
                showConfirmButton: false,
            });
            setIsSubmitting(false);
        }
    };

    // Use effect to check authentication on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthenticated(false); // If no token, user is not authenticated
        }
    }, [setIsAuthenticated]); // Include setIsAuthenticated in the dependency array

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
            <div className="flex bg-white rounded-lg shadow-2xl w-[950px] h-[500px]">
                <div
                    className="hidden md:block md:w-1/2 bg-cover bg-center rounded-l-lg"
                    style={{
                        backgroundImage: `url(${sideImage})`,
                        width: '550px',
                        height: '500px',
                    }}
                ></div>
                <div className="p-8 w-full md:w-1/2 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-center mb-6">
                        {isLogin ? 'Login' : isOwnerRegistration ? 'Register as Owner' : 'Register'}
                    </h2>
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
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="relative">
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
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                                    >
                                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="Phone Number (09xxxxxxxxx)"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    pattern="[0-9]{11}"
                                    maxLength="11"
                                    minLength="11"
                                    inputMode="numeric"
                                />
                                {isOwnerRegistration && (
                                    <div className="relative col-span-2">
                                        <input
                                            type={showPasskey ? 'text' : 'password'}
                                            name="secretPasskey"
                                            placeholder="Secret Passkey"
                                            value={formData.secretPasskey}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasskeyVisibility}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                                        >
                                            <FontAwesomeIcon icon={showPasskey ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full mt-4 p-2 text-white rounded hover:bg-blue-600 transition duration-200 text-xl font-semibold"
                            style={{ backgroundColor: '#0f3a87' }} // Set background color to #0f3a87
                            disabled={isSubmitting}
                        >
                            {isLogin ? 'Login' : isOwnerRegistration ? 'Register as Owner' : 'Register'}
                        </button>
                        <p
                            className="mt-4 text-center cursor-pointer text-blue-500 hover:underline"
                            style={{ color: '#0f3a87' }}
                            onClick={() => {
                                if (isLogin) {
                                    setIsLogin(false);
                                    setIsOwnerRegistration(false);
                                } else if (isOwnerRegistration) {
                                    setIsOwnerRegistration(false);
                                } else {
                                    setIsOwnerRegistration(true);
                                }
                            }}
                        >
                            {isLogin
                                ? "Don't have an account? Register"
                                : isOwnerRegistration
                                    ? 'Back to Registration'
                                    : 'Register as Owner'}
                        </p>
                        <p
                            className="mt-4 text-center cursor-pointer text-blue-500 hover:underline"
                            style={{ color: '#0f3a87' }}
                            onClick={() => {
                                if (!isLogin) {
                                    setIsLogin(true);
                                    setIsOwnerRegistration(false);
                                }
                            }}
                        >
                            {!isLogin && !isOwnerRegistration
                                ? 'Already have an account? Login'
                                : null}
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Auth;
