import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faBoxesStacked, faWarehouse, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { MdDashboard, MdManageHistory } from "react-icons/md";
import { TiHome } from "react-icons/ti";
import { IoBarChart } from "react-icons/io5";
import logo from '../img/logo/KIOSCORP LOGO.png';
import Swal from 'sweetalert2'; // Import SweetAlert2

const Sidebar = ({ setCurrentPage, currentPage, handleLogout }) => { // Accept handleLogout as a prop
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const confirmLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out of your account.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0f3a87',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, log out!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                // Wait for a short duration before calling handleLogout
                setTimeout(() => {
                    handleLogout(); // Call the handleLogout function
                    // Optionally redirect or perform other actions after logout
                }, 1000); // Adjust the duration (in milliseconds) as needed
            }
        });
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
                    { icon: <MdDashboard className="text-white text-3xl" />, label: 'Menu', page: 'menu' },
                    { icon: <TiHome className="text-white text-3xl" />, label: 'Dashboard', page: 'dashboard' },
                    { icon: <FontAwesomeIcon icon={faBoxesStacked} className="text-3xl" style={{ color: 'white' }} />, label: 'Inventory', page: 'inventory' },
                    { icon: <IoBarChart className="text-white text-3xl" />, label: 'Sales', page: 'sales-management' },
                    { icon: <MdManageHistory className="text-white text-3xl" />, label: 'Order History', page: 'order-history' },
                    { icon: <FontAwesomeIcon icon={faWarehouse} className="text-3xl" style={{ color: 'white' }} />, label: 'Add Stocks', page: 'add-stock' },
                ].map((item, index) => (
                    <li
                        key={index}
                        className={`flex items-center p-4 cursor-pointer relative ${currentPage === item.page ? 'bg-[#022a5e]' : 'hover:bg-[#022a5e]'}`}
                        onClick={() => setCurrentPage(item.page)}
                    >
                        <div className="flex justify-center items-center" style={{ minWidth: '2.5rem' }}>
                            {item.icon}
                        </div>
                        {!isCollapsed && <span className="ml-3 text-xl">{item.label}</span>}
                        {currentPage === item.page && (
                            <div className="absolute right-0 top-0 h-full w-2 bg-white transition-all duration-300 transform scale-y-100" />
                        )}
                    </li>
                ))}
            </ul>
            <button
                onClick={confirmLogout} // Call confirmLogout when the button is clicked
                className="mt-auto flex items-center p-4 cursor-pointer bg-red-600 hover:bg-red-500 transition duration-200"
            >
                <FontAwesomeIcon icon={faSignOutAlt} className="text-white text-3xl" />
                {!isCollapsed && <span className="ml-3 text-xl">Logout</span>}
            </button>
        </div>
    );
};

export default Sidebar;
