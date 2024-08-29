// src/components/Dashboard.js
import React from 'react';
import SalesOverview from './SalesOverview';
import ProfitOverview from './ProfitOverview';
import InventoryOverview from './InventoryOverview';
import SalesStatistics from './SalesStatistics';
import TopSellingItems from './TopSellingItems';

const Dashboard = () => {
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
