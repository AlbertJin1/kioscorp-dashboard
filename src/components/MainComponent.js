// src/components/MainComponent.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Dashboard from './Dashboard';
import SalesManagement from './SalesManagement';
import Menu from './Menu'; // Import the Menu component
import Inventory from './Inventory';

const MainComponent = () => {
    const [currentPage, setCurrentPage] = useState('dashboard'); // Default to Dashboard

    const renderPage = () => {
        switch (currentPage) {
            case 'menu':
                return <Menu />;
            case 'dashboard':
                return <Dashboard />;
            case 'inventory':
                return <Inventory />;
            case 'sales-management':
                return <SalesManagement />;
            default:
                return <Dashboard />; // Fallback to Dashboard
        }
    };

    return (
        <div className="flex">
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
