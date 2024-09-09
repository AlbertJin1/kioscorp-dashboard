import React from 'react';
import SalesGraph from './SalesGraph'; 
import RecentOrders from './RecentOrders';
import HighDemandItems from './HighDemandItems';
import LowDemandItems from './LowDemandItems';

const SalesManagement = () => {
    return (
        <div className="p-4 h-screen flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Sales Graph taking up full width on small screens and 2/3 on large screens */}
                <div className="flex-1 lg:flex-[2] p-0 h-full">
                    <SalesGraph />
                </div>

                {/* Recent Orders beside the graph */}
                <div className="flex-1 lg:flex-[1] p-0 h-full">
                    <RecentOrders />
                </div>
            </div>

            {/* High Demand Items and Low Demand Items below the graph and recent orders */}
            <div className="flex flex-col lg:flex-row gap-4 flex-grow">
                <div className="flex-1 p-0 h-full">
                    <HighDemandItems />
                </div>
                <div className="flex-1 p-0 h-full">
                    <LowDemandItems />
                </div>
            </div>
        </div>
    );
};

export default SalesManagement;
