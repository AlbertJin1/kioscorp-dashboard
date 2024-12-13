import React, { useRef, useEffect, useState, useCallback } from 'react';
import { FaTimes, FaCheck, FaBan } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

const OrderModal = ({ isOpen, onClose, order, loggedInUser }) => {
    const modalRef = useRef(null);
    const [isSweetAlertOpen, setIsSweetAlertOpen] = useState(false);
    const [vatPercentage, setVatPercentage] = useState(0); // State for VAT percentage

    // Fetch VAT settings when the modal opens
    useEffect(() => {
        if (isOpen) {
            axios.get('http://localhost:8000/api/vat-setting/')
                .then(response => {
                    setVatPercentage(response.data.vat_percentage);
                })
                .catch(error => {
                    console.error('Error fetching VAT setting:', error);
                });
        }
    }, [isOpen]);

    const calculateTotals = useCallback(() => {
        const subtotal = order?.order_items.reduce(
            (total, item) => total + item.product_price * item.order_item_quantity,
            0
        );
        const vatAmount = subtotal * (vatPercentage / 100); // Calculate VAT amount
        const total = subtotal + vatAmount; // Total including VAT
        return { subtotal, vatAmount, total }; // Return an object with subtotal, VAT, and total
    }, [order, vatPercentage]);

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

    const handlePayOrder = useCallback(async () => {
        setIsSweetAlertOpen(true);
        const { total } = calculateTotals();

        const { value: amountGiven } = await Swal.fire({
            title: '💵 How much money did the customer give?',
            html: `
                <input id="swal-input1" class="swal2-input border border-gray-300 rounded-lg p-2" type="number" placeholder="Enter amount" />
                <div id="quick-amount-buttons" class="mt-4 flex flex-wrap justify-center gap-2">
                    <button type ="button" data-value="50" class="quick-amount bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">₱50</button >
                    <button type="button" data-value="100" class="quick-amount bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">₱100</button>
                    <button type="button" data-value="150" class="quick-amount bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">₱150</button>
                    <button type="button" data-value="200" class="quick-amount bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">₱200</button>
                    <button type="button" data-value="300" class="quick-amount bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">₱300</button>
                    <button type="button" data-value="500" class="quick-amount bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">₱500</button>
                    <button type="button" data-value="800" class="quick-amount bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">₱800</button>
                    <button type="button" data-value="1000" class="quick-amount bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">₱1000</button>
                    <button type="button" data-value="2000" class="quick-amount bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">₱2000</button>
                    <button type="button" data-value="3000" class="quick-amount bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">₱3000</button>
                    <button type="button" data-value="5000" class="quick-amount bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">₱5000</button>
                </div >
    `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            customClass: {
                confirmButton: 'bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300',
                cancelButton: 'bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300',
            },
            didOpen: () => {
                const input = Swal.getPopup().querySelector('#swal-input1');
                const buttons = Swal.getPopup().querySelectorAll('.quick-amount');

                buttons.forEach((button) => {
                    button.addEventListener('click', () => {
                        buttons.forEach((btn) => btn.classList.remove('bg-blue-700'));
                        button.classList.add('bg-blue-700');
                        input.value = button.getAttribute('data-value');
                        input.focus();
                    });
                });

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') Swal.clickConfirm();
                });
            },
            preConfirm: () => {
                const input = Swal.getPopup().querySelector('#swal-input1').value;
                if (!input || isNaN(input)) {
                    Swal.showValidationMessage(`Please enter a valid amount`);
                } else if (parseFloat(input) < total) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Insufficient Amount',
                        text: 'The amount given is less than the total amount. Please try again.',
                        showConfirmButton: false,
                        timer: 1000,
                    });
                    return false; // Prevent closing of the modal
                }
                return parseFloat(input);
            },
        });

        if (amountGiven) {
            Swal.fire({
                title: 'Processing...',
                text: 'Please wait while we process your payment.',
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const change = amountGiven - total;

            try {
                const response = await axios.patch(`http://localhost:8000/api/orders/pay/${order.order_id}/`, {
                    order_paid_amount: amountGiven,
                    cashier_first_name: loggedInUser.firstName,
                    cashier_last_name: loggedInUser.lastName,
                    vat_percentage: vatPercentage, // Include VAT percentage in the request
                });

                Swal.close();
                setIsSweetAlertOpen(false);

                if (response.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Payment Successful',
                        html: `<p class="text-xl text-gray-700">Change to return: <span class="text-4xl font-bold text-green-600">₱${change.toFixed(2)}</span></p>`,
                    });
                    onClose();
                }
            } catch (error) {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Payment Error',
                    text: error.response?.data.error || 'An error occurred while processing the payment.',
                });
            }
        } else {
            setIsSweetAlertOpen(false);
            console.log("No amount given, payment cancelled.");
        }
    }, [calculateTotals, order, loggedInUser, vatPercentage, onClose]);

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

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isOpen && event.key === 'Enter') {
                handlePayOrder();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handlePayOrder]);

    if (!isOpen || !order) return null;

    const { subtotal, vatAmount, total } = calculateTotals();

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-3/4 flex flex-col text-black">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-5xl font-bold">Order ID: {order.order_id}</h2>
                    <button onClick={onClose} className="text-red-500 hover:text-red-700">
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
                                        <div className="w-1/3">
                                            <span className="text-3xl font-bold">{item.product_name}</span>
                                            <div className="text-xl text-gray-600 font-semibold">
                                                {item.product_color}, {item.product_size}
                                            </div>
                                        </div>
                                        <span className="text-3xl font-bold w-1/3 text-center">{item.order_item_quantity}</span>
                                        <span className="text-3xl font-bold w-1/4 text-right mr-4">₱{Number(item.product_price).toFixed(2)}</span>
                                    </div>
                                    <hr className="border-gray-300" />
                                </div>
                            ))}
                        </div>
                        <hr className="border-gray-300 mb-4" />
                        <div className="flex justify-between items-center mt-4">
                            <div className="flex flex-col text-4xl font-bold">
                                <span>Subtotal: ₱{subtotal.toFixed(2)}</span>
                                <span>VAT (at {vatPercentage}%): ₱{vatAmount.toFixed(2)}</span>
                                <span>Total: ₱{total.toFixed(2)}</span>
                            </div>
                            <div className="flex">
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
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderModal;