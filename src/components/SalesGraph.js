// src/components/SalesGraph.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesGraph = () => {
    const data = [
        { month: 'Jan', sales: 4000, expenses: 2400 },
        { month: 'Feb', sales: 3000, expenses: 1398 },
        { month: 'Mar', sales: 2000, expenses: 9800 },
        { month: 'Apr', sales: 2780, expenses: 3908 },
        { month: 'May', sales: 1890, expenses: 4800 },
        { month: 'Jun', sales: 2390, expenses: 3800 },
        { month: 'Jul', sales: 3490, expenses: 4300 },
        { month: 'Aug', sales: 3000, expenses: 3200 },
        { month: 'Sep', sales: 4000, expenses: 4100 },
        { month: 'Oct', sales: 5000, expenses: 4000 },
        { month: 'Nov', sales: 4700, expenses: 3000 },
        { month: 'Dec', sales: 6000, expenses: 3500 },
    ];

    return (
        <div className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-semibold mb-2">Monthly Sales Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesGraph;