// src/components/RecentOrders.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

const RecentOrders = () => {
    const data = [
        { orderNumber: '12345', total: 250, date: '2024-09-01' },
        { orderNumber: '12346', total: 180, date: '2024-09-02' },
        { orderNumber: '12347', total: 300, date: '2024-09-03' },
        { orderNumber: '12348', total: 120, date: '2024-09-04' },
        { orderNumber: '12349', total: 220, date: '2024-09-05' },
        { orderNumber: '12350', total: 90, date: '2024-09-06' },
        { orderNumber: '12351', total: 150, date: '2024-09-07' },
        { orderNumber: '12352', total: 270, date: '2024-09-08' },
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
                <FontAwesomeIcon icon={faClock} className="text-3xl mr-4 text-blue-500" />
                <h2 className="text-xl font-semibold">Recent Orders</h2>
            </div>
            <div className="flex-grow overflow-auto h-48">
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border border-gray-200 text-left">Order Number</th>
                            <th className="px-4 py-2 border border-gray-200 text-center">Total</th>
                            <th className="px-4 py-2 border border-gray-200 text-center">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{item.orderNumber}</td>
                                <td className="border px-4 py-2 text-center">${item.total}</td>
                                <td className="border px-4 py-2 text-center">{item.date}</td>
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

export default RecentOrders;
