// src/MainComponent.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar'; // Import TopBar
import Dashboard from './Dashboard';
import Products from './Products';
// import Orders from './Orders';
// import Users from './Users';

const MainComponent = () => {
    // State to manage the current page
    const [currentPage, setCurrentPage] = useState('dashboard'); // Default to Dashboard

    // Function to render the appropriate page component
    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard />;
            case 'products':
                return <Products />;
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
            {/* Render Sidebar and pass down setCurrentPage and currentPage */}
            <Sidebar setCurrentPage={setCurrentPage} currentPage={currentPage} />
            <div className="flex flex-col flex-grow" style={{ backgroundColor: '#d7e1fc' }}> {/* Using hex color */}
                {/* Pass the currentPage to TopBar */}
                <TopBar currentPage={currentPage} />
                <div className="flex-grow p-4">
                    {/* Render the current page */}
                    {renderPage()}
                </div>
            </div>
        </div>
    );
};

export default MainComponent;
