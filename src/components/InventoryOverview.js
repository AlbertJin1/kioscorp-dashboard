import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader'; // Import Loader component

const InventoryOverview = () => {
    const [loading, setLoading] = useState(true); // State for loading
    const [data, setData] = useState([]); // State for inventory data
    const [currentPage, setCurrentPage] = useState(1); // State for pagination

    const itemsPerPage = 4;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex);

    useEffect(() => {
        // Simulate data fetching
        const fetchData = async () => {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a delay
            const inventoryData = [
                { name: 'Bolt A', quantity: 50, stockLevel: 'High' },
                { name: 'Bolt B', quantity: 15, stockLevel: 'Low' },
                { name: 'Bolt C', quantity: 30, stockLevel: 'Medium' },
                { name: 'Bolt D', quantity: 10, stockLevel: 'Low' },
                { name: 'Bolt E', quantity: 25, stockLevel: 'Medium' },
                { name: 'Bolt F', quantity: 40, stockLevel: 'High' },
                { name: 'Bolt G', quantity: 5, stockLevel: 'Low' },
            ];
            setData(inventoryData);
            setLoading(false); // Set loading to false after data is fetched
        };

        fetchData();
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
            <div className="flex items-center">
                <FontAwesomeIcon icon={faBoxes} className="text-3xl mr-4 text-red-500" />
                <h2 className="text-xl font-semibold">Inventory Overview</h2>
            </div>
            {!loading ? (
                <>
                    <div className="flex-grow overflow-auto h-48">
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
            ) : (
                <Loader /> // Show loader while data is loading
            )}
        </div>
    );
};

export default InventoryOverview;
