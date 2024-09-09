import React from 'react';

// Updated list of employees with the positions 'Owner', 'Admin', 'Employee'
const employees = [
    { id: 1, name: "John Doe", email: "john@example.com", position: "Employee" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", position: "Admin" },
    { id: 3, name: "Chris Johnson", email: "chris@example.com", position: "Owner" },
];

const UserManagement = () => {
    return (
        <div className="bg-blue-900 text-white p-6 rounded-md">
            <h2 className="text-xl font-bold mb-4">User Management</h2>
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
                    {employees.map((employee) => (
                        <tr key={employee.id} className="bg-blue-600">
                            <td className="border px-4 py-2">{employee.name}</td>
                            <td className="border px-4 py-2">{employee.email}</td>
                            <td className="border px-4 py-2">{employee.position}</td>
                            <td className="border px-4 py-2">
                                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2">Edit</button>
                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
