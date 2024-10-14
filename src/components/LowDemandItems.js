import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader'; // Adjust the import path as needed

const LowDemandItems = () => {
    const data = [
        { name: 'Item A', type: 'Type X', soldQuantity: 10, revenue: 200 },
        { name: 'Item B', type: 'Type Y', soldQuantity: 8, revenue: 160 },
        { name: 'Item C', type: 'Type Z', soldQuantity: 5, revenue: 100 },
        { name: 'Item D', type: 'Type X', soldQuantity: 3, revenue: 60 },
        { name: 'Item E', type: 'Type Y', soldQuantity: 2, revenue: 40 },
        { name: 'Item F', type: 'Type Z', soldQuantity: 1, revenue: 20 },
        { name: 'Item G', type: 'Type X', soldQuantity: 0, revenue: 0 },
    ];

    const itemsPerPage = 5;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // Loading state
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex);

    useEffect(() => {
        const fetchData = () => {
            // Simulate data fetching
            setTimeout(() => {
                setLoading(false); // Stop loading after 1 second
            }, 1000);
        };

        fetchData(); // Simulate fetching data
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
                <FontAwesomeIcon icon={faArrowDown} className="text-3xl mr-4 text-red-500" />
                <h2 className="text-xl font-semibold">Low Demand Items</h2>
            </div>
            {loading ? (
                <Loader /> // Show loader while loading
            ) : (
                <>
                    <div className="flex-grow overflow-auto h-48">
                        <table className="min-w-full border-collapse border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 border border-gray-200 text-left">Item Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-center">Type</th>
                                    <th className="px-4 py-2 border border-gray-200 text-center">Sold Quantity</th>
                                    <th className="px-4 py-2 border border-gray-200 text-center">Revenue (₱)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{item.name}</td>
                                        <td className="border px-4 py-2 text-center">{item.type}</td>
                                        <td className="border px-4 py-2 text-center">{item.soldQuantity}</td>
                                        <td className="border px-4 py-2 text-center">₱{item.revenue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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

export default LowDemandItems;
