// MyProfile.js
import React from 'react';

const MyProfile = () => {
    return (
        <div className="flex flex-col bg-blue-900 text-white p-6 rounded-md">
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                    type="text"
                    value="Admin User"
                    className="w-full p-2 bg-blue-700 rounded-md text-white"
                    readOnly
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                    type="email"
                    value="admin@kioscorp.com"
                    className="w-full p-2 bg-blue-700 rounded-md text-white"
                    readOnly
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium">Phone Number</label>
                <input
                    type="text"
                    value="123-456-7890"
                    className="w-full p-2 bg-blue-700 rounded-md text-white"
                    readOnly
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium">Position</label>
                <input
                    type="text"
                    value="Admin"
                    className="w-full p-2 bg-blue-700 rounded-md text-white"
                    readOnly
                />
            </div>
        </div>
    );
};

export default MyProfile;
