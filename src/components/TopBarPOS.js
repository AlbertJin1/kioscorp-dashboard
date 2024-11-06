import React, { useEffect, useState } from 'react';
import logo from '../img/logo/point-of-sale.png'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Import the arrow left icon

const TopBarPOS = ({ loggedInUser, pendingOrderCount, handleLogout }) => {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

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

    // Function to handle the go back action
    const handleGoBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div className="bg-white shadow pt-2 pb-2 pl-4 pr-4 items-center">
            <div className="flex items-start w-full justify-between">
                <div className="flex items-start">
                    <img src={logo} alt="Dashboard Icon" className="h-16 mr-4" />
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold">Welcome, {loggedInUser.firstName} {loggedInUser.lastName}</h1>
                        <h2 className="text-lg">Point of Sale System</h2>
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
                {/* Go Back Button: only show for admin or owner */}
                {(loggedInUser.role === 'admin' || loggedInUser.role === 'owner') && (
                    <button
                        onClick={handleGoBack}
                        className="bg-[#0f3a87] text-white font-bold py-2 px-4 rounded flex items-center hover:bg-blue-700 hover:text-[#FFBD59] transition-colors duration-200"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> {/* Add the icon */}
                        Go Back
                    </button>
                )}

                {/* Current Orders Counter */}
                <div className={`pl-2 pr-2 pt-1 pb-1 rounded-full ${loggedInUser.role === 'admin' || loggedInUser.role === 'owner' ? 'ml-4' : 'mx-auto'}`} style={{ backgroundColor: '#033372' }}>
                    <h1 className="font-bold text-[#FFBD59] text-2xl">Current Orders: {pendingOrderCount}</h1>
                </div>
            </div>
        </div>
    );
};

export default TopBarPOS; // Ensure default export