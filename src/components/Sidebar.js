// src/components/Sidebar.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faBoxOpen, faClipboardList, faUsers } from '@fortawesome/free-solid-svg-icons';
import logo from '../img/logo/KIOSCORP LOGO.png'; // Adjust the path as needed

const Sidebar = ({ setCurrentPage, currentPage }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return (
        <div className="w-64 min-h-screen bg-gray-800 text-white flex flex-col">
            <div className="flex items-center p-4">
                <img src={logo} alt="Kioscorp Logo" className="h-8 mr-2" /> {/* Logo image */}
                <h1 className="text-2xl font-bold">KiosCorp</h1>
            </div>
            <hr className="border-gray-600" /> {/* Separator line */}
            <ul className="flex-grow">
                <li
                    className={`flex items-center p-4 cursor-pointer ${currentPage === 'dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                    onClick={() => setCurrentPage('dashboard')}
                >
                    <FontAwesomeIcon icon={faChartBar} className="text-blue-400 mr-3" />
                    Dashboard
                </li>
                <li
                    className={`flex items-center p-4 cursor-pointer ${currentPage === 'products' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                    onClick={() => setCurrentPage('products')}
                >
                    <FontAwesomeIcon icon={faBoxOpen} className="text-green-400 mr-3" />
                    Products
                </li>
                <li
                    className={`flex items-center p-4 cursor-pointer ${currentPage === 'orders' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                    onClick={() => setCurrentPage('orders')}
                >
                    <FontAwesomeIcon icon={faClipboardList} className="text-orange-400 mr-3" />
                    Orders
                </li>
                <li
                    className={`flex items-center p-4 cursor-pointer ${currentPage === 'users' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                    onClick={() => setCurrentPage('users')}
                >
                    <FontAwesomeIcon icon={faUsers} className="text-purple-400 mr-3" />
                    Users
                </li>
            </ul>
            <div className="p-4 text-sm text-gray-400">
                <p>{currentTime.toLocaleString()}</p>
                <p>&copy; 2024 Kioscorp. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Sidebar;
