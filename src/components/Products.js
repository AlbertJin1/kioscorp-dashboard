import React, { useState, useEffect } from 'react';
import { FaPlusCircle, FaTimes, FaSearch, FaDownload, FaTrash, FaEdit } from 'react-icons/fa';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
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
    const [newProductName, setNewProductName] = useState('');
    const [newProductType, setNewProductType] = useState('');
    const [newProductSize, setNewProductSize] = useState('');
    const [newProductBrand, setNewProductBrand] = useState('');
    const [newProductColor, setNewProductColor] = useState('');
    const [newProductQuantity, setNewProductQuantity] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [newProductDescription, setNewProductDescription] = useState('');
    const [productImage, setProductImage] = useState(null);
    const [modalOpenProduct, setModalOpenProduct] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [subCategoryImage, setSubCategoryImage] = useState(null);
    const [subCategoryImagePreview, setSubCategoryImagePreview] = useState(null);


    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQueryProduct, setSearchQueryProduct] = useState('');
    const [searchOpenProduct, setSearchOpenProduct] = useState(false);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [newSubCategoryName, setNewSubCategoryName] = useState('');

    useEffect(() => {
        if (mainCategory && selectedSubCategory && selectedSubCategory.main_category !== mainCategory.main_category_id) {
            setSelectedSubCategory(null); // Clear the subcategory if it doesn't match the main category
        }
    }, [mainCategory, selectedSubCategory]);


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
                        const params = {
                            subcategory: selectedSubCategory.sub_category_name, // Use the subcategory name or ID based on your API design
                            include_subcategory: true, // Include subcategory details
                        };
                        const res = await axios.get('http://localhost:8000/api/products/', { params, headers: config.headers });
                        const products = res.data;
                        setProducts(products); // No need for additional filtering here
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
            } else {
                setProducts([]); // Clear products when no subcategory is selected
            }
        };

        fetchProducts();
    }, [selectedSubCategory, mainCategory]);
    // Add mainCategory as a dependency

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
        if (selectedProduct && selectedProduct.product_id === product.product_id) {
            setSelectedProduct(null);
        } else {
            setSelectedProduct(product);
        }
    };

    // handleAddSubCategory
    const handleAddSubCategory = async () => {
        if (!newSubCategoryName) {
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
                    const formData = new FormData();
                    formData.append('sub_category_name', newSubCategoryName);
                    formData.append('main_category', mainCategory.main_category_id);
                    if (subCategoryImage) {
                        formData.append('sub_category_image', subCategoryImage, 'subcategory_image.jpg');
                    }

                    const response = await axios.post('http://localhost:8000/api/sub-categories/', formData, {
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    if (response.status === 201) {
                        setNewSubCategoryName('');
                        setModalOpen(false);
                        setSubCategoryImage(null);
                        setSubCategoryImagePreview(null);
                        // Refetch subcategories
                        fetchSubCategories();
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
                if (error.response && error.response.status === 403) {
                    showError('You do not have permission to add subcategories.');
                } else {
                    showError('Error adding subcategory');
                }
            }
        }
    };

    const handleSubCategoryImageChange = (e) => {
        const image = e.target.files[0];
        if (!image) return; // Ensure an image is selected

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const width = img.width;
                const height = img.height;
                const aspectRatio = width / height;
                let newWidth, newHeight;
                // Resize logic based on aspect ratio
                if (aspectRatio > 1) {
                    newWidth = height;
                    newHeight = height;
                } else {
                    newWidth = width;
                    newHeight = width;
                }
                canvas.width = newWidth;
                canvas.height = newHeight;
                ctx.drawImage(img, (width - newWidth) / 2, (height - newHeight) / 2, newWidth, newHeight, 0, 0, newWidth, newHeight);
                // Convert canvas to blob
                canvas.toBlob((blob) => {
                    setSubCategoryImage(blob);
                    setSubCategoryImagePreview(URL.createObjectURL(blob));
                }, 'image/jpeg', 0.8);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(image);
    };

    const handleProductImageChange = (e) => {
        const image = e.target.files[0];
        if (!image) return; // Ensure an image is selected

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const width = img.width;
                const height = img.height;
                const aspectRatio = width / height;
                let newWidth, newHeight;
                // Resize logic based on aspect ratio
                if (aspectRatio > 1) {
                    newWidth = height;
                    newHeight = height;
                } else {
                    newWidth = width;
                    newHeight = width;
                }
                canvas.width = newWidth;
                canvas.height = newHeight;
                ctx.drawImage(img, (width - newWidth) / 2, (height - newHeight) / 2, newWidth, newHeight, 0, 0, newWidth, newHeight);

                // Compress the image
                canvas.toBlob((blob) => {
                    const compressedImage = new File([blob], image.name, {
                        type: blob.type,
                        lastModified: Date.now(),
                    });
                    setProductImage(compressedImage);
                }, 'image/jpeg', 0.5); // Compress the image to 50% quality
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(image);
    };

    // Add handleAddProduct function
    const handleAddProduct = async () => {
        try {
            if (!selectedSubCategory) {
                showError('Please select a subcategory before adding a product.');
                return;
            }

            if (!newProductName || !newProductType || !newProductSize || !newProductBrand || !newProductColor || !newProductQuantity || !newProductPrice || !newProductDescription) {
                showError('Please fill out all fields before adding a product.');
                return;
            }

            const data = new FormData();
            data.append('product_name', newProductName);
            data.append('product_type', newProductType);
            data.append('product_size', newProductSize);
            data.append('product_brand', newProductBrand);
            data.append('product_color', newProductColor);
            data.append('product_quantity', newProductQuantity);
            data.append('product_price', newProductPrice);
            data.append('product_description', newProductDescription);
            data.append('sub_category', selectedSubCategory.sub_category_id);

            if (productImage) {
                data.append('product_image', productImage, 'product-image.jpg');
            }

            const response = await fetch('http://localhost:8000/api/products/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
                body: data
            });

            if (response.ok) {
                // Handle successful product addition
                setModalOpenProduct(false);
                // Refetch products to include the newly added one
                const res = await fetch(`http://localhost:8000/api/products/?sub_category=${selectedSubCategory.sub_category_id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                const products = await res.json();
                const filteredProducts = products.filter(product => product.sub_category === selectedSubCategory.sub_category_id);
                setProducts(filteredProducts);
                // Show success alert
                Swal.fire({
                    icon: 'success',
                    title: 'Product Added!',
                    text: 'Product added successfully.',
                    position: 'top-end',
                    toast: true,
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });
                // Clear fields only if the product was added successfully
                setNewProductName('');
                setNewProductType('');
                setNewProductSize('');
                setNewProductBrand('');
                setNewProductColor('');
                setNewProductQuantity('');
                setNewProductPrice('');
                setNewProductDescription('');
                setProductImage(null);
                return true;
            } else {
                console.error('Failed to add product:', response.statusText);
                return false;
            }
        } catch (error) {
            console.error('Error adding product:', error);
            return false;
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const config = {
                    headers: {
                        'Authorization': `Token ${token}`,
                    }
                };
                const response = await axios.delete(`http://localhost:8000/api/products/${productId}/`, config);
                if (response.status === 204) {
                    // Refetch products to exclude the deleted one
                    const res = await fetch(`http://localhost:8000/api/products/?sub_category=${selectedSubCategory.sub_category_id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Token ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const products = await res.json();
                    const filteredProducts = products.filter(product => product.sub_category === selectedSubCategory.sub_category_id);
                    setProducts(filteredProducts);
                    // Unselect the deleted product
                    if (selectedProduct && selectedProduct.product_id === productId) {
                        setSelectedProduct(null);
                    }
                    // Show success alert
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Product deleted successfully.',
                        position: 'top-end',
                        toast: true,
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                    });
                } else {
                    showError('Error deleting product');
                }
            } else {
                showError('You are not authorized to delete products.');
            }
        } catch (error) {
            if (error.response.status === 403) {
                showError('You do not have permission to delete products.');
            } else {
                showError('Error deleting product');
            }
        }
    };

    const handleEditSubCategory = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const config = {
                    headers: {
                        'Authorization': `Token ${token}`,
                    }
                };
                const response = await axios.patch(`http://localhost:8000/api/sub-categories/${editingSubCategory.sub_category_id}/`, {
                    sub_category_name: newSubCategoryName,
                }, config);
                if (response.status === 200) {
                    // Refetch subcategories to include the updated one
                    const res = await fetch(`http://localhost:8000/api/sub-categories/?main_category=${mainCategory.main_category_id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Token ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const subCategories = await res.json();
                    setSubCategories(subCategories.filter(subCategory => subCategory.main_category === mainCategory.main_category_id));
                    // Unselect the subcategory
                    setSelectedSubCategory(null);
                    // Reset the newSubCategoryName state
                    setNewSubCategoryName('');
                    // Show success alert
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Subcategory updated successfully.',
                        position: 'top-end',
                        toast: true,
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                    });
                } else {
                    showError('Error updating subcategory');
                }
            } else {
                showError('You are not authorized to update subcategories.');
            }
        } catch (error) {
            if (error.response.status === 403) {
                showError('You do not have permission to update subcategories.');
            } else {
                showError('Error updating subcategory');
            }
        }
    };

    const handleDeleteSubCategory = async (subCategoryId) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const config = {
                    headers: {
                        'Authorization': `Token ${token}`,
                    }
                };
                const response = await axios.get(`http://localhost:8000/api/products/?sub_category=${subCategoryId}`, config);
                if (response.data.length > 0) {
                    showError('Cannot delete subcategory. It has associated products.');
                } else {
                    const deleteResponse = await axios.delete(`http://localhost:8000/api/sub-categories/${subCategoryId}/`, config);
                    if (deleteResponse.status === 204) {
                        // Refetch subcategories to exclude the deleted one
                        const res = await fetch(`http://localhost:8000/api/sub-categories/?main_category=${mainCategory.main_category_id}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Token ${localStorage.getItem('token')}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        const subCategories = await res.json();
                        setSubCategories(subCategories.filter(subCategory => subCategory.main_category === mainCategory.main_category_id));
                        // Unselect the deleted subcategory
                        if (selectedSubCategory && selectedSubCategory.sub_category_id === subCategoryId) {
                            setSelectedSubCategory(null);
                        }
                        // Show success alert
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'Subcategory deleted successfully.',
                            position: 'top-end',
                            toast: true,
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                        });
                    } else {
                        showError('Error deleting subcategory');
                    }
                }
            } else {
                showError('You are not authorized to delete subcategories.');
            }
        } catch (error) {
            if (error.response.status === 403) {
                showError('You do not have permission to delete subcategories.');
            } else {
                showError('Error deleting subcategory');
            }
        }
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
                                <FaTimes className="text-yellow-500 hover:text-yellow-300" size={32} title="Close Search Bar" />
                            ) : (
                                <FaSearch className="text-yellow-500 hover:text-yellow-300" size={30} title="Open Search Bar" />
                            )}
                        </div>

                        <FaPlusCircle
                            className="text-yellow-500 cursor-pointer hover:text-yellow-300"
                            size={30}
                            title="Add New Sub-Category"
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
                                    <div
                                        key={index}
                                        onClick={() => handleSubCategoryClick(category)}
                                        className={`rounded-full py-2 px-4 mb-1 hover:bg-yellow-500 hover:text-black cursor-pointer ${selectedSubCategory?.sub_category_id === category.sub_category_id ? 'bg-yellow-500 text-black' : 'bg-blue-700 text-white'}`}
                                    >
                                        {category.sub_category_name}
                                    </div>
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
                    {/* Search Input */}
                    <div className={`flex items-center transition-all duration-500 ease-in-out ${searchOpenProduct ? 'w-1/2 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                        <div className="flex items-center w-full px-2">
                            <input
                                type="text"
                                value={searchQueryProduct}
                                onChange={(e) => setSearchQueryProduct(e.target.value)}
                                className="p-1 rounded text-md text-black font-semibold w-full transition-width duration-500 ease-in-out"
                                placeholder="Search"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-x-2">
                        {/* Search Icon */}
                        <div className="flex items-center cursor-pointer" onClick={() => {
                            setSearchOpenProduct(!searchOpenProduct);
                            if (searchOpenProduct) {
                                setSearchQueryProduct('');
                            }
                        }}>
                            {searchOpenProduct ? (
                                <FaTimes className="text-yellow-500 hover:text-yellow-300" size={32} title="Close Search Bar" />
                            ) : (
                                <FaSearch className="text-yellow-500 hover:text-yellow-300" size={30} title="Open Search Bar" />
                            )}
                        </div>
                        {/* Add Product Icon */}
                        <FaPlusCircle
                            className="text-yellow-500 cursor-pointer hover:text-yellow-300"
                            size={30}
                            title="Add Product"
                            onClick={() => {
                                if (selectedSubCategory) {
                                    setModalOpenProduct(true);
                                } else {
                                    showError('Please select a subcategory before adding a product.'); // Use SweetAlert2 for this alert
                                }
                            }} // Open modal on click
                        />
                    </div>
                </div>

                {/* Scrollable Products Section */}
                <div className="flex-grow px-4 pb-2 bg-blue-900 rounded-br-lg rounded-bl-lg overflow-y-auto custom-scrollbar">
                    {products.length > 0 ? (
                        <ul>
                            {products
                                .filter(product => product.product_name.toLowerCase().includes(searchQueryProduct.toLowerCase()))
                                .sort((a, b) => a.product_name.localeCompare(b.product_name)) // Sort alphabetically
                                .map((product) => (
                                    <li
                                        key={product.product_id}
                                        className={`rounded-full py-2 px-4 mb-1 hover:bg-yellow-500 hover:text-black cursor-pointer ${selectedProduct?.product_id === product.product_id ? 'bg-yellow-500 text-black' : 'bg-blue-700 text-white'}`}
                                        onClick={(e) => {
                                            if (e.target.tagName !== 'svg' && e.target.tagName !== 'path') {
                                                handleProductClick(product);
                                            }
                                        }}
                                    >
                                        <span>{product.product_name}</span>
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
                <div className="text-2xl text-yellow-500 p-4 bg-blue-900 rounded-tl-lg rounded-tr-lg flex justify-between items-center">
                    <h2>Product Details</h2>
                    <div className="flex items-center justify-end gap-x-4">
                        <FaEdit
                            className={`text-yellow-500 cursor-pointer hover:text-yellow-300 ${selectedSubCategory ? '' : 'opacity-50 pointer-events-none'}`}
                            size={30}
                            title="Edit Subcategory"
                            onClick={() => {
                                if (selectedSubCategory) {
                                    setEditingSubCategory(selectedSubCategory);
                                    setNewSubCategoryName(selectedSubCategory.sub_category_name);
                                }
                            }}
                        />
                        <FaTrash
                            className={`text-red-500 cursor-pointer hover:text-red-700 ${selectedProduct || (selectedSubCategory && products.length === 0) ? '' : 'opacity-50 pointer-events-none'}`}
                            size={30}
                            title={selectedProduct ? 'Delete Product' : selectedSubCategory ? 'Delete Subcategory' : ''}
                            onClick={() => {
                                if (selectedProduct) {
                                    Swal.fire({
                                        title: 'Delete Product?',
                                        text: `Are you sure you want to delete ${selectedProduct.product_name}?`,
                                        icon: 'warning',
                                        showCancelButton: true,
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: '#d33',
                                        confirmButtonText: 'Yes, delete it!'
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            handleDeleteProduct(selectedProduct.product_id);
                                        }
                                    });
                                } else if (selectedSubCategory) {
                                    Swal.fire({
                                        title: 'Delete Subcategory?',
                                        text: `Are you sure you want to delete ${selectedSubCategory.sub_category_name}?`,
                                        icon: 'warning',
                                        showCancelButton: true,
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: '#d33',
                                        confirmButtonText: 'Yes, delete it!'
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            handleDeleteSubCategory(selectedSubCategory.sub_category_id);
                                        }
                                    });
                                }
                            }}
                        />
                        <FaDownload
                            className="text-yellow-500 cursor-pointer hover:text-yellow-300"
                            size={30}
                            title="Save to Spreadsheet"
                            onClick={async () => {
                                const token = localStorage.getItem('token');
                                if (token) {
                                    const config = {
                                        headers: {
                                            'Authorization': `Token ${token}`,
                                        }
                                    };
                                    const res = await axios.get('http://localhost:8000/api/products/', config);
                                    const products = res.data;

                                    const workbook = new ExcelJS.Workbook();
                                    const worksheet = workbook.addWorksheet('Product Details');

                                    worksheet.addRow(['Product ID', 'Product Name', 'Product Type', 'Product Size', 'Product Quantity', 'Product Color', 'Product Brand', 'Product Price', 'Product Description']);

                                    worksheet.columns = [
                                        { header: 'Product ID', key: 'product_id', width: 15 },
                                        { header: 'Product Name', key: 'product_name', width: 35 },
                                        { header: 'Product Type', key: 'product_type', width: 20 },
                                        { header: 'Product Size', key: 'product_size', width: 20 },
                                        { header: 'Product Quantity', key: 'product_quantity', width: 25 },
                                        { header: 'Product Color', key: 'product_color', width: 20 },
                                        { header: 'Product Brand', key: 'product_brand', width: 20 },
                                        { header: 'Product Price', key: 'product_price', width: 20 },
                                        { header: 'Product Description', key: 'product_description', width: 30 },
                                    ];

                                    worksheet.addRow(['', '', '', '', '', '', '', '', '']);

                                    if (products.length > 0) {
                                        products.forEach((product) => {
                                            worksheet.addRow([
                                                product.product_id,
                                                product.product_name,
                                                product.product_type,
                                                product.product_size,
                                                product.product_quantity,
                                                product.product_color,
                                                product.product_brand,
                                                product.product_price,
                                                product.product_description,
                                            ]);
                                        });
                                    }

                                    // Apply styles to the header and increase its height
                                    worksheet.getRow(1).height = 30;  // Set header row height to 25 (adjust as needed)
                                    worksheet.getRow(1).eachCell(cell => {
                                        cell.font = { bold: true };
                                        cell.alignment = { horizontal: 'center', vertical: 'middle' };
                                        cell.fill = {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: { argb: 'FFFFF0' },  // Light fill color
                                        };
                                    });

                                    // Apply styles to data rows
                                    worksheet.eachRow((row, rowNumber) => {
                                        row.eachCell((cell) => {
                                            cell.alignment = { horizontal: 'center', vertical: 'middle' };
                                            cell.border = {
                                                top: { style: 'thin' },
                                                left: { style: 'thin' },
                                                bottom: { style: 'thin' },
                                                right: { style: 'thin' },
                                            };
                                        });

                                        // Alternate row color
                                        if (rowNumber % 2 === 0) {
                                            row.eachCell((cell) => {
                                                cell.fill = {
                                                    type: 'pattern',
                                                    pattern: 'solid',
                                                    fgColor: { argb: 'FFEEEEEE' }, // Light grey for even rows
                                                };
                                            });
                                        }
                                    });

                                    workbook.xlsx.writeBuffer().then((buffer) => {
                                        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                                        saveAs(blob, 'products.xlsx');
                                    });
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Product Details */}
                <div className="flex-grow px-4 pb-2 bg-blue-900 rounded-br-lg rounded-bl-lg overflow-y-auto custom-scrollbar">
                    {selectedProduct ? (
                        <div className="flex flex-wrap">
                            {/* Left side: Image */}
                            <div className="w-full md:w-1/2 mb-4">
                                {selectedProduct.product_image && (
                                    <img
                                        src={`http://localhost:8000${selectedProduct.product_image}`}
                                        alt="Product_Image"
                                        className="border-2 border-black rounded w-64 h-64 object-cover mx-auto"
                                    />
                                )}
                            </div>

                            {/* Right side: Product Name, Type, and Size */}
                            <div className="w-full md:w-1/2 px-4 mb-4 flex flex-col justify-center">
                                <div className="flex flex-col gap-2 mb-4">
                                    <label className="text-white">Product Name:</label>
                                    <input
                                        type="text"
                                        value={selectedProduct.product_name}
                                        readOnly
                                        className="p-2 w-full rounded bg-gray-200 text-black"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 mb-4">
                                    <label className="text-white">Product Type:</label>
                                    <input
                                        type="text"
                                        value={selectedProduct.product_type}
                                        readOnly
                                        className="p-2 w-full rounded bg-gray-200 text-black"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 mb-4">
                                    <label className="text-white">Product Size:</label>
                                    <input
                                        type="text"
                                        value={selectedProduct.product_size}
                                        readOnly
                                        className="p-2 w-full rounded bg-gray-200 text-black"
                                    />
                                </div>
                            </div>

                            {/* Centered Columns for other fields */}
                            <div className="w-full flex flex-wrap justify-center">
                                <div className="w-full md:w-1/2 px-4 mb-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-white">Product Quantity:</label>
                                        <input
                                            type="text"
                                            value={selectedProduct.product_quantity}
                                            readOnly
                                            className="p-2 w-full rounded bg-gray-200 text-black"
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 px-4 mb-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-white">Product Color:</label>
                                        <input
                                            type="text"
                                            value={selectedProduct.product_color}
                                            readOnly
                                            className="p-2 w-full rounded bg-gray-200 text-black"
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 px-4 mb-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-white">Product Brand:</label>
                                        <input
                                            type="text"
                                            value={selectedProduct.product_brand}
                                            readOnly
                                            className="p-2 w-full rounded bg-gray-200 text-black"
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 px-4 mb-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-white">Product Price:</label>
                                        <input
                                            type="text"
                                            value={`₱${selectedProduct.product_price}`}
                                            readOnly
                                            className="p-2 w-full rounded bg-gray-200 text-black"
                                        />
                                    </div>
                                </div>
                                <div className="w-full px-4 mb-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-white">Product Description:</label>
                                        <textarea
                                            readOnly
                                            value={selectedProduct.product_description}
                                            className="p-2 w-full rounded bg-gray-200 text-black h-48 overflow-y-auto resize-none text-md font-semibold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-white text-center py-10">Select a product to see details</p>
                    )}
                </div>

            </div>

            {/* Modal for Adding Subcategory */}
            {modalOpen && (
                <div className="bg-black bg-opacity-50 fixed inset-0 flex justify-center items-center z-50">
                    <div className="bg-blue-800 p-6 rounded-lg shadow-lg text-black w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                        <h2 className="text-xl mb-4 text-yellow-500">Add Subcategory</h2>
                        <input
                            type="text"
                            value={newSubCategoryName}
                            onChange={(e) => setNewSubCategoryName(e.target.value)}
                            className="p-2 mb-4 w-full rounded"
                            placeholder="Enter subcategory name"
                        />
                        <input
                            type="file"
                            onChange={handleSubCategoryImageChange}
                            className="p-2 mb-4 w-full rounded"
                            accept="image/*"
                        />
                        {subCategoryImagePreview && (
                            <div className="mb-4">
                                <img
                                    src={subCategoryImagePreview}
                                    alt="Subcategory preview"
                                    className="w-full h-40 object-cover rounded"
                                />
                            </div>
                        )}
                        <div className="flex justify-end">
                            <button
                                className="bg-yellow-500 text-black rounded px-4 py-2 mr-2"
                                onClick={handleAddSubCategory}
                            >
                                Add
                            </button>
                            <button
                                className="bg-red-500 text-white rounded px-4 py-2"
                                onClick={() => {
                                    setModalOpen(false);
                                    setNewSubCategoryName('');
                                    setSubCategoryImage(null);
                                    setSubCategoryImagePreview(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {editingSubCategory && (
                <div className="bg-black bg-opacity-50 fixed inset-0 flex justify-center items-center z-50">
                    <div className="bg-blue-800 p-6 rounded-lg shadow-lg text-black w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                        <h2 className="text-xl mb-4 text-yellow-500">Edit Subcategory</h2>
                        <input
                            type="text"
                            value={newSubCategoryName}
                            onChange={(e) => setNewSubCategoryName(e.target.value)}
                            className="p-2 mb-4 w-full rounded"
                            placeholder="Enter new subcategory name"
                        />
                        <div className="flex justify-end">
                            <button
                                className="bg-yellow-500 text-black rounded px-4 py-2 mr-2"
                                onClick={async () => {
                                    await handleEditSubCategory();
                                    setEditingSubCategory(null);
                                }}
                            >
                                Save
                            </button>
                            <button
                                className="bg-red-500 text-white rounded px-4 py-2"
                                onClick={() => {
                                    setEditingSubCategory(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Adding Product */}
            {
                modalOpenProduct && (
                    <div className="bg-black bg-opacity-50 fixed inset-0 flex justify-center items-center z-50">
                        <div className="bg-blue-800 p-6 rounded-lg shadow-lg text-black w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
                            <h2 className="text-xl mb-4 text-yellow-500">Add Product</h2>
                            <div className="flex flex-wrap -mx-4">
                                <div className="w-full md:w-1/2 px-4 mb-4">
                                    <label className="block text-white mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        value={newProductName}
                                        onChange={(e) => setNewProductName(e.target.value)}
                                        className="p-2 w-full rounded"
                                        placeholder="Enter product name"
                                    />
                                </div>
                                <div className="w-full md:w-1/2 px-4 mb-4">
                                    <label className="block text-white mb-2">Product Type</label>
                                    <input
                                        type="text"
                                        value={newProductType}
                                        onChange={(e) => setNewProductType(e.target.value)}
                                        className="p-2 w-full rounded"
                                        placeholder="Enter product type"
                                    />
                                </div>
                                <div className="w-full md:w-1/2 px-4 mb-4">
                                    <label className="block text-white mb-2">Product Size</label>
                                    <input
                                        type="text"
                                        value={newProductSize}
                                        onChange={(e) => setNewProductSize(e.target.value)}
                                        className="p-2 w-full rounded"
                                        placeholder="Enter product size"
                                    />
                                </div>
                                <div className="w-full md:w-1/2 px-4 mb-4">
                                    <label className="block text-white mb-2">Product Brand</label>
                                    <input
                                        type="text"
                                        value={newProductBrand}
                                        onChange={(e) => setNewProductBrand(e.target.value)}
                                        className="p-2 w-full rounded"
                                        placeholder="Enter product brand"
                                    />
                                </div>
                                <div className="w-full md:w-1/2 px-4 mb-4">
                                    <label className="block text-white mb-2">Product Color</label>
                                    <input
                                        type="text"
                                        value={newProductColor}
                                        onChange={(e) => setNewProductColor(e.target.value)}
                                        className="p-2 w-full rounded"
                                        placeholder="Enter product color"
                                    />
                                </div>
                                <div className="w-full md:w-1/2 px-4 mb-4">
                                    <label className="block text-white mb-2">Product Quantity</label>
                                    <input
                                        type="number"
                                        value={newProductQuantity}
                                        onChange={(e) => setNewProductQuantity(e.target.value)}
                                        className="p-2 w-full rounded"
                                        placeholder="Enter product quantity"
                                    />
                                </div>
                                <div className="w-full md:w-1/2 px-4 mb-4">
                                    <label className="block text-white mb-2">Product Price</label>
                                    <input
                                        type="number"
                                        value={newProductPrice}
                                        onChange={(e) => setNewProductPrice(e.target.value)}
                                        className="p-2 w-full rounded"
                                        placeholder="Enter product price"
                                    />
                                </div>
                                <div className="w-full md:w-1/2 px-4 mb-4">
                                    <label className="block text-white mb-2">Product Description</label>
                                    <textarea
                                        type="text"
                                        value={newProductDescription}
                                        onChange={(e) => setNewProductDescription(e.target.value)}
                                        className="p-2 w-full rounded"
                                        placeholder="Enter product description"
                                    />
                                </div>
                                <div className="w-full md:w-1/2 px-4 mb-4">
                                    <label className="block text-white mb-2">Product Image</label>
                                    <input
                                        type="file"
                                        onChange={(e) => handleProductImageChange(e)}
                                        className="p-2 w-full rounded"
                                    />
                                </div>
                                {/* Display the image preview after selecting an image */}
                                {productImage && (
                                    <div className="w-full px-4 mb-4">
                                        <label className="block text-white mb-2">Image Preview</label>
                                        <img
                                            src={URL.createObjectURL(productImage)}
                                            alt="Selected product"
                                            className="rounded w-40 h-40 object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    className="bg-yellow-500 text-black rounded px-4 py-2 mr-2"
                                    onClick={async () => {
                                        const success = await handleAddProduct();
                                        if (success) {
                                            // Clear fields only if the product was added successfully
                                            setNewProductName('');
                                            setNewProductType('');
                                            setNewProductSize('');
                                            setNewProductBrand('');
                                            setNewProductColor('');
                                            setNewProductQuantity('');
                                            setNewProductPrice('');
                                            setNewProductDescription('');
                                            setProductImage(null);
                                        }
                                    }}
                                >
                                    Add
                                </button>
                                <button
                                    className="bg-red-500 text-white rounded px-4 py-2"
                                    onClick={() => {
                                        setModalOpenProduct(false);
                                        // Reset fields when cancelling
                                        setNewProductName('');
                                        setNewProductType('');
                                        setNewProductSize('');
                                        setNewProductBrand('');
                                        setNewProductColor('');
                                        setNewProductQuantity('');
                                        setNewProductPrice('');
                                        setNewProductDescription('');
                                        setProductImage(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    );
};

export default Products;