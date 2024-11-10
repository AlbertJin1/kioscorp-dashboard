import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';
import Loader from './Loader'; // Adjust the import path as necessary
import { FaStar } from 'react-icons/fa';

// Register necessary elements and components with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const FeedbackChart = () => {
    const [feedbackData, setFeedbackData] = useState({
        labels: [],
        datasets: []
    });
    const [loading, setLoading] = useState(true);

    const fetchSatisfactionData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/feedback/satisfaction/', {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            const satisfactionCounts = response.data;

            const labels = Object.keys(satisfactionCounts);
            const data = Object.values(satisfactionCounts);

            setFeedbackData({
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching satisfaction data:", error);
        }
    };

    useEffect(() => {
        // Delay initial load by 1 second
        const loadInitialData = async () => {
            setTimeout(async () => {
                await fetchSatisfactionData();
                setLoading(false); // Hide loader after initial load
            }, 1000);
        };

        loadInitialData();

        // Refetch every 15 seconds without showing loader
        const intervalId = setInterval(fetchSatisfactionData, 15000);

        return () => clearInterval(intervalId);
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
                <FaStar className="mr-2 text-yellow-500 text-3xl" />
                Satisfaction Ratings (Kiosk)
            </h2>
            {loading && feedbackData.labels.length === 0 ? (
                <div className="flex justify-center items-center" style={{ height: '310px' }}>
                    <Loader />
                </div>
            ) : (
                <div className="flex-grow relative" style={{ height: '310px' }}>
                    <Pie data={feedbackData} options={chartOptions} />
                </div>
            )}
        </div>
    );
};

export default FeedbackChart;