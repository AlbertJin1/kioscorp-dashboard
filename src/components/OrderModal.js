import React, { useRef, useEffect, useState } from 'react';
import { FaTimes, FaCheck, FaBan } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

const OrderModal = ({ isOpen, onClose, order, loggedInUser }) => { // Accept loggedInUser  as a prop
    const modalRef = useRef(null);
    const [isSweetAlertOpen, setIsSweetAlertOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target) && !isSweetAlertOpen) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose, isSweetAlertOpen]);

    if (!isOpen || !order) return null;

    const calculateTotal = () => {
        return order.order_items.reduce((total, item) => total + item.product_price * item.order_item_quantity, 0);
    };

    const handleVoidOrder = async () => {
        setIsSweetAlertOpen(true);
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, void it!',
            cancelButtonText: 'No, cancel!',
        });
        setIsSweetAlertOpen(false);

        if (result.isConfirmed) {
            try {
                const response = await axios.patch(`http://localhost:8000/api/orders/void/${order.order_id}/`);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 2000,
                    toast: true,
                    background: '#ffffff',
                });
                onClose();
            } catch (error) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: error.response?.data.error || 'An error occurred while voiding the order.',
                    showConfirmButton: false,
                    timer: 2000,
                    toast: true,
                    background: '#ffffff',
                });
            }
        }
    };

    const handlePayOrder = async () => {
        setIsSweetAlertOpen(true);
        console.log("Opening payment modal...");

        const { value: amountGiven } = await Swal.fire({
            title: 'Payment',
            input: 'number',
            inputLabel: 'How much money did the customer give?',
            inputPlaceholder: 'Enter amount',
            showCancelButton: true,
            confirmButtonText: 'Calculate Change',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to enter an amount!';
                }
                if (isNaN(value) || value <= 0) {
                    return 'Please enter a valid amount!';
                }
            }
        });

        console.log("Amount given by customer:", amountGiven);

        if (amountGiven) {
            const loadingAlert = Swal.fire({
                title: 'Processing...',
                text: 'Please wait while we process your payment.',
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const totalAmount = calculateTotal();
            const change = amountGiven - totalAmount;

            console.log("Total amount due:", totalAmount);
            console.log("Change to return:", change);

            // Removed the artificial delay
            loadingAlert.close();
            setIsSweetAlertOpen(false);

            if (change < 0) {
                console.log("Insufficient amount provided.");
                Swal.fire({
                    icon: 'error',
                    title: 'Insufficient Amount',
                    html: `<p class="text-xl text-gray-700">The amount given is not enough. You still owe <span class="text-4xl font-bold text-red-600">₱${Math.abs(change).toFixed(2)}</span>.</p>`,
                    customClass: {
                        title: 'text-3xl font-bold text-red-600',
                    }
                });
            } else {
                try {
                    // Include firstName and lastName in the API request
                    console.log("Sending payment request to the server...");
                    const response = await axios.patch(`http://localhost:8000/api/orders/pay/${order.order_id}/`, {
                        order_paid_amount: amountGiven,
                        cashier_first_name: loggedInUser.firstName, // Pass first name
                        cashier_last_name: loggedInUser.lastName  // Pass last name
                    });

                    console.log("Payment response from server:", response.data);

                    if (response.data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Payment Successful',
                            html: `<p class="text-xl text-gray-700">Change to return: <span class="text-4xl font-bold text-green-600">₱${change.toFixed(2)}</span></p>`,
                            customClass: {
                                title: 'text-3xl font-bold text-green-600',
                            }
                        });
                        onClose(); // Close the modal after successful payment
                    }
                } catch (error) {
                    console.error("Error during payment processing:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Payment Error',
                        text: error.response?.data.error || 'An error occurred while processing the payment.',
                    });
                }
            }
        } else {
            console.log("No amount given, payment cancelled.");
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-3/4 flex flex-col text-black">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-5xl font-bold">Order ID: {order.order_id}</h2>
                    <button onClick={onClose} className="text-white hover:text-gray-200 focus:outline-none transition-colors duration-200 bg-red-500 hover:bg-red-700 p-2 rounded-full">
                        <FaTimes size={30} />
                    </button>
                </div>
                <hr className="border-gray-300 mb-4" />
                {order.order_items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-grow">
                        <p className="text-2xl text-gray-500 mb-4">No items in this order.</p>
                        <button
                            onClick={onClose}
                            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg text-5xl font-bold hover:bg-gray-400 transition duration-300 flex items-center"
                        >
                            <FaTimes className="mr-2" size={50} />
                            CLOSE
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between mb-4 text-4xl font-bold text-gray-600">
                            <span className="w-1/6 text-center">Image</span>
                            <span className="w-1/3">Product Name</span>
                            <span className="w-1/3 text-center">Quantity</span>
                            <span className="w-1/4 text-right mr-8">Price</span>
                        </div>
                        <hr className="border-gray-300" />
                        <div className="flex flex-col flex-grow overflow-y-auto custom-scrollbar">
                            {order.order_items.map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center my-4">
                                        <div className="w-1/6 flex justify-center">
                                            <img
                                                src={item.product_image
                                                    ? `http://localhost:8000${item.product_image}`
                                                    : "https://via.placeholder.com/150"
                                                }
                                                alt={item.product_name}
                                                className="h-20 w-20 object-cover rounded"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/150";
                                                }}
                                            />
                                        </div>
                                        <span className="text-3xl font-bold w-1/3">{item.product_name}</span>
                                        <span className="text-3xl font-bold w-1/3 text-center">{item.order_item_quantity}</span>
                                        <span className="text-3xl font-bold w-1/4 text-right mr-4">₱{Number(item.product_price).toFixed(2)}</span>
                                    </div>
                                    <hr className="border-gray-300" />
                                </div>
                            ))}
                        </div>
                        <hr className="border-gray-300 mb-4" />
                        <div className="flex justify-between items-center mt-4">
                            <div className="flex text-4xl font-bold">
                                <button
                                    onClick={handlePayOrder}
                                    className="flex items-center bg-green-500 text-white hover:text-gray-200 hover:bg-green-700 focus:outline-none transition-colors duration-200 py-2 px-4 rounded-full mr-4"
                                >
                                    <FaCheck size={30} className="mr-2" />
                                    Pay
                                </button>
                                <button
                                    onClick={handleVoidOrder}
                                    className="flex items-center bg-red-500 text-white hover:text-gray-200 hover:bg-red-700 focus:outline-none transition-colors duration-200 py-2 px-4 rounded-full"
                                >
                                    <FaBan size={30} className="mr-2" />
                                    Void
                                </button>
                            </div>
                            <div className="flex justify-end items-center">
                                <span className="text-4xl font-bold mr-4">Total :</span>
                                <span className="text-6xl font-bold">₱{calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderModal;