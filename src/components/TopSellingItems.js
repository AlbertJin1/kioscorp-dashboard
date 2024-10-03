import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader'; // Adjust the import path as needed

const TopSellingItems = () => {
    const data = [
        { name: 'Bolt A', month: 'August', totalSold: 100 },
        { name: 'Bolt B', month: 'August', totalSold: 50 },
        { name: 'Bolt C', month: 'August', totalSold: 75 },
        { name: 'Bolt D', month: 'August', totalSold: 30 },
        { name: 'Bolt E', month: 'August', totalSold: 90 },
        { name: 'Bolt F', month: 'August', totalSold: 45 },
        { name: 'Bolt G', month: 'August', totalSold: 60 },
        { name: 'Bolt H', month: 'August', totalSold: 20 },
    ];

    const itemsPerPage = 6;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // Loading state
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex);

    useEffect(() => {
        const fetchData = () => {
            setLoading(true); // Start loading
            setTimeout(() => {
                setLoading(false); // Stop loading after 1 second
            }, 1000); // Simulate data fetching delay
        };

        fetchData();
    }, []); // Only runs once when the component mounts

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
            <div className="flex items-center mb-2">
                <FontAwesomeIcon icon={faTrophy} className="text-3xl mr-4 text-yellow-500" />
                <h2 className="text-xl font-semibold">Top Selling Items</h2>
            </div>

            {loading ? (
                <div className="flex-grow flex items-center justify-center">
                    <Loader color="blue" /> {/* Show loader while data is loading */}
                </div>
            ) : (
                <>
                    <div className="flex-grow overflow-auto h-64">
                        <table className="min-w-full mt-2 border-collapse border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 border border-gray-200 text-left w-1/2">Product Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-center w-1/4">Month</th>
                                    <th className="px-4 py-2 border border-gray-200 text-center w-1/4">Total Sold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{item.name}</td>
                                        <td className="border px-4 py-2 text-center">{item.month}</td>
                                        <td className="border px-4 py-2 text-center">{item.totalSold}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center mt-4">
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

export default TopSellingItems;
