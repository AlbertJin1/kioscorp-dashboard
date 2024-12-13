import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tooltip } from 'react-tooltip';
import { FaTrophy } from 'react-icons/fa';
import Loader from './Loader'; // Import your Loader component

const TopSellingProducts = () => {
    const [topSellingProducts, setTopSellingProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopSellingProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/top-selling-products', {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });
                setTopSellingProducts(response.data);
                setLoading(false); // Set loading to false after fetching data
            } catch (error) {
                console.error('Error fetching top-selling products:', error);
                setLoading(false); // Ensure loading is set to false even if there's an error
            }
        };

        fetchTopSellingProducts(); // Fetch products immediately on mount

        // Set up interval refetching every 15 seconds
        const intervalId = setInterval(() => {
            fetchTopSellingProducts(); // Refetch without setting loading to true
        }, 15000);

        // Clear the interval when component unmounts
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="p-4 flex flex-col bg-white rounded-lg shadow-md h-full">
            <h1 className="text-2xl font-bold mb-4 text-center flex items-center">
                <FaTrophy className="mr-2 text-3xl text-yellow-500" />
                Top Selling Products
            </h1>
            {loading ? (
                <Loader />
            ) : (
                <div className="overflow-y-auto flex-grow h-72">
                    <table className="min-w-full bg-white rounded">
                        <thead className="bg-[#022a5e] text-white text-md leading-normal sticky top-0 z-10">
                            <tr>
                                <th className="py-2 px-4 text-center">Product</th>
                                <th className="py-2 px-4 text-center">Month</th>
                                <th className="py-2 px-4 text-center">Total Sold (Month)</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm font-light h-auto">
                            {topSellingProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="py-4 text-center text-gray-700">
                                        No data available
                                    </td>
                                </tr>
                            ) : (
                                topSellingProducts.map((product, index) => (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 text-lg font-semibold">
                                        <td className="py-3 px-6 flex items-center justify-center">
                                            <div className="relative">
                                                <img
                                                    src={product.product_image}
                                                    alt={product.product_name}
                                                    className="w-16 h-16 rounded object-cover"
                                                    id={`product-image-${index}`} // ID for Tooltip anchor
                                                    data-tooltip-content={`${product.product_name} (${product.product_color}, ${product.product_size})`} // Updated tooltip content
                                                />
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-center">{product.top_selling_month}</td>
                                        <td className="py-3 px-6 text-center">{product.total_sold}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <Tooltip
                        anchorSelect="[id^='product-image-']"
                        className="font-semibold z-10"
                        place="right"
                        style={{ fontSize: '1rem' }}
                    />
                </div>
            )}
        </div>
    );
};

export default TopSellingProducts;