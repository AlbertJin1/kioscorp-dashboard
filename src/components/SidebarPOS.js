import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import logo from '../img/logo/KIOSCORP LOGO.png'; // Adjust the path as needed
import axios from 'axios';
import OrderModal from './OrderModal';
import { CSSTransition, TransitionGroup } from 'react-transition-group'; // Import CSSTransition and TransitionGroup
import './SidebarPOSStyles.css';

const SidebarPOS = forwardRef(({ handleLogout, setPendingOrderCount }, ref) => {
    const [orders, setOrders] = useState([]); // State to hold all pending orders
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:8000/api/orders/pending/', {
                headers: { 'Authorization': `Token ${token}` }
            });
            setOrders(response.data);
            setPendingOrderCount(response.data.length); // Update the count of pending orders
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }, [setPendingOrderCount]); // Add setPendingOrderCount as a dependency

    useEffect(() => {
        fetchOrders(); // Initial fetch

        const intervalId = setInterval(fetchOrders, 5000); // Fetch orders every 5 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [fetchOrders]); // Include fetchOrders in the dependency array

    const handleOrderClick = useCallback((order) => {
        setSelectedOrder(order);
        setIsOpenModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsOpenModal(false);
        setSelectedOrder(null); // Reset selected order when closing modal
    }, []);

    // Create refs for each order
    const orderRefs = orders.map(() => React.createRef());

    return (
        <div ref={ref} className="min-h-screen flex flex-col bg-[#033372] text-white transition-all duration-300 w-90">
            <div className="flex items-center justify-between p-4">
                <img src={logo} alt="Kioscorp Logo" className="h-auto w-72" />
            </div>

            {/* Scrollable Order Information */}
            <div className="flex-grow overflow-y-auto custom-scrollbar">
                <TransitionGroup>
                    {orders.length > 0 ? (
                        [...orders].reverse().map((order, index) => (
                            <CSSTransition
                                key={order.order_id}
                                nodeRef={orderRefs[index]} // Use the ref from the array
                                timeout={300}
                                classNames="order-container"
                            >
                                <div ref={orderRefs[index]} className={`p-4 rounded shadow-md m-4 transition duration-200 cursor-pointer 
                                ${selectedOrder && selectedOrder.order_id === order.order_id ? 'bg-gray-300' : 'bg-white text-black'}`}
                                    onClick={() => handleOrderClick(order)}>

                                    <h3 className="text-lg font-bold">Order ID: {order.order_id}</h3>
                                    <div className="mb-2">
                                        {order.order_items.filter(item => item.order_item_quantity > 0).map(item => (
                                            <div key={item.order_item_id} className="flex justify-between">
                                                <span>{item.product_name}</span>
                                                <span>x{item.order_item_quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between font-bold">
                                        <span>Total:</span>
                                        <span>₱{Number(order.order_amount).toFixed(2)}</span>
                                    </div>
                                </div>
                            </CSSTransition>
                        ))
                    ) : (
                        <CSSTransition
                            nodeRef={React.createRef()} // Create a new ref here
                            timeout={300}
                            classNames="order-container"
                        >
                            <div ref={React.createRef()} className="bg-white text-black p-4 rounded shadow-md m-4">
                                <h3 className="text-lg font-bold">No pending orders.</h3>
                            </div>
                        </CSSTransition>
                    )}
                </TransitionGroup>
            </div>
            {isOpenModal && (
                <OrderModal
                    isOpen={isOpenModal}
                    onClose={handleCloseModal}
                    order={selectedOrder}
                />
            )}

            <button
                onClick={handleLogout}
                className="flex items-center m-4 px-4 py-2 rounded bg-white text-black hover:bg-blue-200 transition duration-200 font-semibold text-xl" // Updated colors
            >
                <FaSignOutAlt className="mr-2" size={30} />
                <span>Logout</span>
            </button>
        </div>
    );
});

export default SidebarPOS; // Ensure default export