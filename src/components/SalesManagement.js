import React from 'react';
import SalesGraph from './SalesGraph'; 
import RecentOrders from './RecentOrders';
import HighDemandItems from './HighDemandItems';
import LowDemandItems from './LowDemandItems';

const SalesManagement = () => {
    return (
        <div className="h-screen flex flex-col gap-4">
            {/* Container for Sales Graph and Recent Orders */}
            <div className="flex flex-col lg:flex-row gap-4 h-1/2">
                {/* Sales Graph taking up full width on small screens and 2/3 on large screens */}
                <div className="flex-1 lg:flex-[2] bg-white shadow-md rounded-lg">
                    <div className="p-4 h-full">
                        <SalesGraph />
                    </div>
                </div>

                {/* Recent Orders beside the graph */}
                <div className="flex-1 lg:flex-[1] bg-white shadow-md rounded-lg h-full">
                    <div className="p-4 h-full">
                        <RecentOrders />
                    </div>
                </div>
            </div>

            {/* Container for High Demand Items and Low Demand Items */}
            <div className="flex flex-col lg:flex-row gap-4 h-1/2">
                <div className="flex-1 bg-white shadow-md rounded-lg h-full">
                    <div className="p-4 h-full">
                        <HighDemandItems />
                    </div>
                </div>
                <div className="flex-1 bg-white shadow-md rounded-lg h-full">
                    <div className="p-4 h-full">
                        <LowDemandItems />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesManagement;
