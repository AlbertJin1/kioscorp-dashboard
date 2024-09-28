import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Dashboard from './Dashboard';
import SalesManagement from './SalesManagement';
import Menu from './Menu';
import Inventory from './Inventory';
import OrderHistory from './OrderHistory';
import Auth from './Auth'; // Import Auth component

const MainComponent = () => {
    const [currentPage, setCurrentPage] = useState('dashboard'); // Default to Dashboard
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State for authentication
    const [loggedInUser, setLoggedInUser] = useState({ firstName: '', lastName: '' }); // State for logged-in user

    // Check for token in localStorage on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true); // User is authenticated if token is present
            // Fetch user info if needed (optional)
            const firstName = localStorage.getItem('firstName') || 'Guest';
            const lastName = localStorage.getItem('lastName') || '';
            setLoggedInUser({ firstName, lastName }); // Set the logged-in user
        }
    }, []); // Empty dependency array ensures this runs only once

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        localStorage.removeItem('firstName'); // Remove first name
        localStorage.removeItem('lastName'); // Remove last name
        setIsAuthenticated(false); // Set authentication state to false
        setCurrentPage('dashboard'); // Optionally redirect to the dashboard or login
        setLoggedInUser({ firstName: '', lastName: '' }); // Clear user state
    };

    const renderPage = () => {
        if (!isAuthenticated) {
            return <Auth setIsAuthenticated={setIsAuthenticated} setLoggedInUser={setLoggedInUser} />; // Pass down setLoggedInUser
        }

        switch (currentPage) {
            case 'menu':
                return <Menu />;
            case 'dashboard':
                return <Dashboard />;
            case 'inventory':
                return <Inventory />;
            case 'sales-management':
                return <SalesManagement />;
            case 'order-history':
                return <OrderHistory />;
            default:
                return <Dashboard />; // Fallback to Dashboard
        }
    };

    return (
        <div className="flex">
            {isAuthenticated && (
                <Sidebar setCurrentPage={setCurrentPage} currentPage={currentPage} handleLogout={handleLogout} />
            )}
            <div className="flex flex-col flex-grow" style={{ backgroundColor: '#d7e1fc' }}>
                {isAuthenticated && <TopBar currentPage={currentPage} loggedInUser={loggedInUser} />} {/* Pass loggedInUser to TopBar */}
                <div className="flex-grow p-4">
                    {renderPage()}
                </div>
            </div>
        </div>
    );
};

export default MainComponent;
