import React, { useState, useEffect } from 'react';

const OrderHistory = () => {
    const [orderData, setOrderData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('thisYear'); // Default filter
    const rowsPerPage = 14;

    // Fetch data from the backend based on filter
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`/api/orders?filter=${filter}`);
                const data = await response.json();
                setOrderData(data);
            } catch (error) {
                console.error('Error fetching order history:', error);
            }
        };
        fetchOrders();
    }, [filter]); // Re-fetch orders when filter changes

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1); // Reset to first page when changing filter
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        const totalPages = Math.ceil(orderData.length / rowsPerPage);
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const getVisibleData = () => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return orderData.slice(startIndex, endIndex);
    };

    const visibleData = getVisibleData();

    return (
        <div className="p-4">
            {/* Filter Tabs */}
            <div className="flex font-bold text-2xl">
                {['thisYear', 'thisMonth', 'thisWeek', 'today'].map((timeframe) => (
                    <button
                        key={timeframe}
                        className={`flex-1 rounded py-2 px-4 ${filter === timeframe ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-800 transition-colors duration-200 focus:outline-none`}
                        onClick={() => handleFilterChange(timeframe)}
                    >
                        {timeframe === 'thisYear' ? 'This Year' : timeframe === 'thisMonth' ? 'This Month' : timeframe === 'thisWeek' ? 'This Week' : 'Today'}
                    </button>
                ))}
            </div>

            {/* Order History Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-[#033372] text-white border border-[#033372]">
                    <thead>
                        <tr>
                            {['Order No.', 'Product Names', 'Date & Time', 'Unit Price', 'Quantity'].map((header) => (
                                <th
                                    key={header}
                                    className="py-2 px-4 border-b border-[#033372] text-left"
                                    style={{ backgroundColor: '#033372' }} // Column header color
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {visibleData.length > 0 ? (
                            visibleData.map((order, index) => (
                                <tr
                                    key={order.orderNumber}
                                    className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-[#9ACBFF80]' : 'bg-[#033372]'}`}
                                >
                                    <td className="py-2 px-4 border-b border-[#033372]">{order.orderNumber}</td>
                                    <td className="py-2 px-4 border-b border-[#033372]">{order.products.map(product => product.name).join(', ')}</td>
                                    <td className="py-2 px-4 border-b border-[#033372]">{new Date(order.dateTime).toLocaleString()}</td>
                                    <td className="py-2 px-4 border-b border-[#033372]">${order.unitPrice.toFixed(2)}</td>
                                    <td className="py-2 px-4 border-b border-[#033372]">{order.quantity}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-white">
                                    No data available for this filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
                <button
                    className="py-2 px-4 bg-blue-700 text-white hover:bg-blue-800 transition-colors duration-200 focus:outline-none rounded-lg"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button
                    className="py-2 px-4 bg-blue-700 text-white hover:bg-blue-800 transition-colors duration-200 focus:outline-none rounded-lg"
                    onClick={handleNextPage}
                    disabled={currentPage >= Math.ceil(orderData.length / rowsPerPage)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default OrderHistory;
