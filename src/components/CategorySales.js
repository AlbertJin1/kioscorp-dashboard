import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { FaChartPie } from 'react-icons/fa';
import Loader from './Loader'; // Import the Loader component

const CategorySales = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
        }],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategorySales = async () => {
            const token = localStorage.getItem('token'); // Retrieve token from localStorage
            try {
                const response = await axios.get('http://localhost:8000/api/sales/category/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });

                const labels = Object.keys(response.data);
                const data = Object.values(response.data);

                // Define two attractive colors
                const attractiveColors = [
                    '#4A90E2', // Calm Blue
                    '#50E3C2', // Soft Green
                ];

                // Use the two colors for the dataset
                const backgroundColor = attractiveColors.slice(0, Math.min(labels.length, 2)); // Limit to 2 colors

                setChartData({
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: backgroundColor,
                    }],
                });
            } catch (error) {
                console.error("Error fetching category sales data:", error);
            } finally {
                setLoading(false); // Ensure loading is set to false after fetching data
            }
        };

        fetchCategorySales();
    }, []);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                color: '#fff',
                font: {
                    weight: 'bold',
                    size: 16,
                },
                formatter: (value, context) => value,
            },
        },
    };

    return (
        <div className="bg-white shadow-md p-4 rounded-lg flex-grow flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FaChartPie className="mr-2 text-yellow-500 text-3xl" />
                Category Sales
            </h2>
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <Loader /> {/* Use the Loader component here */}
                </div>
            ) : (
                <div className="flex-grow flex justify-center items-center" style={{ height: '260px' }}>
                    {chartData.labels.length === 0 ? (
                        <p className="text-lg text-gray-700">No data available</p> // Message when no data is available
                    ) : (
                        <Pie data={chartData} options={chartOptions} />
                    )}
                </div>
            )}
        </div>
    );
};

export default CategorySales;