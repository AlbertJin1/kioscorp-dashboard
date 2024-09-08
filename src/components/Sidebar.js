// src/components/Sidebar.js
import logo from '../img/logo/KIOSCORP LOGO.png';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faBoxesStacked, faWarehouse } from '@fortawesome/free-solid-svg-icons'; // Import specific FontAwesome icons
import { MdDashboard, MdManageHistory } from "react-icons/md"; // Import Material Design icons
import { TiHome } from "react-icons/ti"; // Import new icons
import { IoBarChart } from "react-icons/io5"; // Import new icons

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
                    { icon: <MdDashboard className="text-white text-3xl" />, label: 'Menu', page: 'menu' }, // Updated Menu icon
                    { icon: <TiHome className="text-white text-3xl" />, label: 'Dashboard', page: 'dashboard' }, // Updated Dashboard icon
                    { icon: <FontAwesomeIcon icon={faBoxesStacked} className="text-3xl" style={{ color: 'white' }} />, label: 'Inventory', page: 'inventory' }, // Updated Inventory icon
                    { icon: <IoBarChart className="text-white text-3xl" />, label: 'Sales', page: 'sales-management' }, // Updated Sales icon
                    { icon: <MdManageHistory className="text-white text-3xl" />, label: 'Order History', page: 'order-history' }, // Updated Order History icon
                    { icon: <FontAwesomeIcon icon={faWarehouse} className="text-3xl" style={{ color: 'white' }} />, label: 'Add Stocks', page: 'add-stock' }, // Updated Add Stocks icon
                ].map((item, index) => (
                    <li
                        key={index}
                        className={`flex items-center p-4 cursor-pointer relative ${currentPage === item.page ? 'bg-[#022a5e]' : 'hover:bg-[#022a5e]'}`}
                        onClick={item.onClick ? item.onClick : () => setCurrentPage(item.page)} // Use item.onClick if provided
                    >
                        <div className="flex justify-center items-center" style={{ minWidth: '2.5rem' }}>
                            {item.icon} {/* Render the icon directly */}
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
