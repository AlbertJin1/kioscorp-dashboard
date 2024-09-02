// src/components/LowDemandItems.js
import React from 'react';
import { FaArrowDown } from 'react-icons/fa'; // Import icon for low demand

const LowDemandItems = () => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaArrowDown className="text-red-500 mr-2" /> Low Demand Items
            </h2>
            {/* Add content for low demand items here */}
            <ul>
                <li className="mb-2">Item 1: Monthly: 20, Weekly: 5, Daily: 1</li>
                <li className="mb-2">Item 2: Monthly: 15, Weekly: 4, Daily: 0</li>
                {/* Add more items as needed */}
            </ul>
        </div>
    );
};

export default LowDemandItems;