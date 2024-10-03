import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import MonthlyLineChart from './MonthlyLineChart'; // Import your MonthlyLineChart component
import Loader from './Loader'; // Import the Loader component

const MonthlySales = () => {
    // Sample monthly sales data
    const data = [
        { month: 'January', sales: 2400 },
        { month: 'February', sales: 2210 },
        { month: 'March', sales: 2290 },
        { month: 'April', sales: 2000 },
        { month: 'May', sales: 2180 },
        { month: 'June', sales: 2500 },
        { month: 'July', sales: 3000 },
        { month: 'August', sales: 2780 },
        { month: 'September', sales: 2400 },
        { month: 'October', sales: 2700 },
        { month: 'November', sales: 3200 },
        { month: 'December', sales: 3600 },
    ];

    const [loading, setLoading] = useState(true); // State for loading

    // Simulate data fetching or some delay
    useEffect(() => {
        const fetchData = async () => {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div className="bg-white shadow-md p-4 rounded-lg flex-grow h-full">
            <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faChartLine} className="text-3xl mr-4 text-blue-500" />
                <h2 className="text-xl font-semibold">Monthly Sales Overview</h2>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader color="blue" /> {/* Display loader while loading */}
                </div>
            ) : (
                <div className="h-64"> {/* Set a fixed height for the chart area */}
                    <MonthlyLineChart data={data} />
                </div>
            )}
        </div>
    );
};

export default MonthlySales;
