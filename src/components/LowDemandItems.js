// src/components/LowDemandItems.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

const LowDemandItems = () => {
    const data = [
        { name: 'Item X', type: 'Type A', month: 'August', soldQuantity: 30, income: 600 },
        { name: 'Item Y', type: 'Type B', month: 'August', soldQuantity: 25, income: 500 },
        { name: 'Item Z', type: 'Type C', month: 'August', soldQuantity: 20, income: 400 },
        { name: 'Item W', type: 'Type A', month: 'August', soldQuantity: 15, income: 300 },
        { name: 'Item V', type: 'Type B', month: 'August', soldQuantity: 10, income: 200 },
        { name: 'Item U', type: 'Type C', month: 'August', soldQuantity: 5, income: 100 },
        { name: 'Item T', type: 'Type A', month: 'August', soldQuantity: 3, income: 60 },
        { name: 'Item S', type: 'Type B', month: 'August', soldQuantity: 2, income: 40 },
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
                <FontAwesomeIcon icon={faArrowDown} className="text-3xl mr-4 text-red-500" />
                <h2 className="text-xl font-semibold">Low Demand Items</h2>
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

export default LowDemandItems;