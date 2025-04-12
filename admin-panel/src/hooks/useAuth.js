import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const useAuth = () => {
    const [user, setUser] = useState(null); // Store authenticated user
    const [loading, setLoading] = useState(false); // Loading state

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:4000/api/admin/login', { email, password });
            const { token, userData } = response.data; // Expect backend to return token and user data
            
            if (token && userData) {
                localStorage.setItem('authToken', token); // Save token in localStorage
                setUser(userData); // Set user data directly from backend response
                toast.success('Login successful!');
            } else {
                throw new Error('Invalid login response');
            }
        } catch (error) {
            toast.error('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        setUser(null); // Clear user state
        localStorage.removeItem('authToken'); // Remove token
        toast.info('Logged out successfully.');
    };

    // Check authentication status on component mount
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    // Verify token with backend and fetch user data
                    const response = await axios.get('/api/profile', {
                        headers: {
                            Authorization: `Bearer ${token}`, // Pass token in Authorization header
                        },
                    });
                    setUser(response.data); // Set user data from backend response
                } catch (error) {
                    console.error('Authentication check failed:', error);
                    logout(); // Clear invalid tokens
                }
            }
        };

        checkAuthStatus();
    }, []); // Run once on mount

    return { user, login, logout, loading };
};

export default useAuth;
