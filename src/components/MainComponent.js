// src/components/MainComponent.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Dashboard from './Dashboard';
import Products from './Products';
import SalesManagement from './SalesManagement'; 
// import Auth from './Auth'; // Comment out Auth component import

const MainComponent = () => {
    const [currentPage, setCurrentPage] = useState('dashboard'); // Default to Dashboard
    // const [isAuthenticated, setIsAuthenticated] = useState(true); // Temporarily set to true

    const renderPage = () => {
        // Temporarily comment out the auth check
        // if (!isAuthenticated) {
        //     return <Auth setIsAuthenticated={setIsAuthenticated} />; // Render Auth component if not authenticated
        // }

        switch (currentPage) {
            case 'dashboard':
                return <Dashboard />;
            case 'products':
                return <Products />;
            case 'sales-management':
                return <SalesManagement />; // Render SalesManagement component
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
            {/* Temporarily disable Sidebar and TopBar rendering based on auth */}
            <Sidebar setCurrentPage={setCurrentPage} currentPage={currentPage} />
            <div className="flex flex-col flex-grow" style={{ backgroundColor: '#d7e1fc' }}>
                <TopBar currentPage={currentPage} />
                <div className="flex-grow p-4">
                    {renderPage()}
                </div>
            </div>
        </div>
    );
};

export default MainComponent;
