import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tooltip } from 'react-tooltip';
import { FaArrowUp, FaBoxes } from 'react-icons/fa';
import Loader from './Loader';

const InventoryLevel = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState('product_name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(true);
    const productsPerPage = 5;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://192.168.254.101:8000/api/products', {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });
                setProducts(response.data);
                setLoading(false); // Set loading to false after fetching data
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false); // Ensure loading is set to false even if there's an error
            }
        };

        fetchProducts(); // Fetch products immediately on mount

        const interval = setInterval(() => {
            fetchProducts(); // Refetch every 15 seconds without resetting loading
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    const getStockLevel = (quantity) => {
        if (quantity === 0) return 'Out of Stock';
        if (quantity >= 50) return 'High';
        if (quantity >= 35) return 'Medium';
        return 'Low';
    };

    const sortedProducts = [...products].sort((a, b) => {
        if (sortKey === 'product_name') {
            return sortOrder === 'asc'
                ? a.product_name.localeCompare(b.product_name)
                : b.product_name.localeCompare(a.product_name);
        } else if (sortKey === 'product_quantity') {
            return sortOrder === 'asc'
                ? a.product_quantity - b.product_quantity
                : b.product_quantity - a.product_quantity;
        }
        return 0;
    });

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(products.length / productsPerPage);

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder(key === 'product_quantity' ? 'desc' : 'asc');
        }
        setCurrentPage(1); // Reset to page 1 on sort change
    };

    return (
        <div className="container mx-auto p-4 bg-white shadow-md rounded-lg h-full flex flex-col">
            <h1 className="text-2xl font-bold mb-4 flex items-center">
                <FaBoxes className="mr-2 text-3xl text-red-500" />
                Inventory Levels
            </h1>
            {loading ? (
                <Loader />
            ) : (
                <div className="flex flex-col flex-grow">
                    <div className="overflow-y-auto flex-grow h-56">
                        <table className="min-w-full bg-white rounded ">
                            <thead className="bg-[#022a5e] text-white text-md leading-normal sticky top-0 z-10">
                                <tr>
                                    <th
                                        className="py-2 px-4 text-center w-1/4 cursor-pointer"
                                        onClick={() => handleSort('product_name')}
                                    >
                                        <div className="flex items-center justify-center">
                                            Product
                                            {sortKey === 'product_name' && (
                                                <span
                                                    className={`ml-2 transition-transform duration-300 ${sortOrder === 'asc' ? 'rotate-0' : 'rotate-180'}`}
                                                >
                                                    <FaArrowUp />
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="py-2 px-4 text-center w-1/3 cursor-pointer"
                                        onClick={() => handleSort('product_quantity')}
                                    >
                                        <div className="flex items-center justify-center">
                                            Quantity
                                            {sortKey === 'product_quantity' && (
                                                <span
                                                    className={`ml-2 transition-transform duration-300 ${sortOrder === 'asc' ? 'rotate-0' : 'rotate-180'}`}
                                                >
                                                    <FaArrowUp />
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                    <th className="py-2 px-4 text-center w-1/3">Stock Level</th>
                                </tr>
                            </thead>

                            <tbody className="text-gray-700 text-sm font-light">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="py-4 text-center text-gray-700">
                                            No data available
                                        </td>
                                    </tr>
                                ) : (
                                    currentProducts.map((product, index) => (
                                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 text-lg font-semibold">
                                            <td className="py-3 px-6 text-center relative">
                                                <div className="flex justify-center items-center h-full relative">
                                                    <img
                                                        src={product.product_image ? `http://192.168.254.101:8000${product.product_image}` : "https://via.placeholder.com/150"}
                                                        alt={product.product_name}
                                                        className="w-16 h-16 object-cover rounded mx-auto"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "https://via.placeholder.com/150";
                                                        }}
                                                        id={`product-image-${index}`} // Unique ID for the image
                                                        data-tooltip-content={`${product.product_name} (${product.product_color}, ${product.product_size})`} // Updated tooltip content
                                                        data-tooltip-id={`tooltip-${index}`} // Unique ID for the tooltip
                                                    />
                                                    <Tooltip
                                                        id={`tooltip-${index}`} // Corresponding tooltip ID
                                                        className="font-semibold z-50"
                                                        place="right"
                                                        style={{ fontSize: '1rem' }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                {product.product_quantity === 0 ? 'Out of Stock' : product.product_quantity}
                                            </td>
                                            <td className="py-3 px-6 text-center">{getStockLevel(product.product_quantity)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center items-center mt-4">
                        {/* Page Number Buttons */}
                        {totalPages > 0 && (
                            <>
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    className={`mx-1 px-3 py-1 rounded transition duration-300 ${currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-blue-500 hover:text-white'}`}
                                >
                                    1
                                </button>

                                {currentPage > 3 && <span className="mx-1">...</span>} {/* Show ellipsis if there are pages in between */}

                                {Array.from({ length: Math.min(3, totalPages - 2) }, (_, index) => {
                                    const pageNum = Math.max(2, currentPage - 1) + index; // Start from currentPage - 1
                                    if (pageNum > totalPages - 1) return null; // Avoid rendering pages beyond totalPages

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`mx-1 px-3 py-1 rounded transition duration-300 ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-blue-500 hover:text-white'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                {currentPage < totalPages - 2 && <span className="mx-1">...</span>} {/* Show ellipsis if there are pages in between */}

                                {totalPages > 1 && (
                                    <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        className={`mx-1 px-3 py-1 rounded transition duration-300 ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-blue-500 hover:text-white'}`}
                                    >
                                        {totalPages}
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
};

export default InventoryLevel;