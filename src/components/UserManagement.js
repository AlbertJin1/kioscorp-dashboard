import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEye, FaEdit, FaTrash, FaTimes, FaChevronUp, FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Imported icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPlus } from '@fortawesome/free-solid-svg-icons';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);

    // New user state
    const [newUserUsername, setNewUserUsername] = useState('');
    const [newUserFirstName, setNewUserFirstName] = useState('');
    const [newUserLastName, setNewUserLastName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserGender, setNewUserGender] = useState('');
    const [newUserRole, setNewUserRole] = useState('');
    const [newUserPhoneNumber, setNewUserPhoneNumber] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');

    // Filtering state
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 11; // Show 10 rows per page

    // Sort state
    const [sortKey, setSortKey] = useState('id'); // Default sorting by ID
    const [sortOrder, setSortOrder] = useState('asc'); // Default to ascending

    useEffect(() => {
        const fetchUsers = async () => {
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
            }
        };

        if (editModalOpen && localStorage.getItem('role') === 'admin' && selectedUser && selectedUser.role === 'owner') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'You do not have permission to edit this user\'s profile.',
            });
            setEditModalOpen(false);
        }

        if (localStorage.getItem('role') !== 'admin' && localStorage.getItem('role') !== 'owner') {
            setAddModalOpen(false);
        }

        fetchUsers();
    }, [editModalOpen, selectedUser]);

    // Sorting function
    const sortedUsers = [...users].sort((a, b) => {
        const isAscending = sortOrder === 'asc' ? 1 : -1;
        if (sortKey === 'id') {
            return (a.id - b.id) * isAscending;
        }
        if (sortKey === 'firstName') {
            return (a.firstName.localeCompare(b.firstName)) * isAscending;
        }
        if (sortKey === 'email') {
            return (a.email.localeCompare(b.email)) * isAscending;
        }
        if (sortKey === 'gender') {
            return (a.gender.localeCompare(b.gender)) * isAscending;
        }
        if (sortKey === 'role') {
            return (a.role.localeCompare(b.role)) * isAscending;
        }
        return 0;
    });


    // Filter and pagination logic
    const filteredUsers = sortedUsers.filter(user => {
        const matchesSearchTerm = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.id.toString().includes(searchTerm);

        return matchesSearchTerm;
    });

    // Pagination controls
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

    // Handle header click to toggle sorting
    const handleSort = (key) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
        } else {
            setSortKey(key);
            setSortOrder('asc'); // Default to ascending
        }
    };

    // Reset new user form fields
    const resetNewUserForm = () => {
        setNewUserUsername('');
        setNewUserFirstName('');
        setNewUserLastName('');
        setNewUserEmail('');
        setNewUserGender('');
        setNewUserRole('');
        setNewUserPhoneNumber('');
        setNewUserPassword('');
    };

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
        setAddModalOpen(false); // Close add user modal
        setSelectedUser(null);
        resetNewUserForm();
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

    const handleAddUser = async () => {
        const newUser = {
            username: newUserUsername,
            firstName: newUserFirstName,
            lastName: newUserLastName,
            email: newUserEmail,
            gender: newUserGender,
            role: newUserRole,
            phoneNumber: newUserPhoneNumber,
            password: newUserPassword,
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/api/users/add/', newUser, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            Swal.fire('Success', 'New user added successfully!', 'success');
            setUsers([...users, newUser]); // Update the users state to include the new user
            handleCloseModals(); // Close the modal after successful addition
        } catch (error) {
            console.error(error.response.data); // Log the error response data
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Could not add user. Please try again later.',
            });
        }
    };

    const handleExportUsers = () => {
        const data = users.map((user) => ({
            id: user.id,
            username: user.username,
            firstName: user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1),
            lastName: user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1),
            email: user.email,
            gender: user.gender.charAt(0).toUpperCase() + user.gender.slice(1),
            role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
            phoneNumber: user.phoneNumber,
        }));

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Users');

        // Define the columns
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Username', key: 'username', width: 20 },
            { header: 'First Name', key: 'firstName', width: 20 },
            { header: 'Last Name', key: 'lastName', width: 20 },
            { header: 'Email', key: 'email', width: 45 },
            { header: 'Gender', key: 'gender', width: 15 },
            { header: 'Role', key: 'role', width: 15 },
            { header: 'Phone Number', key: 'phoneNumber', width: 20 },
        ];

        // Add the data
        data.forEach(user => worksheet.addRow(user)); // Add rows properly

        // Apply styles to the header and increase its height
        worksheet.getRow(1).height = 30;  // Set header row height to 25 (adjust as needed)
        worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFF0' },  // Light fill color
            };
        });

        // Apply styles to data rows
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });

            // Alternate row color
            if (rowNumber % 2 === 0) {
                row.eachCell((cell) => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFEEEEEE' }, // Light grey for even rows
                    };
                });
            }
        });

        // Save the workbook to file
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'users.xlsx');
        });
    };

    return (
        <div className="bg-blue-900 text-white p-6 rounded-md">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">User    Management</h2>
                {(localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'owner') && (
                    <div className="flex justify-between">
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold px-3 py-1 rounded text-sm flex justify-center items-center"
                            title="Export Users"
                            onClick={handleExportUsers}
                        >
                            <FontAwesomeIcon icon={faDownload} className="text-md" />
                        </button>
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold px-3 py-1 rounded hover:bg-green-700 flex justify-center items-center ml-2"
                            title="Add New User"
                            onClick={() => setAddModalOpen(true)} // Open add user modal
                        >
                            <FontAwesomeIcon icon={faPlus} className="text-md" />
                        </button>
                    </div>
                )}
            </div>

            <input
                type="text"
                placeholder="Search by name, email, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 p-2 rounded mb-4 w-full text-black"
            />
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-blue-700 border-b">
                            <th className="px-4 py-2 cursor-pointer rounded-tl-lg" onClick={() => handleSort('id')}>
                                <div className="flex items-center justify-between">
                                    <span>ID</span>
                                    <span>
                                        {sortKey === 'id' ? (sortOrder === 'asc' ? <FaChevronUp /> : <FaChevronDown />) : <FaChevronUp className="opacity-50" />}
                                    </span>
                                </div>
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('firstName')}>
                                <div className="flex items-center justify-between">
                                    <span>Name</span>
                                    <span>
                                        {sortKey === 'firstName' ? (sortOrder === 'asc' ? <FaChevronUp /> : <FaChevronDown />) : <FaChevronUp className="opacity-50" />}
                                    </span>
                                </div>
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('email')}>
                                <div className="flex items-center justify-between">
                                    <span>Email</span>
                                    <span>
                                        {sortKey === 'email' ? (sortOrder === 'asc' ? <FaChevronUp /> : <FaChevronDown />) : <FaChevronUp className="opacity-50" />}
                                    </span>
                                </div>
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('gender')}>
                                <div className="flex items-center justify-between">
                                    <span>Gender</span>
                                    <span>
                                        {sortKey === 'gender' ? (sortOrder === 'asc' ? <FaChevronUp /> : <FaChevronDown />) : <FaChevronUp className="opacity-50" />}
                                    </span>
                                </div>
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('role')}>
                                <div className="flex items-center justify-between">
                                    <span>Position</span>
                                    <span>
                                        {sortKey === 'role' ? (sortOrder === 'asc' ? <FaChevronUp /> : <FaChevronDown />) : <FaChevronUp className="opacity-50" />}
                                    </span>
                                </div>
                            </th>
                            <th className="px-4 py-2  rounded-tr-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((user) => (
                            <tr key={user.id} className="bg-blue-600">
                                <td className="border-r border-b px-4 py-2">{user.id}</td>
                                <td className="border-r border-b px-4 py-2">{user.firstName} {user.lastName}</td>
                                <td className="border-r border-b px-4 py-2">{user.email}</td>
                                <td className="border-r border-b px-4 py-2">{user.gender}</td>
                                <td className="border-r border-b px-4 py-2 capitalize">{user.role}</td>
                                {/* Actions Cell */}
                                <td className="px-4 py-2 text-center border-b">
                                    <div className="flex justify-center space-x-4">
                                        <FaEye
                                            className="cursor-pointer text-yellow-500 hover:text-yellow-700 text-2xl"
                                            onClick={() => handleView(user)}
                                        />
                                        <FaEdit
                                            className="cursor-pointer text-green-500 hover:text-green-700 text-2xl"
                                            onClick={() => handleEdit(user)}
                                        />
                                        {localStorage.getItem('role') !== 'admin' && (
                                            <FaTrash
                                                className="cursor-pointer text-red-500 hover:text-red-700 text-2xl"
                                                onClick={() => handleDelete(user.id)}
                                            />
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-8">
                <button
                    className="py-2 px-4 bg-blue-700 text-white hover:bg-blue-800 transition-colors duration-200 focus:outline-none rounded-lg flex items-center cursor-not-allowed"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <FaChevronLeft className="mr-2" /> {/* Add left arrow icon */}
                    Previous
                </button>
                <span className="font-semibold text-white flex-1 text-center">Page {currentPage} of {totalPages}</span>
                <button
                    className="py-2 px-4 bg-blue-700 text-white hover:bg-blue-800 transition-colors duration-200 focus:outline-none rounded-lg flex items-center"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                    <FaChevronRight className="ml-2" /> {/* Add right arrow icon */}
                </button>
            </div>

            {/* Modal for Adding User */}
            {addModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg z-50 text-black w-11/12 max-w-lg">
                        <h2 className="text-xl font-bold mb-4">Add New User</h2>
                        <div className="mb-4">
                            <label className="block">Username</label>
                            <input
                                type="text"
                                value={newUserUsername}
                                onChange={(e) => setNewUserUsername(e.target.value)}
                                placeholder="Enter username" // Added placeholder
                                className="border px-2 py-1 w-full"
                            />
                        </div>
                        <div className="mb-4 flex">
                            <div className="mr-2 flex-1">
                                <label className="block">First Name</label>
                                <input
                                    type="text"
                                    value={newUserFirstName}
                                    onChange={(e) => setNewUserFirstName(e.target.value)}
                                    className="border px-2 py-1 w-full"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block">Last Name</label>
                                <input
                                    type="text"
                                    value={newUserLastName}
                                    onChange={(e) => setNewUserLastName(e.target.value)}
                                    className="border px-2 py-1 w-full"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block">Email</label>
                            <input
                                type="email"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                className="border px-2 py-1 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Gender</label>
                            <select
                                value={newUserGender}
                                onChange={(e) => setNewUserGender(e.target.value)}
                                className="border px-2 py-1 w-full"
                            >
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block">Role</label>
                            <select
                                value={newUserRole}
                                onChange={(e) => setNewUserRole(e.target.value)}
                                className="border px-2 py-1 w-full"
                            >
                                {localStorage.getItem('role') === 'admin' ? (
                                    <option value="employee">Employee</option>
                                ) : (
                                    <>
                                        <option value="" disabled>Select Role</option>
                                        <option value="employee">Employee</option>
                                        <option value="admin">Admin</option>
                                        <option value="owner">Owner</option>
                                    </>
                                )}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block">Phone Number</label>
                            <input
                                type="text"
                                value={newUserPhoneNumber}
                                onChange={(e) => setNewUserPhoneNumber(e.target.value)}
                                className="border px-2 py-1 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Password</label>
                            <input
                                type="password"
                                value={newUserPassword}
                                onChange={(e) => setNewUserPassword(e.target.value)}
                                className="border px-2 py-1 w-full"
                            />
                        </div>
                        <button onClick={handleAddUser} className="bg-green-500 text-white p-2 rounded mr-2">Add User</button>
                        <button onClick={handleCloseModals} className="bg-red-500 text-white p-2 rounded">Cancel</button>
                    </div>
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                </div>
            )}

            {/* Modal for Viewing User */}
            {viewModalOpen && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg z-50 text-black w-11/12 max-w-2xl relative">
                        {/* Close Icon */}
                        <button
                            onClick={handleCloseModals}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                            <FaTimes size={20} />
                        </button>

                        {/* User Information Title */}
                        <h2 className="text-xl font-bold mb-4 text-center">User Information</h2>

                        {/* Profile Picture and User Data Section */}
                        <div className="flex flex-col md:flex-row md:items-center">
                            {/* Profile Picture Section */}
                            <div className="flex-shrink-0 flex items-center justify-center mb-4 md:mb-0 md:mr-4">
                                <img
                                    src={selectedUser.profilePicture || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'} // Replace with actual profile picture URL
                                    alt="Profile"
                                    className="h-32 w-32 md:h-64 md:w-64 rounded-full object-cover" // Center the profile picture and maintain aspect ratio
                                />
                            </div>

                            {/* User Information Section */}
                            <div className="flex-grow flex flex-col">
                                <div className="mb-2">
                                    <span className="font-semibold">First Name:</span> {selectedUser.firstName}
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold">Last Name:</span> {selectedUser.lastName}
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold">Email:</span> {selectedUser.email}
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold">Gender:</span> {selectedUser.gender}
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold">Phone Number:</span> {selectedUser.phoneNumber}
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold">Role:</span> {selectedUser.role.toUpperCase()} {/* Capitalize role */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                </div>
            )}

            {/* Modal for Editing User */}
            {editModalOpen && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg z-50 text-black w-11/12 max-w-lg">
                        <h2 className="text-xl font-bold mb-4">Edit User</h2>
                        {localStorage.getItem('role') === 'admin' && selectedUser.role === 'owner' ? (
                            <div className="text-red-500 text-center mb-4">
                                You do not have permission to edit this user's profile.
                            </div>
                        ) : (
                            <div>
                                <div className="mb-4 flex">
                                    <div className="mr-2 flex-1">
                                        <label className="block">First Name</label>
                                        <input
                                            type="text"
                                            value={selectedUser.firstName || ''}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                                            className="border px-2 py-1 w-full"
                                            disabled={localStorage.getItem('role') === 'admin' && selectedUser.role === 'owner'}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block">Last Name</label>
                                        <input
                                            type="text"
                                            value={selectedUser.lastName || ''}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                                            className="border px-2 py-1 w-full"
                                            disabled={localStorage.getItem('role') === 'admin' && selectedUser.role === 'owner'}
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block">Email</label>
                                    <input
                                        type="email"
                                        value={selectedUser.email || ''}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                        className="border px-2 py-1 w-full"
                                        disabled={localStorage.getItem('role') === 'admin' && selectedUser.role === 'owner'}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block">Gender</label>
                                    <select
                                        value={selectedUser.gender || ''}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, gender: e.target.value })}
                                        className="border px-2 py-1 w-full"
                                        disabled={localStorage.getItem('role') === 'admin' && selectedUser.role === 'owner'}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block">Phone Number</label>
                                    <input
                                        type="text"
                                        value={selectedUser.phoneNumber || ''}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, phoneNumber: e.target.value })}
                                        className="border px-2 py-1 w-full"
                                        disabled={localStorage.getItem('role') === 'admin' && selectedUser.role === 'owner'}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block">Role</label>
                                    <select
                                        value={selectedUser.role || ''}
                                        onChange={(e) => {
                                            if (localStorage.getItem('role') === 'owner') {
                                                setSelectedUser({ ...selectedUser, role: e.target.value });
                                            }
                                        }}
                                        className={`border px-2 py-1 w-full ${localStorage.getItem('role') !== 'owner' ? 'pointer-events-none opacity-50' : ''}`}
                                    >
                                        <option value="owner">Owner</option>
                                        <option value="admin">Admin</option>
                                        <option value="employee">Employee</option>
                                    </select>
                                </div>
                                <button
                                    onClick={handleSaveChanges}
                                    className="bg-green-500 text-white p-2 rounded mr-2"
                                    disabled={localStorage.getItem('role') === 'admin' && selectedUser.role === 'owner'}
                                >
                                    Save Changes
                                </button>
                                <button onClick={handleCloseModals} className="bg-red-500 text-white p-2 rounded">Close</button>
                            </div>
                        )}
                    </div>
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
