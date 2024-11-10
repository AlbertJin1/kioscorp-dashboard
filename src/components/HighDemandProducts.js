import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowUp } from 'react-icons/fa';

const HighDemandProducts = () => {
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [fade, setFade] = useState(false); // State to manage fade effect

    useEffect(() => {
        const fetchHighDemandProducts = async () => {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            try {
                const response = await axios.get('http://localhost:8000/api/top-selling-products/', {
                    headers: {
                        Authorization: `Token ${token}`, // Include the token in the request headers
                    },
                });
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching high demand products:", error);
            }
        };

        fetchHighDemandProducts();
    }, []);

    useEffect(() => {
        // Start the automatic product change interval
        const id = setInterval(() => {
            changeProduct((prevIndex) => (prevIndex + 1) % products.length);
        }, 5000);
        setIntervalId(id);

        return () => clearInterval(id); // Cleanup on unmount
    }, [products.length]);

    const changeProduct = (newIndex) => {
        setFade(true); // Trigger fade effect
        setTimeout(() => {
            setCurrentIndex(newIndex);
            setFade(false); // Reset fade effect
        }, 500); // Duration of the fade effect
    };

    const handleProductChange = (index) => {
        if (index !== currentIndex) {
            changeProduct(index); // Change product with fade effect
        }

        // Reset the timer when manually selecting a product
        if (intervalId) {
            clearInterval(intervalId);
        }
        const id = setInterval(() => {
            changeProduct((prevIndex) => (prevIndex + 1) % products.length);
        }, 5000);
        setIntervalId(id);
    };

    if (products.length === 0) {
        return <div>Loading...</div>; // Loading state
    }

    const currentProduct = products[currentIndex];

    return (
        <div className="flex flex-col bg-white shadow-md p-4 rounded-lg h-full">
            {/* Title at the Top */}
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FaArrowUp className="mr-2 text-green-500 text-3xl" />
                High Demand Products
            </h2>

            {/* Left and Right Sections */}
            <div className="flex flex-row items-center justify-center w-full space-x-6 h-full">
                {/* Left Section: Product Image */}
                <div className="flex flex-col items-center w-1/2">
                    <img
                        src={currentProduct.product_image}
                        alt={currentProduct.product_name}
                        className={`w-72 h-auto rounded object-contain transition-opacity duration-500 ease-in-out ${fade ? 'opacity-0' : 'opacity-100'}`} // Smooth transition for image
                    />
                </div>

                {/* Right Section: Product Information */}
                <div className={`flex flex-col w-1/2 transition-opacity duration-500 ease-in-out ${fade ? 'opacity-0' : 'opacity-100'}`}>
                    <h2 className="text-2xl font-bold">{currentProduct.product_name}</h2>
                    <p className="text-lg text-gray-700">Size: {currentProduct.product_size}</p>
                    <p className="text-lg text-gray-700">Type: {currentProduct.product_type}</p>
                    <p className="text-lg text-gray-700">Total Sold: {currentProduct.total_sold}</p>
                </div>
            </div>

            {/* Sl ideshow Indicators */}
            <div className="flex justify-center mt-4">
                {products.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => handleProductChange(index)} // Navigate to the clicked product
                        className={`w-3 h-3 mx-1 rounded-full cursor-pointer transition-transform duration-300 ease-in-out ${index === currentIndex ? 'bg-blue-500 transform scale-125' : 'bg-gray-300'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default HighDemandProducts;