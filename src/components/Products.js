import React, { useState, useEffect } from 'react';
import { FaPlusCircle, FaTimes, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import './styles.css'; // Import your CSS file for custom scrollbar styles

const Products = () => {
    const [mainCategory, setMainCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [mainCategories, setMainCategories] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [newSubCategoryName, setNewSubCategoryName] = useState('');

    useEffect(() => {
        const fetchMainCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const config = {
                        headers: {
                            'Authorization': `Token ${token}`,
                        }
                    };
                    const res = await axios.get('http://localhost:8000/api/main-categories/', config);
                    setMainCategories(res.data);
                } else {
                    showError('You are not authorized to view main categories.');
                }
            } catch (error) {
                if (error.response.status === 403) {
                    showError('You do not have permission to view main categories.');
                } else {
                    showError('Error fetching main categories');
                }
            }
        };

        fetchMainCategories();
    }, []);

    useEffect(() => {
        const fetchSubCategories = async () => {
            if (mainCategory) {
                try {
                    const token = localStorage.getItem('token');
                    if (token) {
                        const config = {
                            headers: {
                                'Authorization': `Token ${token}`,
                            }
                        };
                        const res = await axios.get(`http://localhost:8000/api/sub-categories/?main_category=${mainCategory.main_category_id}`, config);
                        const subCategories = res.data.filter(subCategory => subCategory.main_category === mainCategory.main_category_id);
                        setSubCategories(subCategories.sort((a, b) => a.sub_category_name.localeCompare(b.sub_category_name)));
                    } else {
                        showError('You are not authorized to view subcategories.');
                    }
                } catch (error) {
                    if (error.response.status === 403) {
                        showError('You do not have permission to view subcategories.');
                    } else {
                        showError('Error fetching subcategories');
                    }
                }
            } else {
                setSubCategories([]); // Clear subcategories when no main category is selected
            }
        };

        fetchSubCategories();
    }, [mainCategory]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (selectedSubCategory) {
                try {
                    const token = localStorage.getItem('token');
                    if (token) {
                        const config = {
                            headers: {
                                'Authorization': `Token ${token}`,
                            }
                        };
                        const res = await axios.get(`http://localhost:8000/api/products/?sub_category=${selectedSubCategory.sub_category_id}`, config);
                        setProducts(res.data);
                    } else {
                        showError('You are not authorized to view products.');
                    }
                } catch (error) {
                    if (error.response.status === 403) {
                        showError('You do not have permission to view products.');
                    } else {
                        showError('Error fetching products');
                    }
                }
            }
        };

        fetchProducts();
    }, [selectedSubCategory]);

    const showError = (message) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message,
            position: 'top-end',
            toast: true,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    };

    const handleMainCategoryClick = (category) => {
        // Unselect main category if it's already selected
        if (mainCategory && category.main_category_id === mainCategory.main_category_id) {
            setMainCategory(null);
            setSelectedSubCategory(null);
            setSelectedProduct(null);
            setProducts([]); // Clear products when unselecting
            setSubCategories([]); // Clear subcategories when unselecting
        } else {
            setMainCategory(category);
            setSelectedSubCategory(null);
            setSelectedProduct(null);
        }
    };

    const handleSubCategoryClick = (subCategory) => {
        // Unselect subcategory if it's already selected
        if (selectedSubCategory && subCategory.sub_category_id === selectedSubCategory.sub_category_id) {
            setSelectedSubCategory(null);
            setSelectedProduct(null);
            setProducts([]); // Clear products when unselecting
        } else {
            setSelectedSubCategory(subCategory);
            setSelectedProduct(null);
        }
    };

    const handleProductClick = (product) => {
        // Unselect product if it's already selected
        if (selectedProduct && product.id === selectedProduct.id) {
            setSelectedProduct(null);
        } else {
            setSelectedProduct(product);
        }
    };

    // handleAddSubCategory
    const handleAddSubCategory = async () => {
        if (!newSubCategoryName) {
            // Show error if the input is empty
            Swal.fire({
                icon: 'warning',
                title: 'Input Required',
                text: 'Please enter a subcategory name.',
                position: 'top-end',
                toast: true,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            return;
        }

        if (mainCategory) {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const data = {
                        sub_category_name: newSubCategoryName,
                        main_category: mainCategory.main_category_id
                    };
                    const response = await fetch('http://localhost:8000/api/sub-categories/', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                    if (response.ok) {
                        setNewSubCategoryName('');
                        setModalOpen(false);
                        // Refetch subcategories to include the newly added one
                        const res = await fetch(`http://localhost:8000/api/sub-categories/?main_category=${mainCategory.main_category_id}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Token ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        const subCategories = await res.json();
                        setSubCategories(subCategories.filter(subCategory => subCategory.main_category === mainCategory.main_category_id));
                        // Show success alert
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'Subcategory added successfully.',
                            position: 'top-end',
                            toast: true,
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                        });
                    } else {
                        showError('Error adding subcategory');
                    }
                } else {
                    showError('You are not authorized to add subcategories.');
                }
            } catch (error) {
                if (error.response.status === 403) {
                    showError('You do not have permission to add subcategories.');
                } else {
                    showError('Error adding subcategory');
                }
            }
        }
    };
    const handleAddProduct = async () => {
        // Add product logic here
    };

    return (
        <div className="flex flex-col lg:flex-row h-full text-white font-bold gap-4">
            {/* Left Categories Section */}
            <div className="w-full lg:w-1/3 rounded-lg flex flex-col h-full">
                {/* Category Buttons */}
                <div className="flex justify-center mb-4 gap-10 bg-blue-900 py-3 rounded-lg">
                    {mainCategories.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => handleMainCategoryClick(category)}
                            className={`w-36 rounded-full py-1 px-4 text-black border border-black ${mainCategory?.main_category_id === category.main_category_id ? 'bg-yellow-500' : 'bg-white'} hover:bg-yellow-600`}
                        >
                            {category.main_category_name}
                        </button>
                    ))}
                </div>

                <div className='text-yellow-500 p-4 bg-blue-900 rounded-tl-lg rounded-tr-lg flex justify-between items-center'>
                    <h2 className='text-2xl'>Categories</h2>

                    <div className={`flex items-center transition-all duration-500 ease-in-out ${searchOpen ? 'w-1/2 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                        <div className="flex items-center w-full px-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="p-1 rounded text-md text-black font-semibold w-full transition-width duration-500 ease-in-out"
                                placeholder="Search"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-x-2">
                        <div className="flex items-center cursor-pointer" onClick={() => {
                            setSearchOpen(!searchOpen);
                            if (searchOpen) {
                                setSearchQuery('');
                            }
                        }}>
                            {searchOpen ? (
                                <FaTimes className="text-yellow-500 hover:text-yellow-300" size={32} />
                            ) : (
                                <FaSearch className="text-yellow-500 hover:text-yellow-300" size={30} />
                            )}
                        </div>

                        <FaPlusCircle
                            className="text-yellow-500 cursor-pointer hover:text-yellow-300"
                            size={30}
                            onClick={() => {
                                if (mainCategory) {
                                    setModalOpen(true);
                                } else {
                                    showError('Please select a main category before adding a subcategory.');
                                }
                            }}
                        />
                    </div>
                </div>


                {/* Scrollable Categories Section */}
                <div className="flex-grow flex flex-col px-4 bg-blue-900 rounded-bl-lg rounded-br-lg overflow-y-auto pb-2 custom-scrollbar">
                    {subCategories.length > 0 ? (
                        <div className="categories-list">
                            {subCategories.filter(subCategory => subCategory.sub_category_name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                                subCategories.filter(subCategory => subCategory.sub_category_name.toLowerCase().includes(searchQuery.toLowerCase())).map((category, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSubCategoryClick(category)}
                                        className={`rounded-full py-2 px-4 mb-1 hover:bg-yellow-500 hover:text-black cursor-pointer ${selectedSubCategory?.sub_category_id === category.sub_category_id ? 'bg-yellow-500 text-black' : 'bg-blue-700 text-white'}`}
                                    >
                                        {category.sub_category_name}
                                    </li>
                                ))
                            ) : (
                                <p className="text-white text-center py-10">No categories found with the name "{searchQuery}"</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-white text-center py-10">{mainCategory ? `No categories found in ${mainCategory?.main_category_name}` : 'Select a main category to view subcategories.'}</p>
                    )}
                </div>
            </div>

            {/* Middle Products Section */}
            <div className="w-full lg:w-1/2 flex flex-col">
                {/* Title Section */}
                <div className="text-2xl text-yellow-500 p-4 bg-blue-900 rounded-tl-lg rounded-tr-lg flex justify-between items-center">
                    <h2>Products</h2>
                    {/* Add Product Icon */}
                    <FaPlusCircle
                        className="text-yellow-500 cursor-pointer hover:text-yellow-300"
                        size={30}
                        onClick={() => {
                            if (selectedSubCategory) {
                                handleAddProduct();
                            } else {
                                showError('Please select a subcategory before adding a product.'); // Use SweetAlert2 for this alert
                            }
                        }} // Open modal on click
                    />
                </div>

                {/* Scrollable Products Section */}
                <div className="flex-grow px-4 pb-2 bg-blue-900 rounded-br-lg rounded-bl-lg overflow-y-auto custom-scrollbar">
                    {products.length > 0 ? (
                        <ul>
                            {products.map((product) => (
                                <li
                                    key={product.id}
                                    onClick={() => handleProductClick(product)}
                                    className={`rounded-full py-2 px-4 mb-1 hover:bg-yellow-500 hover:text-black cursor-pointer ${selectedProduct?.id === product.id ? 'bg-yellow-500 text-black' : 'bg-blue-700 text-white'}`}
                                >
                                    {product.product_name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-white text-center py-10">No products found</p>
                    )}
                </div>
            </div>

            {/* Right Product Detail Section */}
            <div className="w-full lg:w-1/2 flex flex-col">
                {/* Title for Product Details */}
                <div className="text-2xl text-yellow-500 p-4 bg-blue-900 rounded-tl-lg rounded-tr-lg">
                    <h2>Product Details</h2>
                </div>

                {/* Product Details */}
                <div className="flex-grow px-4 pb-2 bg-blue-900 rounded-br-lg rounded-bl-lg overflow-y-auto custom-scrollbar">
                    {selectedProduct ? (
                        <div>
                            <h3 className="text-yellow-500">{selectedProduct.product_name}</h3>
                            <p>{selectedProduct.description}</p>
                            <p>Price: ${selectedProduct.price}</p>
                        </div>
                    ) : (
                        <p className="text-white text-center py-10">Select a product to see details</p>
                    )}
                </div>
            </div>

            {/* Modal for Adding Subcategory */}
            {modalOpen && (
                <div className="bg-black bg-opacity-50 fixed inset-0 flex justify-center items-center z-50">
                    <div className="bg-blue-800 p-6 rounded-lg shadow-lg text-black">
                        <h2 className="text-xl mb-4 text-yellow-500">Add Subcategory</h2>
                        <input
                            type="text"
                            value={newSubCategoryName}
                            onChange={(e) => setNewSubCategoryName(e.target.value)}
                            className="p-2 mb-4 w-full rounded"
                            placeholder="Enter subcategory name"
                        />
                        <div className="flex justify-end">
                            <button
                                className="bg-yellow-500 text-black rounded px-4 py-2 mr-2"
                                onClick={() => {
                                    handleAddSubCategory();
                                    setNewSubCategoryName(''); // Clear the input after adding
                                }}
                            >
                                Add
                            </button>
                            <button
                                className="bg-red-500 text-white rounded px-4 py-2"
                                onClick={() => {
                                    setModalOpen(false);
                                    setNewSubCategoryName(''); // Clear the input when closing the modal
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Products;