import React, { useState, useEffect } from 'react';
import MyProfile from './MyProfile';
import UserManagement from './UserManagement';
import Loader from './Loader';
import Logs from './Logs'; // Add Logs component
import ChangePassword from './ChangePassword'; // Import Change Password component

const Menu = ({ setIsAuthenticated }) => {
    const [activeTab, setActiveTab] = useState('profile'); // Default tab is 'profile'
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);
    }, []);

    const handleTabChange = (tab) => {
        setLoading(true);
        setActiveTab(tab);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="flex h-full overflow-hidden rounded-lg">
            <div className="w-1/4 bg-blue-900 text-white h-full flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Menu</h2>
                    <ul className="space-y-4">
                        <li>
                            <button
                                onClick={() => handleTabChange('profile')}
                                className={`w-full text-left p-2 rounded-md ${activeTab === 'profile' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                            >
                                My Profile
                            </button>
                        </li>
                        {(userRole === 'owner' || userRole === 'admin') && (
                            <li>
                                <button
                                    onClick={() => handleTabChange('management')}
                                    className={`w-full text-left p-2 rounded-md ${activeTab === 'management' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                                >
                                    User Management
                                </button>
                            </li>
                        )}
                        {(userRole === 'owner' || userRole === 'admin') && (
                            <li>
                                <button
                                    onClick={() => handleTabChange('logs')}
                                    className={`w-full text-left p-2 rounded-md ${activeTab === 'logs' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                                >
                                    Logs
                                </button>
                            </li>
                        )}
                        <li>
                            <button
                                onClick={() => handleTabChange('changePassword')}
                                className={`w-full text-left p-2 rounded-md ${activeTab === 'changePassword' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
                            >
                                Change Password
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="w-3/4 h-full p-8 bg-gray-100 overflow-y-auto">
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        {activeTab === 'profile' && <MyProfile setIsAuthenticated={setIsAuthenticated} />}
                        {(activeTab === 'management' && (userRole === 'owner' || userRole === 'admin')) && <UserManagement />}
                        {(activeTab === 'logs' && (userRole === 'owner' || userRole === 'admin')) && <Logs />} {/* Add Logs component */}
                        {activeTab === 'changePassword' && <ChangePassword />} {/* Add Change Password component */}
                    </>
                )}
            </div>
        </div>
    );
};

export default Menu;
