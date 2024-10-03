import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loader from './Loader'; // Import the Loader component

const MyProfile = ({ setIsAuthenticated }) => {
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        gender: '',
        role: '',
    });

    const [originalProfileData, setOriginalProfileData] = useState({});
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const firstName = localStorage.getItem('firstName');
        const lastName = localStorage.getItem('lastName');
        const email = localStorage.getItem('email');
        const phoneNumber = localStorage.getItem('phoneNumber');
        const gender = localStorage.getItem('gender');
        const role = localStorage.getItem('role');

        const initialProfileData = {
            firstName: firstName || 'N/A',
            lastName: lastName || 'N/A',
            email: email || 'N/A',
            phoneNumber: phoneNumber || 'N/A',
            gender: gender || 'N/A',
            role: role || 'N/A',
        };

        setProfileData(initialProfileData);
        setOriginalProfileData(initialProfileData);
    }, []);

    const handleEditToggle = () => {
        if (editing) {
            setProfileData(originalProfileData);
        }
        setEditing(prev => !prev);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            // Phone number validation (11 digits)
            if (profileData.phoneNumber.length !== 11) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Phone Number',
                    text: 'Phone number must be exactly 11 digits long.',
                    timer: 2000,
                    showConfirmButton: false,
                });
                return;
            }

            await axios.put('http://localhost:8000/api/profile/', {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                phoneNumber: profileData.phoneNumber,
            }, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            Swal.fire({
                icon: 'success',
                title: 'Profile Updated',
                text: 'Your profile information has been updated successfully. Please log in again.',
                timer: 2000,
                showConfirmButton: false,
            });

            // Delay before logging out
            setTimeout(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('firstName');
                localStorage.removeItem('lastName');
                localStorage.removeItem('phoneNumber');
                localStorage.removeItem('role');
                setIsAuthenticated(false); // Set authentication state to false
            }, 2000); // Delay of 2 seconds
        } catch (error) {
            console.error('Error saving profile data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update profile. Please try again later.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col bg-blue-900 text-white p-6 rounded-md">
            {loading && <Loader />}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Profile</h2>
                <button
                    onClick={handleEditToggle}
                    className="bg-blue-700 text-white p-2 rounded hover:bg-blue-800 transition duration-200"
                >
                    {editing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex justify-center">
                    <img
                        src="https://via.placeholder.com/150" // Replace with actual profile picture URL
                        alt="Profile"
                        className="w-64 h-64 rounded object-cover"
                    />
                </div>
                <div className="col-span-2">
                    {/* First Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium">First Name</label>
                        <input
                            type="text"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                            className={`w-full p-2 rounded-md text-white border bg-blue-700 ${editing ? 'border-green-500' : 'border-transparent'}`}
                            readOnly={!editing}
                        />
                    </div>

                    {/* Last Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Last Name</label>
                        <input
                            type="text"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                            className={`w-full p-2 rounded-md text-white border bg-blue-700 ${editing ? 'border-green-500' : 'border-transparent'}`}
                            readOnly={!editing}
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={profileData.email}
                            className="w-full p-2 rounded-md text-white border border-transparent bg-blue-700"
                            readOnly
                        />
                    </div>

                    {/* Gender */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Gender</label>
                        <input
                            type="text"
                            value={profileData.gender}
                            className="w-full p-2 rounded-md text-white border border-transparent bg-blue-700"
                            readOnly
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Phone Number</label>
                        <input
                            type="text"
                            value={profileData.phoneNumber}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                            className={`w-full p-2 rounded-md text-white border bg-blue-700 ${editing ? 'border-green-500' : 'border-transparent'}`}
                            readOnly={!editing}
                        />
                    </div>

                    {/* Role */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Role</label>
                        <input
                            type="text"
                            value={profileData.role ? profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1) : 'N/A'}
                            className="w-full p-2 rounded-md text-white border border-transparent bg-blue-700"
                            readOnly
                        />
                    </div>
                </div>
            </div>

            {editing && (
                <button
                    onClick={handleSave}
                    className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                >
                    Save
                </button>
            )}
        </div>
    );
};

export default MyProfile;
