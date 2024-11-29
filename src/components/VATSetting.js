import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VATSetting = ({ userRole }) => {
    const [vatPercentage, setVatPercentage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch current VAT setting
        axios.get('http://192.168.254.101:8000/api/vat-setting/')
            .then(response => {
                setVatPercentage(response.data.vat_percentage);
            })
            .catch(error => {
                console.error('Error fetching VAT setting:', error);
            });
    }, []);

    const handleSave = () => {
        axios.put('http://192.168.254.101:8000/api/vat-setting/', { vat_percentage: vatPercentage })
            .then(response => {
                setMessage('VAT setting updated successfully.');
                setIsEditing(false);
            })
            .catch(error => {
                console.error('Error updating VAT setting:', error);
                setMessage('Failed to update VAT setting.');
            });
    };

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">VAT Setting</h2>
            {userRole === 'owner' ? (
                <>
                    {isEditing ? (
                        <div className="flex items-center space-x-4">
                            <input
                                type="number"
                                value={vatPercentage}
                                onChange={(e) => setVatPercentage(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-500 focus:outline-none"
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder="Enter VAT percentage"
                            />
                            <button
                                onClick={handleSave}
                                className="bg-blue-500 text-white p-2 rounded"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-500 text-white p-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <p className="mr-2">Current VAT: {vatPercentage}%</p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-500 text-white p-2 rounded"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p>You do not have permission to edit the VAT setting.</p>
            )}
            {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
        </div>
    );
};

export default VATSetting;
