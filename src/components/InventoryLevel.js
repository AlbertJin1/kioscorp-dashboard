import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tooltip } from 'react-tooltip';
import { FaArrowUp, FaBoxes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Loader from './Loader';

const InventoryLevel = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState('product_name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(true);
    const productsPerPage = 5;

    useEffect(() => {
        const loadInitialData = async () => {
            setTimeout(async () => {
                await fetchProducts();
                setLoading(false);
            }, 1000); // 1-second delay for initial load
        };
        loadInitialData();

        const interval = setInterval(() => {
            fetchProducts();
        }, 15000); // Refetch every 15 seconds without resetting loading
        return () => clearInterval(interval);
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/products', {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

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

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

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
                                {currentProducts.map((product, index) => (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 text-lg font-semibold">
                                        <td className="py-3 px-6 text-center relative">
                                            <div className="flex justify-center items-center h-full relative">
                                                <img
                                                    src={product.product_image ? `http://localhost:8000${product.product_image}` : "https://via.placeholder.com/150"}
                                                    alt={product.product_name}
                                                    className="w-16 h-16 object-cover rounded mx-auto"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://via.placeholder.com/150";
                                                    }}
                                                    id={`product-image-${index}`} // Unique ID for the image
                                                    data-tooltip-content={product.product_name} // Tooltip content
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={`flex items-center bg-blue-500 text-white px-4 py-2 rounded transition-all duration-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                        >
                            <FaChevronLeft className="mr-2" />
                            Prev
                        </button>
                        <span className="self-center">
                            {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`flex items-center bg-blue-500 text-white px-4 py-2 rounded transition-all duration-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                        >
                            Next
                            <FaChevronRight className="ml-2" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryLevel;