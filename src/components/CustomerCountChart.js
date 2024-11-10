import React, { useEffect, useState, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';
import axios from 'axios';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FaUsers } from 'react-icons/fa';
import Loader from './Loader'; // Import the Loader component

// Register the required elements with ChartJS
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const CustomerCountChart = () => {
    const [chartData, setChartData] = useState({
        labels: [], // Will be populated dynamically
        datasets: [
            {
                label: 'Customers Count',
                data: [], // Will be populated dynamically
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                hoverBackgroundColor: 'rgba(75, 192, 192, 0.9)',
                borderWidth: 1,
                hoverBorderWidth: 2,
            },
        ],
    });
    const [loading, setLoading] = useState(true);

    const fetchCustomerData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/customers/counts/month/', {
                headers: {
                    Authorization: `Token ${token}`
                }
            });

            // Get current month
            const currentMonth = new Date().getMonth() + 1; // Months are 0-based in JS Date
            const labels = Array.from({ length: currentMonth }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' }));
            const data = Object.values(response.data).slice(0, currentMonth); // Only take data for the current month and before

            setChartData({
                labels: labels,
                datasets: [
                    {
                        ...chartData.datasets[0],
                        data: data,
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching customer count data:", error);
        }
    }, [chartData.datasets]);

    useEffect(() => {
        // Set a 1-second delay for the initial loading
        const loadInitialData = async () => {
            setTimeout(async () => {
                await fetchCustomerData();
                setLoading(false); // Hide loader after initial load
            }, 1000);
        };

        loadInitialData();

        // Refetch every 15 seconds without showing the loader
        const intervalId = setInterval(fetchCustomerData, 15000);

        return () => clearInterval(intervalId);
    }, [fetchCustomerData]); // Include fetchCustomerData in the dependency array

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        hover: {
            mode: 'index',
            animationDuration: 200,
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            datalabels: {
                font: {
                    weight: 'bold',
                    size: 16,
                },
                formatter: (value, context) => {
                    return value;
                },
            },
        },
    };

    return (
        <div className="bg-white shadow-md p-4 rounded-lg flex-grow flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FaUsers className="mr-2 text-blue-500 text-3xl" />
                Customer Count
            </h2>
            {loading ? (
                <Loader />
            ) : (
                <div className="w-full flex-grow h-48"> {/* Use flex-grow to fill available space */}
                    <Bar data={chartData} options={chartOptions} />
                </div>
            )}
        </div>
    );
};

export default CustomerCountChart;