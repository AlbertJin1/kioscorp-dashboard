import React, { useState } from 'react';
import MyProfile from './MyProfile.js';
import UserManagement from './UserManagement';

const Menu = () => {
    const [activeTab, setActiveTab] = useState('profile'); // Default tab is 'profile'

    return (
        <div className="flex h-[80vh] overflow-hidden rounded-lg">
            {/* Sidebar */}
            <div className="w-1/4 bg-blue-900 text-white h-full flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Menu</h2>
                    <ul className="space-y-4">
                        <li>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full text-left p-2 rounded-md ${activeTab === 'profile' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                            >
                                My Profile
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('management')}
                                className={`w-full text-left p-2 rounded-md ${activeTab === 'management' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                            >
                                User Management
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Content Area */}
            <div className="w-3/4 h-full p-8 bg-gray-100 overflow-y-auto">
                {activeTab === 'profile' && <MyProfile />}
                {activeTab === 'management' && <UserManagement />}
            </div>
        </div>
    );
};

export default Menu;
