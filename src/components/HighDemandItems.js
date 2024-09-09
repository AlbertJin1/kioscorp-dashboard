// src/components/HighDemandItems.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

const HighDemandItems = () => {
    const data = [
        { name: 'Item A', type: 'Type 1', month: 'August', soldQuantity: 150, income: 3000 },
        { name: 'Item B', type: 'Type 2', month: 'August', soldQuantity: 120, income: 2400 },
        { name: 'Item C', type: 'Type 1', month: 'August', soldQuantity: 100, income: 2000 },
        { name: 'Item D', type: 'Type 3', month: 'August', soldQuantity: 90, income: 1800 },
        { name: 'Item E', type: 'Type 2', month: 'August', soldQuantity: 80, income: 1600 },
        { name: 'Item F', type: 'Type 1', month: 'August', soldQuantity: 70, income: 1400 },
        { name: 'Item G', type: 'Type 3', month: 'August', soldQuantity: 60, income: 1200 },
        { name: 'Item H', type: 'Type 2', month: 'August', soldQuantity: 50, income: 1000 },
    ];

    const itemsPerPage = 5;
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
            <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faArrowUp} className="text-3xl mr-4 text-green-500" />
                <h2 className="text-xl font-semibold">High Demand Items</h2>
            </div>
            <div className="flex-grow overflow-auto h-48">
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border border-gray-200 text-left">Product Name</th>
                            <th className="px-4 py-2 border border-gray-200 text-center">Size/Type</th>
                            <th className="px-4 py-2 border border-gray-200 text-center">Sold Quantity</th>
                            <th className="px-4 py-2 border border-gray-200 text-center">Income</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{item.name}</td>
                                <td className="border px-4 py-2 text-center">{item.type}</td>
                                <td className="border px-4 py-2 text-center">{item.soldQuantity}</td>
                                <td className="border px-4 py-2 text-center">${item.income}</td>
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

export default HighDemandItems;