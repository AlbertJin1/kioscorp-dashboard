// src/components/MainComponent.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Dashboard from './Dashboard';
import Products from './Products';
import Auth from './Auth'; // Import Auth component

const MainComponent = () => {
    const [currentPage, setCurrentPage] = useState('dashboard'); // Default to Dashboard
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State for authentication

    const renderPage = () => {
        if (!isAuthenticated) {
            return <Auth setIsAuthenticated={setIsAuthenticated} />; // Render Auth component if not authenticated
        }

        switch (currentPage) {
            case 'dashboard':
                return <Dashboard />;
            case 'products':
                return <Products />;
            // Uncomment these lines when you implement the respective components
            // case 'orders':
            //     return <Orders />;
            // case 'users':
            //     return <Users />;
            default:
                return <Dashboard />; // Fallback to Dashboard
        }
    };

    return (
        <div className="flex">
            {isAuthenticated && (
                <Sidebar setCurrentPage={setCurrentPage} currentPage={currentPage} />
            )}
            <div className="flex flex-col flex-grow" style={{ backgroundColor: '#d7e1fc' }}>
                {isAuthenticated && <TopBar currentPage={currentPage} />}
                <div className="flex-grow p-4">
                    {renderPage()}
                </div>
            </div>
        </div>
    );
};

export default MainComponent;
