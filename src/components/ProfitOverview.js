import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faChartPie } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader'; // Import Loader component

const ProfitOverview = () => {
    const [loading, setLoading] = useState(true); // State for loading
    const [annualProfit, setAnnualProfit] = useState(0); // State for annual profit
    const [dailyProfit, setDailyProfit] = useState(0); // State for daily profit

    useEffect(() => {
        // Simulate data fetching
        const fetchData = async () => {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a delay
            setAnnualProfit(30000); // Set example data
            setDailyProfit(500);    // Set example data
            setLoading(false);      // Set loading to false after data is "fetched"
        };

        fetchData();
    }, []);

    return (
        <div className="bg-white shadow-md p-4 rounded-lg flex-grow flex h-full">
            <div className="flex-grow">
                <h2 className="text-2xl font-semibold flex items-center">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-3xl mr-2 text-blue-500" />
                    Profit Overview
                </h2>
                {!loading ? (
                    <div className="flex flex-col gap-4 mt-4">
                        <div className="p-4 border rounded bg-gray-100 flex flex-col h-full">
                            <h3 className="flex items-center mb-2 text-xl">
                                <FontAwesomeIcon icon={faChartPie} className="text-xl mr-2 text-green-500" />
                                Annual Profit
                            </h3>
                            <p className="text-3xl flex-grow text-center">₱{annualProfit.toLocaleString()}</p>
                        </div>
                        <div className="p-4 border rounded bg-gray-100 flex flex-col h-full">
                            <h3 className="flex items-center mb-2 text-xl">
                                <FontAwesomeIcon icon={faChartPie} className="text-xl mr-2 text-orange-500" />
                                Daily Profit
                            </h3>
                            <p className="text-3xl flex-grow text-center">₱{dailyProfit.toLocaleString()}</p>
                        </div>
                    </div>
                ) : (
                    <Loader /> // Show loader while loading
                )}
            </div>
        </div>
    );
};

export default ProfitOverview;
