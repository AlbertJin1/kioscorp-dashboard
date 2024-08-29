// src/components/InventoryOverview.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxes } from '@fortawesome/free-solid-svg-icons';

const InventoryOverview = () => {
    const data = [
        { name: 'Bolt A', quantity: 50, stockLevel: 'High' },
        { name: 'Bolt B', quantity: 15, stockLevel: 'Low' },
        { name: 'Bolt C', quantity: 30, stockLevel: 'Medium' },
        { name: 'Bolt D', quantity: 10, stockLevel: 'Low' },
        { name: 'Bolt E', quantity: 25, stockLevel: 'Medium' },
        { name: 'Bolt F', quantity: 40, stockLevel: 'High' },
        { name: 'Bolt G', quantity: 5, stockLevel: 'Low' },
    ];

    const itemsPerPage = 4;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className="bg-white shadow-md p-4 mb-4 rounded-lg flex-grow flex flex-col h-full">
            <div className="flex items-center mb-1">
                <FontAwesomeIcon icon={faBoxes} className="text-3xl mr-4 text-red-500" />
                <h2 className="text-xl font-semibold">Inventory Overview</h2>
            </div>
            <div className="flex-grow overflow-auto h-32">
                <table className="min-w-full mt-2 border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border border-gray-200 text-left">Product Name</th>
                            <th className="px-4 py-2 border border-gray-200 text-center">Quantity</th>
                            <th className="px-4 py-2 border border-gray-200 text-center">Stock Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{item.name}</td>
                                <td className="border px-4 py-2 text-center">{item.quantity}</td>
                                <td className="border px-4 py-2 text-center">{item.stockLevel}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between mt-4">
                <button
                    className={`p-2 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button
                    className={`p-2 border rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default InventoryOverview;
