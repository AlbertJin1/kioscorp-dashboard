// src/components/SalesManagement.js
import React from 'react';
import { FaChartLine, FaBox, FaCalendarAlt } from 'react-icons/fa'; // Import icons

const SalesManagement = () => {
    return (
        <div className="flex flex-col h-full p-4">
            <h1 className="text-2xl font-bold mb-4">Sales Management</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-4 shadow rounded">
                    <h2 className="text-xl font-semibold mb-2">Sales Overview</h2>
                    <FaChartLine className="text-blue-500" /> {/* Example usage */}
                </div>
                
                <div className="bg-white p-4 shadow rounded">
                    <h2 className="text-xl font-semibold mb-2">Recent Orders</h2>
                    <FaBox className="text-green-500" /> {/* Example usage */}
                </div>
                
                <div className="bg-white p-4 shadow rounded">
                    <h2 className="text-xl font-semibold mb-2">High Demand Items</h2>
                    <FaCalendarAlt className="text-orange-500" /> {/* Example usage */}
                </div>
            </div>
        </div>
    );
};

export default SalesManagement;
