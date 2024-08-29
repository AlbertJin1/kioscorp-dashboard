// src/components/SalesOverview.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const SalesOverview = ({ annualSales = 100000, dailySales = 1200 }) => {
    return (
        <div className="bg-white shadow-md p-4 mb-4 rounded-lg flex-grow flex h-full">
            <div className="flex-grow">
                <h2 className="text-2xl font-semibold flex items-center">
                    <FontAwesomeIcon icon={faChartLine} className="text-3xl mr-2 text-blue-500" />
                    Sales Overview
                </h2>
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
            </div>
        </div>
    );
};

export default SalesOverview;
