import React, { useState, useEffect } from 'react';
import Loader from './Loader'; // Import the Loader component
import SalesOverview from './SalesOverview';
import ProfitOverview from './ProfitOverview';
import InventoryOverview from './InventoryOverview';
import SalesStatistics from './SalesStatistics';
import TopSellingItems from './TopSellingItems';

const Dashboard = () => {
    const [loading, setLoading] = useState(true); // State to manage loading

    useEffect(() => {
        // Simulate an API call
        const fetchData = async () => {
            // Simulate a delay (e.g., fetching data)
            await new Promise(resolve => setTimeout(resolve, 2000));
            setLoading(false); // Set loading to false after data is "fetched"
        };

        fetchData();
    }, []); // Empty dependency array to run only once

    if (loading) {
        return <Loader />; // Show loader while loading
    }

    return (
        <div className="flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 flex-grow">
                <SalesOverview />
                <ProfitOverview />
                <InventoryOverview />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                <SalesStatistics />
                <TopSellingItems />
            </div>
        </div>
    );
};

export default Dashboard;
