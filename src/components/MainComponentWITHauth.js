import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Dashboard from './Dashboard';
import SalesManagement from './SalesManagement';
import Menu from './Menu';
import Inventory from './Inventory';
import OrderHistory from './OrderHistory';
import Auth from './Auth'; // Import Auth component
import Swal from 'sweetalert2';
import Products from './Products';

const MainComponent = () => {
    const [currentPage, setCurrentPage] = useState('dashboard'); // Default to Dashboard
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State for authentication
    const [loggedInUser, setLoggedInUser] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        role: '' // Add role to loggedInUser  state
    });

    // Check for token in localStorage on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true); // User is authenticated if token is present

            // Retrieve user info from localStorage
            const firstName = localStorage.getItem('firstName') || 'Guest';
            const lastName = localStorage.getItem('lastName') || '';
            const phoneNumber = localStorage.getItem('phoneNumber') || '';
            const role = localStorage.getItem('role') || ''; // Retrieve role

            // Set the logged-in user
            setLoggedInUser({ firstName, lastName, phoneNumber, role });
        }
    }, []); // Empty dependency array ensures this runs only once

    const handleLogout = async () => {
        const token = localStorage.getItem('token'); // Get token from localStorage

        try {
            // Make an API call to log out the user with the token
            await axios.post('http://localhost:8000/api/logout/', {}, {
                headers: {
                    Authorization: `Token ${token}` // Include the token in the headers
                }
            });

            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('firstName');
            localStorage.removeItem('lastName');
            localStorage.removeItem('phoneNumber');
            localStorage.removeItem('role');

            // Update state
            setIsAuthenticated(false);
            setCurrentPage('dashboard');
            setLoggedInUser({ firstName: '', lastName: '', phoneNumber: '', role: '' });

            // Show logout success alert
            Swal.fire({
                title: 'Logged Out!',
                text: 'You have successfully logged out.',
                icon: 'success',
                showConfirmButton: false, // Hide the confirm button
                timer: 2000, // Automatically close the alert after 2 seconds
                timerProgressBar: true, // Optional: show a progress bar
            });


            // Delay for 2 seconds before refreshing the page
            setTimeout(() => {
                window.location.reload(); // Refresh the page to show Auth component
            }, 2000);
        } catch (error) {
            console.error('Logout failed:', error);
            // Optional: Handle logout failure (e.g., show an error alert)
            Swal.fire({
                title: 'Logout Failed!',
                text: 'There was an error logging you out. Please try again.',
                icon: 'error',
                confirmButtonColor: '#0f3a87'
            });
        }
    };

    const renderPage = () => {
        if (!isAuthenticated) {
            return <Auth setIsAuthenticated={setIsAuthenticated} setLoggedInUser={setLoggedInUser} />;
        }

        switch (currentPage) {
            case 'menu':
                return <Menu setIsAuthenticated={setIsAuthenticated} loggedInUser={loggedInUser} />; // Pass down props
            case 'dashboard':
                return <Dashboard />;
            case 'inventory':
                return <Inventory />;
            case 'sales-management':
                return <SalesManagement />;
            case 'order-history':
                return <OrderHistory />;
            case 'product':
                return <Products />;
            default:
                return <Dashboard />; // Fallback to Dashboard
        }
    };

    return (
        <div className="flex h-screen">
            {isAuthenticated && (
                <Sidebar
                    className="fixed top-0 left-0 w-64 h-screen overflow-y-auto bg-white border-r"
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    handleLogout={handleLogout}
                />
            )}
            <div className="flex flex-col flex-grow h-screen bg-gray-100">
                {isAuthenticated && (
                    <TopBar
                        className="fixed top-0 w-full h-16 bg-white border-b"
                        currentPage={currentPage}
                        loggedInUser={loggedInUser}
                    />
                )}
                <div className="flex-grow p-4 overflow-y-auto">
                    {renderPage()}
                </div>
            </div>
        </div>
    );
};

export default MainComponent;