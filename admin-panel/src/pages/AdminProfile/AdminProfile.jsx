import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminProfile.scss';
import HomeButton from '../../components/HomeButton.jsx';

const AdminProfile = () => {
    const [adminProfile, setAdminProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminProfile = async () => {
            const token = localStorage.getItem('authToken'); // Ensure correct token key
            if (!token) {
                message.warning('You are not logged in. Redirecting to login...');
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:4000/api/admin/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAdminProfile(response.data);
            } catch (error) {
                console.error('Error fetching admin profile:', error);
                message.error('Session expired. Please log in again.');
                handleLogout(); // Log out if request fails
            }
        };

        fetchAdminProfile();
    }, []);

    // ✅ Logout function
    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Remove token
        navigate('/login'); // Redirect to login
    };

    // ✅ Navigate to Settings Page
    const handleEditProfile = () => {
        navigate('/settings');
    };


    if (!adminProfile) return <p>Loading admin profile...</p>;

    return (
        <>
        <div className="homeIcon">
            <HomeButton />
        </div>
        <Card className="admin-profile-card">
            <Avatar 
                size={100} 
                src={adminProfile.profileImage ? `http://localhost:4000${adminProfile.profileImage}` : <UserOutlined />} 
                alt="Admin Profile" 
            />

            <h2>{adminProfile.name || 'Admin Name'}</h2>
            <p>Email: {adminProfile.email || 'Not Available'}</p>
            <p>Phone: {adminProfile.phoneNumber || 'Not Available'}</p>
            <p>Role: {adminProfile.isAdmin ? 'Admin' : 'User'}</p>
            <p>Last Login: {adminProfile.lastLogin || 'Not Available'}</p>
            
            {/* ✅ Navigate to the Edit Profile page */}
            <Button type="primary" onClick={handleEditProfile}>
                Edit Profile
            </Button>

            {/* ✅ Logout Button */}
            <Button type="default" danger onClick={handleLogout} style={{ marginLeft: '10px' }}>
                Logout
            </Button>
        </Card>
        </>
    );
};

export default AdminProfile;
