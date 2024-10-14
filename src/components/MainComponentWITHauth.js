import React, { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Auth from './Auth';
import Swal from 'sweetalert2';
import Dashboard from './Dashboard';
import SalesManagement from './SalesManagement';
import Menu from './Menu';
import Inventory from './Inventory';
import OrderHistory from './OrderHistory';
import Products from './Products';

const MainComponent = () => {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        role: ''
    });

    // Memoize the checkSessionValidity function using useCallback
    const checkSessionValidity = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.get('http://localhost:8000/api/validate-session/', {
                    headers: { Authorization: `Token ${token}` }
                });
                if (response.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    throw new Error('Unauthorized');
                }
            } catch (error) {
                handleInvalidSession();  // Handle session invalidation
            }
        } else {
            handleInvalidSession();  // No token found
        }
    }, []);

    // Handle invalid session by clearing data and redirecting to Auth.js
    const handleInvalidSession = () => {
        Swal.fire({
            title: 'Session Invalid',
            text: 'Your session is invalid or has expired. Please log in again.',
            icon: 'error',
            confirmButtonColor: '#0f3a87',
            timer: 2000,
            showConfirmButton: false,
        });
        localStorage.clear();  // Clear any stored session data
        setIsAuthenticated(false);
        setCurrentPage('auth');  // Redirect to the authentication page
    };

    useEffect(() => {
        checkSessionValidity();
    }, [checkSessionValidity]);

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:8000/api/logout/', {}, {
                headers: { Authorization: `Token ${token}` }
            });

            localStorage.clear();
            setIsAuthenticated(false);
            setCurrentPage('auth');
            setLoggedInUser({ firstName: '', lastName: '', phoneNumber: '', role: '' });

            Swal.fire({
                title: 'Logged Out!',
                text: 'You have successfully logged out.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                title: 'Logout Failed!',
                text: 'There was an error logging you out. Please try again.',
                icon: 'error',
                confirmButtonColor: '#0f3a87',
            });
        }
    };

    // Render different pages based on the currentPage state
    const renderPage = () => {
        if (!isAuthenticated) {
            return <Auth setIsAuthenticated={setIsAuthenticated} setLoggedInUser={setLoggedInUser} />;
        }

        switch (currentPage) {
            case 'menu':
                return <Menu setIsAuthenticated={setIsAuthenticated} loggedInUser={loggedInUser} />;
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
                return <Dashboard />;
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
