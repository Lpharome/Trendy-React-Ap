import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

// Create AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Ensure this works correctly

    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/admin/login', credentials);
            const { token, user } = response.data;

            if (token) {
                localStorage.setItem('authToken', token);
                setUser(user);  // Ensure user state is set
                toast.success('Admin login successful!');
            } else {
                throw new Error('Invalid login response');
            }
        } catch (error) {
            toast.error('Admin login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken');
        toast.info('Logged out successfully.');
        navigate('/login');
    };

    // 🔍 Fetch Admin Profile
    const fetchUserProfile = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/admin/profile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            return response.data;
        } catch (error) {
            toast.error('Failed to fetch admin profile.');
            throw error;
        }
    };

      // 🔎 Check Authentication Status
      const checkAuthStatus = async () => {
        const token = localStorage.getItem('authToken');
    
        if (!token) {
            console.warn('No token found in localStorage');  // Use warning instead of error
            return;
        }
    
        try {
            const response = await axios.get('http://localhost:4000/api/admin/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            setUser(response.data); // Set user data if authenticated
        } catch (error) {
            console.error('Token verification failed:', error);
            logout();
        }
    
    };

    // Check authentication status on component mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    

    return (
        <AuthContext.Provider value={{ user, login, logout, fetchUserProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
