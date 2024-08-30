// src/components/SalesStatistics.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import SalesBarChart from './SalesBarChart';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';

const SalesStatistics = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filteredData, setFilteredData] = useState([]);

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
        { name: '2024-07-03', sales: 3490, profit: 4300 },
        { name: '2024-07-04', sales: 3490, profit: 4300 },
    ], []); // Memoized data

    // Function to apply the date filter
    const applyDateFilter = useCallback((start, end) => {
        if (start && end) {
            const startTime = start.getTime();
            const endTime = end.getTime();
            const newData = data.filter(item => {
                const itemDate = new Date(item.name).getTime();
                return itemDate >= startTime && itemDate <= endTime;
            });
            setFilteredData(newData);
        }
    }, [data]);

    // Set default dates on component mount
    useEffect(() => {
        const defaultStartDate = new Date();
        defaultStartDate.setDate(defaultStartDate.getDate() - 90); // 90 days ago
        const defaultEndDate = new Date(); // today

        setStartDate(defaultStartDate);
        setEndDate(defaultEndDate);
        applyDateFilter(defaultStartDate, defaultEndDate);
    }, [applyDateFilter]);

    return (
        <div className="bg-white shadow-md p-4 mb-4 rounded-lg flex-grow h-full">
            <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faChartBar} className="text-3xl mr-4 text-blue-500" />
                <h2 className="text-xl font-semibold">Sales Statistics</h2>
            </div>
            <div className="flex mb-4">
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
                        dayClassName={date => {
                            const dateString = date.toISOString().split('T')[0];
                            return data.some(item => item.name === dateString) ? 'bg-blue-100' : '';
                        }}
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
                        dayClassName={date => {
                            const dateString = date.toISOString().split('T')[0];
                            return data.some(item => item.name === dateString) ? 'bg-blue-100' : '';
                        }}
                    />
                </div>
            </div>
            {filteredData.length > 0 ? (
                <div className="h-68"> {/* Increased height for chart area */}
                    <SalesBarChart data={filteredData} />
                </div>
            ) : (
                <p className="text-gray-500">No data available for the selected date range.</p>
            )}
        </div>
    );
};

export default SalesStatistics;
