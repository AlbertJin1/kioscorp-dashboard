import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import MonthlyLineChart from './MonthlyLineChart'; // Import your MonthlyLineChart component
import Loader from './Loader'; // Import the Loader component

const MonthlySales = () => {
    // Sample monthly sales data
    const data = [
        { month: 'Jan', sales: 2400 },
        { month: 'Feb', sales: 2210 },
        { month: 'Mar', sales: 2290 },
        { month: 'Apr', sales: 2000 },
        { month: 'May', sales: 2180 },
        { month: 'Jun', sales: 2500 },
        { month: 'Jul', sales: 3000 },
        { month: 'Aug', sales: 2780 },
        { month: 'Sep', sales: 2400 },
        { month: 'Oct', sales: 2700 },
        { month: 'Nov', sales: 3200 },
        { month: 'Dec', sales: 3600 },
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
