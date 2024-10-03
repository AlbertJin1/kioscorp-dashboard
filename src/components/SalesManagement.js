import MonthlySales from './MonthlySales';
import RecentPaidOrders from './RecentPaidOrders';
import HighDemandItems from './HighDemandItems';
import LowDemandItems from './LowDemandItems';

const SalesManagement = () => {

    return (
        <div className="flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 flex-grow">
                {/* Make MonthlySales span 2 columns on medium and larger screens */}
                <div className="md:col-span-2">
                    <MonthlySales />
                </div>
                <div className="md:col-span-1">
                    <RecentPaidOrders />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                <HighDemandItems />
                <LowDemandItems />
            </div>
        </div>
    );
};

export default SalesManagement;
