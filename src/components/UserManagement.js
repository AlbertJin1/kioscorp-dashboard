import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/users/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Could not fetch users. Please try again later.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Delete user by ID
    const handleDelete = async (userId) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirmDelete.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8000/api/users/${userId}/delete/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                Swal.fire('Deleted!', 'User has been deleted.', 'success');
                setUsers(users.filter(user => user.id !== userId));
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Could not delete user. Please try again later.',
                });
            }
        }
    };

    // Edit user by selecting their data and opening the modal
    const handleEdit = (user) => {
        setSelectedUser(user); // Prepare user for editing
        setEditModalOpen(true);
    };

    // View user details by ID
    const handleView = async (user) => {
        if (!user || !user.id) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'User data is not available.',
            });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/api/users/${user.id}/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            setSelectedUser(response.data); // Set fetched user data
            setViewModalOpen(true);
        } catch (error) {
            console.error('Error fetching user details:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Could not fetch user details. Please try again later.',
            });
        }
    };

    const handleCloseModals = () => {
        setViewModalOpen(false);
        setEditModalOpen(false);
        setSelectedUser(null);
    };

    // Save changes after editing
    const handleSaveChanges = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8000/api/users/${selectedUser.id}/update/`, selectedUser, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            Swal.fire('Success', 'User information updated!', 'success');
            setEditModalOpen(false);
            setUsers(users.map(user => (user.id === selectedUser.id ? selectedUser : user)));
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Could not update user. Please try again later.',
            });
        }
    };

    return (
        <div className="bg-blue-900 text-white p-6 rounded-md">
            <h2 className="text-xl font-bold mb-4">User Management</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-blue-700">
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Position</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="bg-blue-600"> {/* Use user.id */}
                                <td className="border px-4 py-2">{user.firstName} {user.lastName}</td>
                                <td className="border px-4 py-2">{user.email}</td>
                                <td className="border px-4 py-2">{user.role}</td>
                                <td className="border px-4 py-2">
                                    <button onClick={() => handleView(user)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2">View</button>
                                    <button onClick={() => handleEdit(user)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2">Edit</button>
                                    <button onClick={() => handleDelete(user.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal for Viewing User */}
            {viewModalOpen && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg z-50 text-black w-11/12 max-w-lg">
                        <h2 className="text-xl font-bold mb-4">View User</h2>
                        <div className="mb-4">
                            <label className="block">First Name</label>
                            <input
                                type="text"
                                value={selectedUser.firstName || ''}
                                className="border px-2 py-1 w-full"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Last Name</label>
                            <input
                                type="text"
                                value={selectedUser.lastName || ''}
                                className="border px-2 py-1 w-full"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Email</label>
                            <input
                                type="email"
                                value={selectedUser.email || ''}
                                className="border px-2 py-1 w-full"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Role</label>
                            <input
                                type="text"
                                value={selectedUser.role || ''}
                                className="border px-2 py-1 w-full"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Phone Number</label>
                            <input
                                type="text"
                                value={selectedUser.phoneNumber || ''}
                                className="border px-2 py-1 w-full"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Gender</label>
                            <input
                                type="text"
                                value={selectedUser.gender || ''}
                                className="border px-2 py-1 w-full"
                                readOnly
                            />
                        </div>
                        <button onClick={handleCloseModals} className="bg-red-500 text-white p-2 rounded">Close</button>
                    </div>
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                </div>
            )}


            {/* Modal for Editing User */}
            {editModalOpen && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg z-50 text-black w-11/12 max-w-lg">
                        <h2 className="text-xl font-bold mb-4">Edit User</h2>
                        <div className="mb-4">
                            <label className="block">First Name</label>
                            <input
                                type="text"
                                value={selectedUser.firstName || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                                className="border px-2 py-1 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Last Name</label>
                            <input
                                type="text"
                                value={selectedUser.lastName || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                                className="border px-2 py-1 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Email</label>
                            <input
                                type="email"
                                value={selectedUser.email || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                className="border px-2 py-1 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Role</label>
                            <select
                                value={selectedUser.role || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                className="border px-2 py-1 w-full"
                            >
                                <option value="owner">Owner</option>
                                <option value="admin">Admin</option>
                                <option value="employee">Employee</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block">Phone Number</label>
                            <input
                                type="text"
                                value={selectedUser.phoneNumber || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, phoneNumber: e.target.value })}
                                className="border px-2 py-1 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Gender</label>
                            <input
                                type="text"
                                value={selectedUser.gender || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, gender: e.target.value })}
                                className="border px-2 py-1 w-full"
                            />
                        </div>
                        <button onClick={handleSaveChanges} className="bg-green-500 text-white p-2 rounded mr-2">Save Changes</button>
                        <button onClick={handleCloseModals} className="bg-red-500 text-white p-2 rounded">Close</button>
                    </div>
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                </div>
            )}

        </div>
    );
};

export default UserManagement;
