import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Dashboard from './Dashboard';
import SalesManagement from './SalesManagement';
import Menu from './Menu';
import Inventory from './Inventory';
import OrderHistory from './OrderHistory';

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
                case 'order-history':
                return <OrderHistory />;
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
