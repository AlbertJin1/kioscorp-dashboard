import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader'; // Import the Loader component

const RecentPaidOrders = () => {
    const data = [
        { orderId: 'ORD001', customer: 'John Doe', total: 100, status: 'Paid' },
        { orderId: 'ORD002', customer: 'Jane Smith', total: 150, status: 'Paid' },
        { orderId: 'ORD003', customer: 'Alice Johnson', total: 200, status: 'Paid' },
        { orderId: 'ORD004', customer: 'Bob Brown', total: 250, status: 'Paid' },
        { orderId: 'ORD005', customer: 'Charlie White', total: 300, status: 'Paid' },
        { orderId: 'ORD006', customer: 'David Black', total: 350, status: 'Paid' },
        { orderId: 'ORD007', customer: 'Eve Green', total: 400, status: 'Paid' },
        { orderId: 'ORD008', customer: 'Frank Blue', total: 450, status: 'Paid' },
    ];

    const itemsPerPage = 5;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // Add loading state
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex);

    useEffect(() => {
        const fetchData = () => {
            // Simulate a delay for loading data
            setTimeout(() => {
                setLoading(false); // Stop loading after 1 second
            }, 1000);
        };

        fetchData(); // Simulate data fetching when the component mounts
    }, []);

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
        <div className="bg-white shadow-md p-4 rounded-lg flex-grow flex flex-col h-full">
            <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faClipboardCheck} className="text-3xl mr-4 text-blue-500" />
                <h2 className="text-xl font-semibold">Recent Paid Orders</h2>
            </div>
            {loading ? (
                <div className="flex-grow flex items-center justify-center">
                    <Loader /> {/* Display the loader while data is loading */}
                </div>
            ) : (
                <>
                    <div className="flex-grow overflow-auto h-48">
                        <table className="min-w-full border-collapse border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 border border-gray-200 text-left">Order ID</th>
                                    <th className="px-4 py-2 border border-gray-200 text-center">Customer</th>
                                    <th className="px-4 py-2 border border-gray-200 text-center">Total ($)</th>
                                    <th className="px-4 py-2 border border-gray-200 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{item.orderId}</td>
                                        <td className="border px-4 py-2 text-center">{item.customer}</td>
                                        <td className="border px-4 py-2 text-center">{item.total}</td>
                                        <td className="border px-4 py-2 text-center">{item.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Page Controls with Icons and Page Counter */}
                    <div className="flex justify-between items-center">
                        <button
                            className={`p-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
                        </button>
                        <span className="font-semibold text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className={`p-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default RecentPaidOrders;
