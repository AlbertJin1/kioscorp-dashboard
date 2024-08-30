import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesBarChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                    dataKey="sales"
                    fill="#2fd667"
                    animationBegin={0}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                    isAnimationActive={true}
                />
                <Bar
                    dataKey="profit"
                    fill="#e6962e"
                    animationBegin={0}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                    isAnimationActive={true}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default SalesBarChart;
