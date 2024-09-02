// src/components/Sidebar.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faBoxOpen, faClipboardList, faUsers, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import logo from '../img/logo/KIOSCORP LOGO.png';

const Sidebar = ({ setCurrentPage, currentPage }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div
            className={`min-h-screen flex flex-col bg-[#033372] text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
        >
            <div className="flex items-center justify-between p-4">
                {!isCollapsed && <img src={logo} alt="Kioscorp Logo" className="h-12" />}
                <button
                    onClick={toggleCollapse}
                    className={`focus:outline-none flex items-center justify-center ${isCollapsed ? 'w-full' : ''}`}
                >
                    <FontAwesomeIcon
                        icon={faChevronLeft}
                        className={`text-white text-2xl transition-transform duration-300 ${isCollapsed ? 'transform rotate-180' : ''}`}
                    />
                </button>
            </div>
            <ul className="flex-grow">
                {[
                    { icon: faChartBar, label: 'Dashboard', page: 'dashboard', color: '#1DA1F2' },
                    { icon: faBoxOpen, label: 'Products', page: 'products', color: '#FF9900' },
                    { icon: faClipboardList, label: 'Sales Management', page: 'sales-management', color: '#E91E63'},
                    { icon: faClipboardList, label: 'Orders', page: 'orders', color: '#E91E63' },
                    { icon: faUsers, label: 'Users', page: 'users', color: '#4CAF50' },
                ].map((item, index) => (
                    <li
                        key={index}
                        className={`flex items-center p-4 cursor-pointer relative ${currentPage === item.page ? 'bg-[#022a5e]' : 'hover:bg-[#022a5e]'}`}
                        onClick={item.onClick ? item.onClick : () => setCurrentPage(item.page)} // Use item.onClick if provided
                    >
                        <div className="flex justify-center items-center" style={{ minWidth: '2.5rem' }}>
                            <FontAwesomeIcon icon={item.icon} className="text-2xl" style={{ color: item.color }} />
                        </div>
                        {!isCollapsed && <span className="ml-3 text-xl">{item.label}</span>}
                        {currentPage === item.page && (
                            <div className="absolute right-0 top-0 h-full w-2 bg-white transition-all duration-300 transform scale-y-100" />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
