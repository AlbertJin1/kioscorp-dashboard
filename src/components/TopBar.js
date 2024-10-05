import React, { useEffect, useState } from 'react';
import logo from '../img/logo/dashboard.png'; // Adjust the path as needed
import Swal from 'sweetalert2'; // Import SweetAlert2
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const TopBar = ({ currentPage, handleLogout }) => {
    const [currentTime, setCurrentTime] = useState('');
    const [loggedInUser, setLoggedInUser] = useState({ firstName: '', lastName: '' });
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            const date = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
            setCurrentTime(time);
            setCurrentDate(date);
        };
        updateTime();
        const intervalId = setInterval(updateTime, 60000); // Update every minute

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        // Fetch user's first and last name from localStorage
        const firstName = localStorage.getItem('firstName') || 'Guest'; // Default to Guest if not found
        const lastName = localStorage.getItem('lastName') || ''; // Default to empty string
        setLoggedInUser({ firstName, lastName }); // Set the logged-in user
    }, []);

    let title = '';
    switch (currentPage) {
        case 'menu':
            title = 'Menu';
            break;
        case 'dashboard':
            title = 'Dashboard';
            break;
        case 'inventory':
            title = 'Inventory';
            break;
        case 'sales-management':
            title = 'Sales';
            break;
        case 'order-history':
            title = 'Order History';
            break;
        case 'product':
            title = 'Products';
            break;
        default:
            title = 'Dashboard';
    }

    // Confirm Logout
    const confirmLogout = () => {
        console.log('Confirming logout...');
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
                handleLogout(); // Call the handleLogout function directly
            }
        });
    };

    return (
        <div className="bg-white shadow pt-2 pb-2 pl-4 pr-4 items-center">
            <div className="flex items-start w-full justify-between">
                <div className="flex items-start">
                    <img src={logo} alt="Dashboard Icon" className="h-16 mr-4" />
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold">Welcome, {loggedInUser.firstName} {loggedInUser.lastName}</h1>
                        <h2 className="text-lg">Inventory Management System</h2>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <h2 className="text-lg text-[#033372] font-bold">Universal Auto Supply <span className='text-[#FFBD59]'>and</span> Bolt Center</h2>
                    <h3 className="text-xl font-bold pl-4 pr-4 pt-1 pb-1 rounded-2xl" style={{ backgroundColor: '#033372', color: 'white' }}>
                        {currentDate} | {currentTime}
                    </h3>
                </div>
            </div>

            <div className="flex w-full justify-between items-center mt-2">
                <div className="pl-2 pr-2 pt-1 pb-1 rounded-2xl" style={{ backgroundColor: '#033372' }}>
                    <h1 className="font-bold text-[#FFBD59] text-2xl">{title}</h1>
                </div>
                <button
                    onClick={confirmLogout}
                    className="flex items-center p-2 bg-red-600 text-white rounded-2xl hover:bg-red-500 transition duration-200 font-semibold"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default TopBar;
