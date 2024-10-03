import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const SalesLineChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%"> {/* Using height 100% */}
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="bottom" height={5} /> {/* Adding Legend */}
                <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default SalesLineChart;
