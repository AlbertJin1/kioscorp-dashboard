import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader'; // Adjust the import path as needed

const HighDemandItems = () => {
    const data = [
        { name: 'Bolt A', type: 'Type 1', soldQuantity: 300, revenue: 6000 },
        { name: 'Bolt B', type: 'Type 2', soldQuantity: 250, revenue: 5000 },
        { name: 'Bolt C', type: 'Type 3', soldQuantity: 200, revenue: 4000 },
        { name: 'Bolt D', type: 'Type 1', soldQuantity: 180, revenue: 3600 },
        { name: 'Bolt E', type: 'Type 2', soldQuantity: 150, revenue: 3000 },
        { name: 'Bolt F', type: 'Type 3', soldQuantity: 120, revenue: 2400 },
        { name: 'Bolt G', type: 'Type 1', soldQuantity: 100, revenue: 2000 },
        { name: 'Bolt H', type: 'Type 2', soldQuantity: 80, revenue: 1600 },
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
                <FontAwesomeIcon icon={faArrowUp} className="text-3xl mr-4 text-green-500" />
                <h2 className="text-xl font-semibold">High Demand Items</h2>
            </div>
            {loading ? (
                <Loader /> // Show loader while loading
            ) : (
                <>
                    <div className="flex-grow overflow-auto h-56">
                        <table className="min-w-full border-collapse border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 border border-gray-200 text-left">Item Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-center">Type</th>
                                    <th className="px-4 py-2 border border-gray-200 text-center">Sold Quantity</th>
                                    <th className="px-4 py-2 border border-gray-200 text-center">Revenue ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{item.name}</td>
                                        <td className="border px-4 py-2 text-center">{item.type}</td>
                                        <td className="border px-4 py-2 text-center">{item.soldQuantity}</td>
                                        <td className="border px-4 py-2 text-center">${item.revenue}</td>
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

export default HighDemandItems;
