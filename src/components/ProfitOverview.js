// src/components/ProfitOverview.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faChartPie } from '@fortawesome/free-solid-svg-icons';

const ProfitOverview = ({ annualProfit = 30000, dailyProfit = 500 }) => {
    return (
        <div className="bg-white shadow-md p-4 mb-4 rounded-lg flex-grow flex h-full">
            <div className="flex-grow">
                <h2 className="text-2xl font-semibold flex items-center">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-3xl mr-2 text-blue-500" />
                    Profit Overview
                </h2>
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
            </div>
        </div>
    );
};

export default ProfitOverview;
