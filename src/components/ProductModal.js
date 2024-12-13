import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ProductModal = ({ isOpen, onRequestClose, products }) => {
    if (!isOpen) return null; // Don't render anything if the modal is not open

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-1/2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Products Sold</h2>
                    <button onClick={onRequestClose} className="text-red-500">
                        <FaTimes size={30} />
                    </button>
                </div>
                <div className="overflow-y-auto max-h-96"> {/* Set max height for scrollable area */}
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-200 sticky top-0">
                            <tr>
                                <th className="border-b px-4 py-2 text-left text-xl">Product</th>
                                <th className="border-b px-4 py-2 text-center text-xl">Sold</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((product, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="py-2 px-4 flex items-center">
                                            <img
                                                src={product.product_image ? `http://localhost:8000${product.product_image}` : "https://via.placeholder.com/150"}
                                                alt={product.product_name}
                                                className="w-20 h-20 object-cover rounded mr-4" // Add margin to the right
                                                onError={(e) => {
                                                    e.target.onerror = null; // Prevents infinite loop
                                                    e.target.src = "https://via.placeholder.com/150"; // Fallback image
                                                }}
                                            />
                                            <span className="text-xl">{product.product_name}</span> {/* Display product name */}
                                        </td>
                                        <td className="py-2 px-4 text-center"><span className="text-green-500 font-bold text-xl">{product.quantity}</span> sold</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center text-gray-500 py-2">No products sold for this month.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;