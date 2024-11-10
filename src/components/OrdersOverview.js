import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaClipboardCheck, FaClipboardList } from 'react-icons/fa'; // Import icons from react-icons
import Loader from './Loader'; // Import Loader component
import axios from 'axios'; // Make sure to install axios if you haven't already

const OrdersOverview = () => {
    const [loading, setLoading] = useState(true); // State for loading
    const [totalPaidOrders, setTotalPaidOrders] = useState(0); // State for total paid orders
    const [totalPendingOrders, setTotalPendingOrders] = useState(0); // State for total pending orders

    // Function to fetch order counts
    const fetchOrderCounts = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            const response = await axios.get('http://localhost:8000/api/orders/counts/', {
                headers: {
                    Authorization: `Token ${token}` // Include the token in the request headers
                }
            });
            setTotalPaidOrders(response.data.totalPaidOrders); // Set total paid orders
            setTotalPendingOrders(response.data.totalPendingOrders); // Set total pending orders
        } catch (error) {
            console.error('Error fetching order data:', error);
        } finally {
            setLoading(false); // Set loading to false after data is "fetched"
        }
    };

    useEffect(() => {
        fetchOrderCounts(); // Initial fetch

        const interval = setInterval(() => {
            fetchOrderCounts(); // Refetch every 15 seconds
        }, 15000); // 15000 milliseconds = 15 seconds

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    return (
        <div className="bg-white shadow-md p-4 rounded-lg flex-grow flex h-full">
            <div className="flex-grow">
                <h2 className="text-2xl font-semibold flex items-center">
                    <FaMoneyBillWave className="text-3xl mr-2 text-blue-500" />
                    Orders Overview
                </h2>
                {!loading ? (
                    <div className="flex flex-col gap-4 mt-4">
                        <div className="p-4 border rounded bg-gray-100 flex flex-col h-full">
                            <h3 className="flex items-center mb-2 text-xl">
                                <FaClipboardCheck className="text-xl mr-2 text-green-500" />
                                Total Paid Orders
                            </h3>
                            <p className="text-3xl flex-grow text-center">{totalPaidOrders}</p>
                        </div>
                        <div className="p-4 border rounded bg-gray-100 flex flex-col h-full">
                            <h3 className="flex items-center mb-2 text-xl">
                                <FaClipboardList className="text-xl mr-2 text-orange-500" />
                                Total Pending Orders
                            </h3>
                            <p className="text-3xl flex-grow text-center">{totalPendingOrders}</p>
                        </div>
                    </div>
                ) : (
                    <Loader /> // Show loader while loading
                )}
            </div>
        </div>
    );
};

export default OrdersOverview;