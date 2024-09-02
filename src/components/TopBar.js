// src/components/TopBar.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBox, faShoppingCart, faUsers, faClipboardList } from '@fortawesome/free-solid-svg-icons';

const TopBar = ({ currentPage }) => {
    let title = '';
    let icon = null;
    let iconColor = ''; // Variable for icon color

    switch (currentPage) {
        case 'dashboard':
            title = 'Dashboard';
            icon = faTachometerAlt; // Dashboard icon
            iconColor = 'text-blue-500'; // Color for Dashboard
            break;
        case 'products':
            title = 'Products';
            icon = faBox; // Products icon
            iconColor = 'text-green-500'; // Color for Products
            break;
        case 'sales-management':
            title = 'Sales Management';
            icon = faClipboardList; // Orders icon
            iconColor = 'text-red-500'; // Color for Orders
            break;
        case 'orders':
            title = 'Orders';
            icon = faShoppingCart; // Orders icon
            iconColor = 'text-orange-500'; // Color for Orders
            break;
        case 'users':
            title = 'Users';
            icon = faUsers; // Users icon
            iconColor = 'text-purple-500'; // Color for Users
            break;
        default:
            title = 'Dashboard';
            icon = faTachometerAlt;
            iconColor = 'text-blue-500'; // Default color
    }

    return (
        <div className="bg-white shadow p-4 flex items-center">
            <FontAwesomeIcon icon={icon} className={`text-2xl mr-2 ${iconColor}`} />
            <h1 className="text-2xl font-bold">{title}</h1>
        </div>
    );
};

export default TopBar;
