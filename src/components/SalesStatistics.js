import React, { useState, useEffect, useCallback, useMemo } from 'react';
import SalesLineChart from './SalesLineChart'; // Line Chart component
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader'; // Import the Loader component

const SalesStatistics = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state

    // Sample data - replace with actual data from your API
    const data = useMemo(() => [
        { name: '2024-01-01', sales: 4000, profit: 2400 },
        { name: '2024-02-01', sales: 3000, profit: 1398 },
        { name: '2024-03-01', sales: 2000, profit: 9800 },
        { name: '2024-04-01', sales: 2780, profit: 3908 },
        { name: '2024-05-01', sales: 1890, profit: 4800 },
        { name: '2024-06-01', sales: 2390, profit: 3800 },
        { name: '2024-07-01', sales: 3490, profit: 4300 },
        { name: '2024-07-02', sales: 3490, profit: 4300 },
        { name: '2024-07-03', sales: 999, profit: 7680 },
        { name: '2024-07-04', sales: 366, profit: 456 },
    ], []);

    // Function to apply the date filter
    const applyDateFilter = useCallback((start, end) => {
        setLoading(true); // Set loading to true when applying filter
        setTimeout(() => {
            if (start && end) {
                const startTime = start.getTime();
                const endTime = end.getTime();
                const newData = data.filter(item => {
                    const itemDate = new Date(item.name).getTime();
                    return itemDate >= startTime && itemDate <= endTime;
                });
                setFilteredData(newData);
                setLoading(false); // Set loading to false after filtering is done
            }
        }, 500); // Simulate delay for loading state
    }, [data]);

    // Set default dates on component mount
    useEffect(() => {
        const defaultStartDate = new Date();
        defaultStartDate.setDate(defaultStartDate.getDate() - 180); // 120 days ago
        const defaultEndDate = new Date(); // today

        setStartDate(defaultStartDate);
        setEndDate(defaultEndDate);
        applyDateFilter(defaultStartDate, defaultEndDate);
    }, [applyDateFilter]);

    return (
        <div className="bg-white shadow-md p-4 rounded-lg flex-grow h-full">
            <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faChartLine} className="text-3xl mr-4 text-blue-500" />
                <h2 className="text-xl font-semibold">Sales Statistics</h2>
            </div>
            <div className="flex mb-2">
                <div className="flex flex-col mr-4 w-full">
                    <label className="mb-1 font-medium">From:</label>
                    <DatePicker
                        selected={startDate}
                        onChange={date => {
                            setStartDate(date);
                            applyDateFilter(date, endDate);
                        }}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholderText="Start Date"
                    />
                </div>
                <div className="flex flex-col w-full">
                    <label className="mb-1 font-medium">To:</label>
                    <DatePicker
                        selected={endDate}
                        onChange={date => {
                            setEndDate(date);
                            applyDateFilter(startDate, date);
                        }}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholderText="End Date"
                    />
                </div>
            </div>

            {loading ? (
                <div className="h-60 flex justify-center items-center">
                    <Loader color="blue" /> {/* Display loader while loading */}
                </div>
            ) : filteredData.length > 0 ? (
                <div className="h-60"> {/* Fixed height for chart area */}
                    <SalesLineChart data={filteredData} />
                </div>
            ) : (
                <p className="text-gray-500 text-center font-semibold text-xl">
                    No data available for the selected date range.
                </p>
            )}
        </div>
    );
};

export default SalesStatistics;
