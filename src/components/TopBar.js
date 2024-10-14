import React, { useEffect, useState } from 'react';
import logo from '../img/logo/dashboard.png'; // Adjust the path as needed

const TopBar = ({ currentPage, loggedInUser }) => {
    const [currentTime, setCurrentTime] = useState('');
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
                    <h2 className="text-xl text-[#033372] font-bold">Universal Auto Supply <span className='text-[#FFBD59]'>and</span> Bolt Center</h2>
                    <h3 className="text-lg font-bold pl-4 pr-4 pt-1 pb-1 rounded-2xl" style={{ backgroundColor: '#033372', color: 'white' }}>
                        {currentDate} | {currentTime}
                    </h3>
                </div>
            </div>

            <div className="flex w-full justify-between items-center mt-2">
                <div className="pl-2 pr-2 pt-1 pb-1 rounded-2xl" style={{ backgroundColor: '#033372' }}>
                    <h1 className="font-bold text-[#FFBD59] text-2xl">{title}</h1>
                </div>
            </div>
        </div>
    );
};

export default TopBar;