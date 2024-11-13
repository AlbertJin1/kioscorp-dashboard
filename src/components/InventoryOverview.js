import React, { useState, useEffect } from 'react';
import { FaBoxes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Import icons from react-icons
import Loader from './Loader'; // Import Loader component
import axios from 'axios'; // Make sure to install axios if you haven't already

const InventoryOverview = () => {
    const [loading, setLoading] = useState(true); // State for loading
    const [data, setData] = useState([]); // State for inventory data
    const [currentPage, setCurrentPage] = useState(1); // State for pagination
    const [sortConfig, setSortConfig] = useState({ key: 'product_name', direction: 'asc' }); // State for sorting configuration

    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token'); // Adjust the key as necessary
                const response = await axios.get('http://192.168.254.101:8000/api/products/overview/', {
                    headers: {
                        Authorization: `Token ${token}`, // Use the appropriate format for your token
                    },
                });

                // Sort the fetched data alphabetically by product_name in ascending order
                const sortedData = response.data.sort((a, b) => a.product_name.localeCompare(b.product_name));

                setData(sortedData); // Set the fetched and sorted data
            } catch (error) {
                console.error("Error fetching inventory data:", error);
            } finally {
                setLoading(false); // Set loading to false after data is fetched
            }
        };

        fetchData();
    }, []);

    const handleNextPage = () => {
        const totalPages = Math.ceil(data.length / itemsPerPage);
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';

        // Check if the key is product_quantity
        if (key === 'product_quantity') {
            // If it's the first time clicking, set to descending
            if (sortConfig.key !== key) {
                direction = 'desc'; // Default to descending on first click
            } else {
                // If already sorted by this key, toggle the direction
                direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
            }
        } else if (key !== 'stock_level') {
            // Toggle sorting for product_name
            if (sortConfig.key === key && sortConfig.direction === 'asc') {
                direction = 'desc';
            }
        } else {
            // For stock_level, always sort in ascending order
            direction = 'asc';
        }

        setSortConfig({ key, direction });

        // Sort the entire dataset
        const sortedData = [...data].sort((a, b) => {
            if (key === 'stock_level') {
                const aStockLevel = Number(a[key]);
                const bStockLevel = Number(b[key]);
                return direction === 'asc' ? aStockLevel - bStockLevel : bStockLevel - aStockLevel;
            } else if (typeof a[key] === 'string') {
                return direction === 'asc' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
            } else {
                return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
            }
        });

        setData(sortedData); // Set the sorted data
        setCurrentPage(1); // Reset to the first page
    };

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex);

    return (
        <div className="bg-white shadow-md p-4 rounded-lg flex-grow flex flex-col h-full">
            <div className="flex items-center mb-4">
                <FaBoxes className="text-3xl mr-4 text-red-500" />
                <h2 className="text-xl font-semibold">Inventory Overview</h2>
            </div>
            {!loading ? (
                <>
                    <div className="flex-grow overflow-auto h-full">
                        <table className="min-w-full border-collapse border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th
                                        className="px-4 py-2 border border-gray-200 text-left cursor-pointer"
                                        onClick={() => handleSort('product_name')}
                                    >
                                        Product Name {sortConfig.key === 'product_name' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ''}
                                    </th>
                                    <th
                                        className="px-4 py-2 border border-gray-200 text-center cursor-pointer"
                                        onClick={() => handleSort('product_quantity')}
                                    >
                                        Quantity {sortConfig.key === 'product_quantity' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ''}
                                    </th>
                                    <th
                                        className="px-4 py-2 border border-gray-200 text-center"
                                    >
                                        Stock Level
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{item.product_name}</td>
                                        <td className="border px-4 py-2 text-center">{item.product_quantity}</td>
                                        <td className="border px-4 py-2 text-center">{item.stock_level}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <button
                            className={`p-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            <FaChevronLeft className="text-xl" />
                        </button>
                        <span className="font-semibold text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className={`p-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            <FaChevronRight className="text-xl" />
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