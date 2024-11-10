import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2'; // Import Line instead of Bar
import axios from 'axios';
import { FaChartBar } from 'react-icons/fa';
import Loader from './Loader'; // Import the Loader component
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

    useEffect(() => {
        const fetchSalesData = async () => {
            // Simulate a loading delay of 1.5 seconds
            setTimeout(async () => {
                try {
                    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
                    const response = await axios.get('http://localhost:8000/api/sales/monthly/', {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    });
                    setSalesData(response.data);
                } catch (error) {
                    console.error('Error fetching sales data:', error);
                } finally {
                    setLoading(false); // Set loading to false after data is fetched
                }
            }, 1500); // 1500 milliseconds = 1.5 seconds
        };

        fetchSalesData();
    }, []);

    // Prepare data for the chart
    const currentMonth = new Date().getMonth() + 1; // Get the current month (1-12)
    const monthsToShow = Array.from({ length: currentMonth }, (_, i) => i + 1); // Create an array of months from January to the current month
    const salesValues = monthsToShow.map(month => salesData[month] || 0); // Map salesData to salesValues, default to 0 if not present

    const data = {
        labels: monthsToShow.map(month => new Date(0, month - 1).toLocaleString('default', { month: 'long' })), // Month names
        datasets: [
            {
                label: 'Monthly Sales',
                data: salesValues,
                fill: false, // Do not fill the area under the line
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.1, // Smoothness of the line
            },
        ],
    };

    return (
        <div className="bg-white shadow-md p-4 rounded-lg flex-grow flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FaChartBar className="mr-2 text-blue-500 text-3xl" />
                Monthly Sales Overview
            </h2>
            {loading ? (
                <Loader /> // Show the Loader component when loading
            ) : (
                <div className="w-full flex-grow h-72">
                    <Line data={data} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            )}
        </div>
    );
};

export default MonthlySales;