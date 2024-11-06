import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faFileExport, faCircle, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FaSortAlphaUp, FaSortAlphaDown, FaSortAmountDownAlt, FaSortAmountUp, FaBoxes, FaBox, FaEdit, FaTrash, FaBoxOpen, FaUpload } from 'react-icons/fa';
import Swal from 'sweetalert2'; // Import SweetAlert2
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import axios from 'axios';

const Inventory = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 9;
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [mainCategories, setMainCategories] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({
        category: 'All',
        sort: 'Alphabetical Asc',
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null); // Keep track of selected row
    const [formData, setFormData] = useState({}); // Handle product form data
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Control modal open state
    const [productImage, setProductImage] = useState(null); // Handle product image
    const [productImagePreview, setProductImagePreview] = useState(null); // Image preview
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
    const [stockToAdd, setStockToAdd] = useState(0);

    const fetchProductsRef = useRef(null);
    const filterDropdownRef = useRef(null);

    useEffect(() => {
        fetchProductsRef.current = async () => {
            const token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            try {
                const params = {
                    category: selectedFilters.category !== 'All' ? selectedFilters.category : undefined,
                    include_subcategory: true,
                };
                const response = await axios.get('http://localhost:8000/api/products/', { params });
                console.log("Fetched products:", response.data);
                setProducts(response.data);
            } catch (error) {
                console.error(error);
            }
        };
    }, [selectedFilters.category]);

    useEffect(() => {
        const fetchMainCategories = async () => {
            const token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            try {
                const response = await axios.get('http://localhost:8000/api/main-categories/');
                console.log("Fetched main categories:", response.data);
                setMainCategories(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMainCategories();
        fetchProductsRef.current();
    }, [selectedFilters.category]);

    // Polling to fetch products every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => fetchProductsRef.current(), 15000);
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const totalPages = Math.ceil(products.length / rowsPerPage);

    const getVisibleData = () => {
        let filteredData = products.filter((item) => {
            const matchesSearch =
                item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.product_brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.sub_category && item.sub_category.sub_category_name &&
                    item.sub_category.sub_category_name.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesSearch;
        });

        // Sort the data
        if (selectedFilters.sort === 'Alphabetical Asc') {
            filteredData.sort((a, b) => a.product_name.localeCompare(b.product_name));
        } else if (selectedFilters.sort === 'Alphabetical Desc') {
            filteredData.sort((a, b) => b.product_name.localeCompare(a.product_name));
        } else if (selectedFilters.sort === 'Sold High to Low') {
            filteredData.sort((a, b) => b.product_sold - a.product_sold);
        } else if (selectedFilters.sort === 'Sold Low to High') {
            filteredData.sort((a, b) => a.product_sold - b.product_sold);
        } else if (selectedFilters.sort === 'In Stock High to Low') {
            filteredData.sort((a, b) => b.product_quantity - a.product_quantity);
        } else if (selectedFilters.sort === 'In Stock Low to High') {
            filteredData.sort((a, b) => a.product_quantity - b.product_quantity);
        }

        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredData.slice(startIndex, startIndex + rowsPerPage);
    };

    const handleModalClose = () => {
        setIsEditModalOpen(false);
        setFormData(selectedRow); // Reset form data to the original selected row
        setProductImage(null); // Reset the image
        setProductImagePreview(null); // Reset the image preview
    };

    const handleRowClick = (product) => {
        if (product.product_id !== selectedProductId) {
            setSelectedRow(product); // Set the selected product
            setFormData({ ...product }); // Populate the form with product data
            setProductImage(null); // Reset the image
            setProductImagePreview(null); // Reset the image preview
            setSelectedProductId(product.product_id);
        } else {
            setSelectedRow(null); // Unselect the product
            setSelectedProductId(null);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleFilterToggle = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleFilterChange = (e) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleProductImageChange = (e) => {
        const image = e.target.files[0];
        if (!image) return;

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

                canvas.toBlob((blob) => {
                    const compressedImage = new File([blob], image.name, {
                        type: blob.type,
                        lastModified: Date.now(),
                    });
                    setProductImage(compressedImage);
                    setProductImagePreview(URL.createObjectURL(blob)); // Set image preview
                }, 'image/jpeg', 0.5);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(image);
    };

    const handleEditButtonClick = () => {
        if (selectedRow) {
            setIsEditModalOpen(true);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const config = {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                };

                const updatedProduct = { ...formData }; // Collect form data

                const formDataToSend = new FormData();
                formDataToSend.append('product_name', updatedProduct.product_name);
                formDataToSend.append('product_type', updatedProduct.product_type);
                formDataToSend.append('product_size', updatedProduct.product_size);
                formDataToSend.append('product_brand', updatedProduct.product_brand);
                formDataToSend.append('product_color', updatedProduct.product_color);
                formDataToSend.append('product_price', updatedProduct.product_price);
                formDataToSend.append('product_description', updatedProduct.product_description);

                if (productImage) {
                    // If a new image is provided, append it to the form data
                    formDataToSend.append('product_image', productImage); // Add the new image
                }

                const response = await axios.patch(`http://localhost:8000/api/products/${updatedProduct.product_id}/`, formDataToSend, config);

                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Product Updated!',
                        text: 'Product details have been successfully updated.',
                        position: 'top-end',
                        toast: true,
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                    });
                    setIsEditModalOpen(false); // Close modal on success
                    // Refetch products after update
                    const res = await axios.get('http://localhost:8000/api/products/', config);
                    setProducts(res.data);
                } else {
                    Swal.fire('Error', 'Failed to update product.', 'error');
                }
            }
        } catch (error) {
            console.error('Error updating product:', error);
            Swal.fire('Error', 'Error updating product.', 'error');
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
                    // Refetch products to remove the deleted one
                    const res = await axios.get('http://localhost:8000/api/products/', config);
                    setProducts(res.data);
                    setSelectedRow(null); // Unselect the product after deletion
                    Swal.fire({
                        icon: 'success',
                        title: 'Product Deleted!',
                        text: 'Product has been successfully deleted.',
                        position: 'top-end',
                        toast: true,
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                    });
                } else {
                    Swal.fire('Error', 'Failed to delete product.', 'error');
                }
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            Swal.fire('Error', 'Error deleting product.', 'error');
        }
    };


    const visibleData = getVisibleData();

    const sortOptions = [
        { value: "Alphabetical Asc", label: "Alphabetical Asc", icon: <FaSortAlphaUp /> },
        { value: "Alphabetical Desc", label: "Alphabetical Desc", icon: <FaSortAlphaDown /> },
        { value: "Sold High to Low", label: "Sold High to Low", icon: <FaSortAmountDownAlt /> },
        { value: "Sold Low to High", label: "Sold Low to High", icon: <FaSortAmountUp /> },
        { value: "In Stock High to Low", label: "In Stock High to Low", icon: <FaBoxes /> },
        { value: "In Stock Low to High", label: "In Stock Low to High", icon: <FaBox /> }
    ];

    const FilterItem = ({ id, name, value, checked, handleFilterChange }) => (
        <div className="mr-4 mb-2">
            <input
                type="radio"
                id={id}
                name={name}
                value={value}
                checked={checked}
                onChange={handleFilterChange}
            />
            <label className="ml-2" htmlFor={id}>{value}</label>
        </div>
    );

    const SortItem = ({ id, name, value, checked, label, icon, handleFilterChange }) => (
        <div className="mr-4 mb-2 flex items-center">
            <input
                type="radio"
                id={id}
                name={name}
                value={value}
                checked={checked}
                onChange={handleFilterChange}
            />
            <label className="ml-2 flex items-center" htmlFor={id}>
                <span className="mr-1">{icon}</span> {label}
            </label>
        </div>
    );

    const formatPrice = (price) => {
        return Math.round(price).toLocaleString();
    };

    const handleAddStock = async () => {
        const token = localStorage.getItem('token');
        if (token && selectedRow) {
            try {
                const newQuantity = selectedRow.product_quantity + parseInt(stockToAdd, 10); // Update quantity

                const config = {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                };

                const response = await axios.patch(`http://localhost:8000/api/products/${selectedRow.product_id}/`, { product_quantity: newQuantity }, config);

                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: `Stock added successfully!`,
                        text: `New quantity for ${selectedRow.product_name} is ${newQuantity}.`,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                    });
                    setIsAddStockModalOpen(false);  // Close modal after success
                    fetchProductsRef.current();  // Refresh product list
                }
            } catch (error) {
                console.error('Error adding stock:', error);
                Swal.fire('Error', 'Error updating stock.', 'error');
            }
        }
    };

    return (
        <div className="p-4">
            {/* Search and Action Buttons */}
            <div className="flex flex-col mb-4">

                {/* Search Box */}
                <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="absolute left-3 top-3 text-gray-400"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by product name, sub-category, brand..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
                            style={{ width: '450px' }}
                        />
                    </div>

                    {/* Filter, Edit, and Delete Buttons */}
                    <div className="flex space-x-4">
                        <div className="relative">
                            <button
                                className={`flex items-center px-4 py-2 border border-gray-300 rounded-md text-white shadow transition-colors duration-200 ${isFilterOpen ? 'bg-[#024b8c]' : 'bg-[#022a5e] hover:bg-[#024b8c]'}`}
                                onClick={handleFilterToggle}
                            >
                                <FontAwesomeIcon icon={faFilter} className="mr-2" />
                                Filter
                            </button>
                            {isFilterOpen && (
                                <div ref={filterDropdownRef} className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-72 filter-dropdown">
                                    <div className="p-4">
                                        <h4 className="text-lg font-bold mb-2">Category:</h4>
                                        <div className="flex flex-col">
                                            <FilterItem
                                                id="All"
                                                name="category"
                                                value="All"
                                                checked={selectedFilters.category === "All"}
                                                handleFilterChange={handleFilterChange}
                                            />
                                            {mainCategories.map(category => (
                                                <FilterItem
                                                    key={category.main_category_id}
                                                    id={category.main_category_name}
                                                    name="category"
                                                    value={category.main_category_name}
                                                    checked={selectedFilters.category === category.main_category_name}
                                                    handleFilterChange={handleFilterChange}
                                                />
                                            ))}
                                        </div>

                                        <h4 className="text-lg font-bold mt-4 mb-2">Sort:</h4>
                                        <div className="flex flex-wrap">
                                            {sortOptions.map(option => (
                                                <SortItem
                                                    key={option.value}
                                                    id={option.value}
                                                    name="sort"
                                                    value={option.value}
                                                    checked={selectedFilters.sort === option.value}
                                                    label={option.label}
                                                    icon={option.icon}
                                                    handleFilterChange={handleFilterChange}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setIsAddStockModalOpen(true)}  // Open the modal on click
                            disabled={!selectedRow}  // Disable if no row is selected
                            className={`px-4 py-2 flex items-center ${selectedRow ? 'bg-green-500 hover:bg-green-600 text-white shadow' : 'bg-gray-200 text-gray-500 cursor-not-allowed'} border border-gray-300 rounded-md`}
                        >
                            <FaBoxOpen className="mr-2" />  {/* Icon for stock */}
                            Add Stock
                        </button>

                        {isAddStockModalOpen && selectedRow && (
                            <div className="bg-black bg-opacity-50 backdrop-blur-sm fixed inset-0 flex justify-center items-center z-50">
                                <div className="bg-blue-800 p-6 rounded-lg shadow-lg text-black w-full md:w-1/4">
                                    <h2 className="text-2xl font-bold text-yellow-500 mb-4">
                                        Add stock for {selectedRow.product_name}
                                    </h2>
                                    <input
                                        type="number"
                                        value={stockToAdd}
                                        onChange={(e) => setStockToAdd(e.target.value)}
                                        className="p-2 mb-4 w-full border border-gray-300 rounded"
                                        placeholder="Enter stock quantity to add"
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            className="bg-green-500 text-white rounded px-4 py-2 mr-2"
                                            onClick={() => {
                                                // Check if the stockToAdd field is empty or invalid
                                                if (!stockToAdd || stockToAdd <= 0) {
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Oops...',
                                                        text: 'Please enter a valid stock quantity!',
                                                        position: 'top-end', // Set position to top-end
                                                        timer: 2000,
                                                        showConfirmButton: false,
                                                        timerProgressBar: true,
                                                    });
                                                    return;
                                                }

                                                // Add stock function
                                                handleAddStock();

                                                // Reset state
                                                setStockToAdd('');

                                                // Fully unselect the row
                                                setSelectedRow(null);

                                                // Close the modal after success
                                                setIsAddStockModalOpen(false);

                                                // Success notification at top-end
                                                Swal.fire({
                                                    icon: 'success',
                                                    title: 'Stock added!',
                                                    text: 'The stock was successfully added.',
                                                    position: 'top-end', // Set position to top-end
                                                    timer: 2000,
                                                    showConfirmButton: false,
                                                    timerProgressBar: true,
                                                });
                                            }}
                                        >
                                            Add Stock
                                        </button>
                                        <button
                                            className="bg-red-500 text-white rounded px-4 py-2"
                                            onClick={() => {
                                                // Close the modal
                                                setIsAddStockModalOpen(false);

                                                // Reset state
                                                setStockToAdd('');

                                                // FULLY UNSELECT the row
                                                setSelectedRow(null);

                                                // OPTIONAL: Delay to allow reselecting the same row
                                                setTimeout(() => {
                                                    setSelectedRow(null); // Forcefully ensure row is fully unselected
                                                }, 0);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Edit and Delete Buttons */}
                        <button
                            onClick={handleEditButtonClick}
                            disabled={!selectedRow}
                            className={`px-4 py-2 flex items-center ${selectedRow ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow' : 'bg-gray-200 text-gray-500 cursor-not-allowed'} border border-gray-300 rounded-md`}
                        >
                            <FaEdit className="mr-2" /> {/* Add margin to the right of the icon */}
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                Swal.fire({
                                    title: 'Delete Product?',
                                    text: `Are you sure you want to delete ${selectedRow?.product_name}?`,
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Yes, delete it!',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        handleDeleteProduct(selectedRow?.product_id);
                                    }
                                });
                            }}
                            disabled={!selectedRow}
                            className={`px-4 py-2 flex items-center ${selectedRow ? 'bg-red-500 hover:bg-red-600 text-white shadow' : 'bg-gray-200 text-gray-500 cursor-not-allowed'} border border-gray-300 rounded-md`}
                        >
                            <FaTrash className="mr-2" />
                            Delete
                        </button>

                        <button
                            className="flex items-center px-4 py-2 bg-[#022a5e] border border-gray-300 text-white shadow hover:bg-[#024b8c] rounded-md"
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
                                        saveAs(blob, 'inventory_products.xlsx');
                                    });
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faFileExport} className="mr-2" />
                            Export Data
                        </button>
                    </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                        <button onClick={handlePrevious} disabled={currentPage === 1} className="px-4 py-2 shadow bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300">
                            <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
                            Previous
                        </button>
                        <button onClick={handleNext} disabled={currentPage === totalPages} className="px-4 py-2 shadow bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300">
                            Next
                            <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
                        </button>
                    </div>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                </div>
            </div>


            {/* Inventory Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-black border border-gray-300">
                    <thead style={{ height: '50px' }}>
                        <tr className="bg-[#022a5e] text-white">
                            <th className="py-2 px-4 border-b border-gray-300 text-left" style={{ width: '400px' }}>
                                Product Name
                            </th>
                            <th className="py-2 px-4 border-b border-gray-300 text-left" style={{ width: '220px' }}>
                                Sub-Category
                            </th>
                            <th className="py-2 px-4 border-b border-gray-300 text-left" style={{ width: '250px' }}>
                                Brand
                            </th>
                            <th className="py-2 px-4 border-b border-gray-300 text-left" style={{ width: '150px' }}>
                                Type
                            </th>
                            <th className="py-2 px-4 border-b border-gray-300 text-left" style={{ width: '150px' }}>
                                Unit Price
                            </th>
                            <th className="py-2 px-4 border-b border-gray-300 text-left" style={{ width: '125px' }}>
                                In-Stock
                            </th>
                            <th className="py-2 px-4 border-b border-gray-300 text-left" style={{ width: '160px' }}>
                                Status
                            </th>
                            <th className="py-2 px-4 border-b border-gray-300 text-left" style={{ width: '100px' }}>
                                Sold
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleData.map((item) => (
                            <tr
                                key={item.product_id}
                                className={`${selectedRow?.product_id === item.product_id ? 'bg-gray-300' : ''
                                    } hover:bg-gray-200 h-16 transition-colors duration-200 cursor-pointer`} // Add cursor-pointer class
                                onClick={() => handleRowClick(item)} // Select row
                            >
                                <td className="py-2 px-4 border-b border-gray-300">{item.product_name}</td>
                                <td className="py-2 px-4 border-b border-gray-300">
                                    {item.sub_category ? item.sub_category.sub_category_name : 'N/A'}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-300">{item.product_brand}</td>
                                <td className="py-2 px-4 border-b border-gray-300">{item.product_type}</td>
                                <td className="py-2 px-4 border-b border-gray-300">
                                    ₱{formatPrice(item.product_price)}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-300">{item.product_quantity}</td>
                                <td className="py-2 px-4 border-b border-gray-300">
                                    {item.product_quantity > 0 ? (
                                        <span className="flex items-center text-green-500">
                                            <FontAwesomeIcon icon={faCircle} className="mr-2" />
                                            Available
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-red-500">
                                            <FontAwesomeIcon icon={faCircle} className="mr-2" />
                                            Out of Stock
                                        </span>
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-300">{item.product_sold}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {/* Edit Product Modal */}
            {isEditModalOpen && selectedRow && (
                <div className="bg-black bg-opacity-50 backdrop-blur-sm fixed inset-0 flex justify-center items-center z-50">
                    <div className="bg-blue-800 p-6 rounded-lg shadow-lg text-black w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
                        <h2 className="text-2xl mb-4 font-bold text-yellow-500">Edit Product</h2>
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Image upload section */}
                            <div className="flex-shrink-0 mb-4 md:mb-0 w-full md:w-1/3">
                                <div className="flex flex-col mb-4">
                                    <label className="block text-white mb-2">New Product Image</label>
                                    <input
                                        type="file"
                                        onChange={handleProductImageChange}
                                        className="hidden" // Hide the default input
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload" // Associate label with the input
                                        className="flex items-center justify-center cursor-pointer p-4 border-2 border-dashed border-gray-300 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition duration-200"
                                    >
                                        <span className="mr-2">Choose a file</span>
                                        <FaUpload /> {/* Add an upload icon */}
                                    </label>

                                    {productImagePreview && (
                                        <div className="mt-4">
                                            <img
                                                src={productImagePreview}
                                                alt="Product preview"
                                                className="w-full h-auto object-cover border-2 border-black rounded shadow-lg"
                                            />
                                        </div>
                                    )}
                                </div>

                            </div>

                            {/* Data Fields Section */}
                            <div className="flex-grow flex flex-col justify-between md:w-2/3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col mb-4">
                                        <label className="text-white">Product Name:</label>
                                        <input
                                            type="text"
                                            name="product_name"
                                            value={formData.product_name || ''}
                                            onChange={handleInputChange}
                                            className="p-2 rounded bg-gray-200 text-black"
                                            placeholder="Enter product name"
                                        />
                                    </div>

                                    <div className="flex flex-col mb-4">
                                        <label className="text-white">Product Type:</label>
                                        <input
                                            type="text"
                                            name="product_type"
                                            value={formData.product_type || ''}
                                            onChange={handleInputChange}
                                            className="p-2 rounded bg-gray-200 text-black"
                                            placeholder="Enter product type"
                                        />
                                    </div>

                                    <div className="flex flex-col mb-4">
                                        <label className="text-white">Product Size:</label>
                                        <input
                                            type="text"
                                            name="product_size"
                                            value={formData.product_size || ''}
                                            onChange={handleInputChange}
                                            className="p-2 rounded bg-gray-200 text-black"
                                            placeholder="Enter product size"
                                        />
                                    </div>

                                    <div className="flex flex-col mb-4">
                                        <label className="text-white">Product Quantity:</label>
                                        <input
                                            type="text"
                                            name="product_quantity"
                                            value={formData.product_quantity || ''}
                                            onChange={handleInputChange}
                                            className="p-2 rounded bg-gray-200 text-black"
                                            placeholder="Enter product quantity"
                                            readOnly
                                        />
                                    </div>

                                    <div className="flex flex-col mb-4">
                                        <label className="text-white">Product Color:</label>
                                        <input
                                            type="text"
                                            name="product_color"
                                            value={formData.product_color || ''}
                                            onChange={handleInputChange}
                                            className="p-2 rounded bg-gray-200 text-black"
                                            placeholder="Enter product color"
                                        />
                                    </div>

                                    <div className="flex flex-col mb-4">
                                        <label className="text-white">Product Brand:</label>
                                        <input
                                            type="text"
                                            name="product_brand"
                                            value={formData.product_brand || ''}
                                            onChange={handleInputChange}
                                            className="p-2 rounded bg-gray-200 text-black"
                                            placeholder="Enter product brand"
                                        />
                                    </div>

                                    <div className="flex flex-col mb-4">
                                        <label className="text-white">Product Price:</label>
                                        <input
                                            type="number"
                                            name="product_price"
                                            value={formData.product_price || ''}
                                            onChange={handleInputChange}
                                            className="p-2 rounded bg-gray-200 text-black"
                                            placeholder="Enter product price"
                                        />
                                    </div>

                                    <div className="flex flex-col mb-4">
                                        <label className="text-white">Product Description:</label>
                                        <textarea
                                            name="product_description"
                                            value={formData.product_description || ''}
                                            onChange={handleInputChange}
                                            className="p-2 rounded bg-gray-200 text-black h-24 overflow-y-auto resize-none"
                                            placeholder="Enter product description"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-yellow-500 text-black rounded px-4 py-2 mr-2"
                                onClick={handleEditProduct}
                            >
                                Save
                            </button>
                            <button
                                className="bg-red-500 text-white rounded px-4 py-2"
                                onClick={handleModalClose}
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

export default Inventory;
