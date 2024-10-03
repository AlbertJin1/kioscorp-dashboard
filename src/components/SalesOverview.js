import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader'; // Import the Loader component

const SalesOverview = () => {
    const [loading, setLoading] = useState(true); // State for loading
    const [annualSales, setAnnualSales] = useState(0); // State for annual sales
    const [dailySales, setDailySales] = useState(0); // State for daily sales

    useEffect(() => {
        // Simulate data fetching
        const fetchData = async () => {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a delay
            setAnnualSales(100000); // Set example data
            setDailySales(1200);    // Set example data
            setLoading(false);      // Set loading to false after data is "fetched"
        };

        fetchData();
    }, []);

    return (
        <div className="bg-white shadow-md p-4 rounded-lg flex-grow flex h-full">
            <div className="flex-grow">
                <h2 className="text-2xl font-semibold flex items-center">
                    <FontAwesomeIcon icon={faChartLine} className="text-3xl mr-2 text-blue-500" />
                    Sales Overview
                </h2>
                {!loading ? (
                    <div className="flex flex-col gap-4 mt-4">
                        <div className="p-4 border rounded bg-gray-100 flex flex-col h-full">
                            <h3 className="flex items-center mb-2 text-xl">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-xl mr-2 text-green-500" />
                                Annual Sales
                            </h3>
                            <p className="text-3xl flex-grow text-center">₱{annualSales.toLocaleString()}</p>
                        </div>
                        <div className="p-4 border rounded bg-gray-100 flex flex-col h-full">
                            <h3 className="flex items-center mb-2 text-xl">
                                <FontAwesomeIcon icon={faChartLine} className="text-xl mr-2 text-orange-500" />
                                Daily Sales
                            </h3>
                            <p className="text-3xl flex-grow text-center">₱{dailySales.toLocaleString()}</p>
                        </div>
                    </div>
                ) : (
                    <Loader /> // Show loader while loading
                )}
            </div>
        </div>
    );
};

export default SalesOverview;
