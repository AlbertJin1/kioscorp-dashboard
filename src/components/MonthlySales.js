import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { FaChartBar } from 'react-icons/fa';
import Loader from './Loader';
import Swal from 'sweetalert2'; // Import SweetAlert2
import ProductModal from './ProductModal'; // Import the modal component
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register the required elements
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const MonthlySales = () => {
    const [salesData, setSalesData] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonthRange, setSelectedMonthRange] = useState([1, new Date().getMonth() + 1]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/sales/monthly/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                    params: {
                        year: selectedYear,
                        month_start: selectedMonthRange[0],
                        month_end: selectedMonthRange[1],
                    },
                });
                setSalesData(response.data);
            } catch (error) {
                console.error('Error fetching sales data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSalesData();
    }, [selectedYear, selectedMonthRange]); // Fetch data when year or month range changes

    // Prepare data for the chart
    const monthsToShow = Array.from({ length: selectedMonthRange[1] - selectedMonthRange[0] + 1 }, (_, i) => selectedMonthRange[0] + i);
    const salesValues = monthsToShow.map(month => salesData[month] || 0);

    const data = {
        labels: monthsToShow.map(month => new Date(selectedYear, month - 1).toLocaleString('default', { month: 'long' })),
        datasets: [
            {
                label: 'Monthly Sales',
                data: salesValues,
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.1,
            },
        ],
    };

    // Generate year options (e.g., from 2020 to the current year)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => currentYear - i);

    // Handle month range change
    const handleMonthRangeChange = (startMonth, endMonth) => {
        if (startMonth > endMonth) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Month Range',
                text: 'Start month cannot be greater than end month.',
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
            });
        } else {
            setSelectedMonthRange([startMonth, endMonth]);
        }
    };

    // Handle month click to fetch product data
    const handleMonthClick = async (month) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/api/sales/products/?year=${selectedYear}&month=${month}`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            setProducts(response.data);
            setModalIsOpen(true);
        } catch (error) {
            console.error('Error fetching product data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Could not fetch product data.',
            });
        }
    };

    return (
        <div className="bg-white shadow-md p-4 rounded-lg flex-grow flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold flex items-center">
                    <FaChartBar className="mr-2 text-blue-500 text-3xl" />
                    Monthly Sales Overview
                </h2>
                <div className="flex items-center">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="border rounded-md p-1 mr-2"
                    >
                        {yearOptions.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <select
                        value={selectedMonthRange[0]}
                        onChange={(e) => handleMonthRangeChange(Number(e.target.value), selectedMonthRange[1])}
                        className="border rounded-md p-1 mr-2"
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month}>{new Date(selectedYear, month - 1).toLocaleString('default', { month: 'long' })}</option>
                        ))}
                    </select>
                    <select
                        value={selectedMonthRange[1]}
                        onChange={(e) => handleMonthRangeChange(selectedMonthRange[0], Number(e.target.value))}
                        className="border rounded-md p-1"
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month}>{new Date(selectedYear, month - 1).toLocaleString('default', { month: 'long' })}</option>
                        ))}
                    </select>
                </div>
            </div>
            {loading ? (
                <Loader />
            ) : (
                <div className="w-full flex-grow h-72">
                    <Line
                        data={data}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            onClick: (event, elements) => {
                                if (elements.length > 0) {
                                    const monthIndex = elements[0].index;
                                    handleMonthClick(monthsToShow[monthIndex]);
                                }
                            }
                        }}
                    />
                </div>
            )}
            <ProductModal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                products={products}
            />
        </div>
    );
};

export default MonthlySales;