import React, { useState, useEffect } from 'react';
import Loader from './Loader'; // Import the Loader component

// Sample data for both categories
const inventoryData = {
    autoSupply: [
        { id: 1, itemNo: 'A001', name: 'Brake Pads', variation: 'Standard', price: 25.0, totalStock: 150, inStock: 120, brand: 'AutoBrand', sold: 30 },
        { id: 2, itemNo: 'A002', name: 'Oil Filter', variation: 'Premium', price: 10.5, totalStock: 200, inStock: 180, brand: 'OilPro', sold: 20 },
        { id: 3, itemNo: 'A003', name: 'Air Filter', variation: 'Standard', price: 8.5, totalStock: 300, inStock: 280, brand: 'FilterMaster', sold: 20 },
        { id: 4, itemNo: 'A003', name: 'Air Filter', variation: 'Standard', price: 8.5, totalStock: 300, inStock: 280, brand: 'FilterMaster', sold: 20 },
        { id: 5, itemNo: 'A003', name: 'Air Filter', variation: 'Standard', price: 8.5, totalStock: 300, inStock: 280, brand: 'FilterMaster', sold: 20 },
        { id: 6, itemNo: 'A003', name: 'Air Filter', variation: 'Standard', price: 8.5, totalStock: 300, inStock: 280, brand: 'FilterMaster', sold: 20 },
        { id: 7, itemNo: 'A003', name: 'Air Filter', variation: 'Standard', price: 8.5, totalStock: 300, inStock: 280, brand: 'FilterMaster', sold: 20 },
        { id: 8, itemNo: 'A003', name: 'Air Filter', variation: 'Standard', price: 8.5, totalStock: 300, inStock: 280, brand: 'FilterMaster', sold: 20 },
        { id: 9, itemNo: 'A003', name: 'Air Filter', variation: 'Standard', price: 8.5, totalStock: 300, inStock: 280, brand: 'FilterMaster', sold: 20 },
        { id: 10, itemNo: 'A003', name: 'Air Filter', variation: 'Standard', price: 8.5, totalStock: 300, inStock: 280, brand: 'FilterMaster', sold: 20 },
        { id: 11, itemNo: 'A003', name: 'Air Filter', variation: 'Standard', price: 8.5, totalStock: 300, inStock: 280, brand: 'FilterMaster', sold: 20 },
        { id: 12, itemNo: 'A003', name: 'Air Filter', variation: 'Standard', price: 8.5, totalStock: 300, inStock: 280, brand: 'FilterMaster', sold: 20 },
        { id: 13, itemNo: 'A003', name: 'Air Filter', variation: 'Standard', price: 8.5, totalStock: 300, inStock: 280, brand: 'FilterMaster', sold: 20 },
        { id: 14, itemNo: 'A003', name: 'Air Filter', variation: 'Standard', price: 8.5, totalStock: 300, inStock: 280, brand: 'FilterMaster', sold: 20 },
        { id: 15, itemNo: 'A003', name: 'Air Filter', variation: 'Standard', price: 8.5, totalStock: 300, inStock: 280, brand: 'FilterMaster', sold: 20 },
        { id: 16, itemNo: 'A003', name: 'Air Filter', variation: 'Standard', price: 8.5, totalStock: 300, inStock: 280, brand: 'FilterMaster', sold: 20 },
    ],
    bolts: [
        { id: 100, itemNo: 'B001', name: 'Hex Bolt', variation: 'M8', price: 0.15, totalStock: 5000, inStock: 4700, brand: 'BoltMax', sold: 300 },
        { id: 101, itemNo: 'B002', name: 'Anchor Bolt', variation: '10mm', price: 1.2, totalStock: 1000, inStock: 950, brand: 'AnchorPro', sold: 50 },
        { id: 102, itemNo: 'B003', name: 'U-Bolt', variation: '8mm', price: 1.0, totalStock: 1500, inStock: 1400, brand: 'SecureFix', sold: 100 },
        { id: 104, itemNo: 'B016', name: 'Carriage Bolt', variation: 'M10', price: 0.95, totalStock: 800, inStock: 750, brand: 'HeavyDuty', sold: 50 },
    ],
};

const Inventory = () => {
    const [selectedCategory, setSelectedCategory] = useState('autoSupply');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // State for loading
    const rowsPerPage = 14;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading to true
            // Simulate fetching data with a timeout
            await new Promise(resolve => setTimeout(resolve, 2000));
            setLoading(false); // Set loading to false after fetching
        };

        fetchData();
    }, [selectedCategory]); // Fetch data when the selected category changes

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Reset to first page when changing category
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        const totalPages = Math.ceil(inventoryData[selectedCategory].length / rowsPerPage);
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const getVisibleData = () => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return inventoryData[selectedCategory].slice(startIndex, endIndex);
    };

    const visibleData = getVisibleData();

    if (loading) {
        return <Loader />; // Show loader while loading
    }

    return (
        <div className="p-4">
            {/* Category Tabs */}
            <div className="flex font-bold text-2xl">
                <button
                    className={`flex-1 py-2 px-4 rounded-tl-lg ${selectedCategory === 'autoSupply' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-800 transition-colors duration-200 focus:outline-none`}
                    onClick={() => handleCategoryChange('autoSupply')}
                >
                    Auto Supply
                </button>
                <button
                    className={`flex-1 py-2 px-4 rounded-tr-lg ${selectedCategory === 'bolts' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-800 transition-colors duration-200 focus:outline-none`}
                    onClick={() => handleCategoryChange('bolts')}
                >
                    Bolts
                </button>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-[#033372] text-white border border-[#033372]">
                    <thead>
                        <tr>
                            {['Item No.', 'Product Name', 'Variation', 'Unit Price', 'Total Stock', 'In Stock', 'Brand', 'Sold'].map((header) => (
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
                            visibleData.map((item, index) => (
                                <tr
                                    key={`${selectedCategory}-${item.id}`} // Unique key using category and item id
                                    className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-[#9ACBFF80]' : 'bg-[#033372]'}`}
                                >
                                    <td className="py-2 px-4 border-b border-[#033372]">{item.itemNo}</td>
                                    <td className="py-2 px-4 border-b border-[#033372]">{item.name}</td>
                                    <td className="py-2 px-4 border-b border-[#033372]">{item.variation}</td>
                                    <td className="py-2 px-4 border-b border-[#033372]">${item.price.toFixed(2)}</td>
                                    <td className="py-2 px-4 border-b border-[#033372]">{item.totalStock}</td>
                                    <td className="py-2 px-4 border-b border-[#033372]">{item.inStock}</td>
                                    <td className="py-2 px-4 border-b border-[#033372]">{item.brand}</td>
                                    <td className="py-2 px-4 border-b border-[#033372]">{item.sold}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4 text-white">
                                    No data available for this category.
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
                    disabled={currentPage >= Math.ceil(inventoryData[selectedCategory].length / rowsPerPage)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Inventory;
