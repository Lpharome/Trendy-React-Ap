// AdminRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import Products from '../pages/Products/Products';
import Orders from '../pages/Orders/Orders';
import Users from '../pages/Users/Users';
import Settings from '../pages/Settings/Settings';
import Login from '../pages/Login/Login';
import AdminHomePage from '../pages/AdminHomePage/AdminHomePage';
import AdminForm from '../components/AdminForm/AdminForm';
import CategoryAdmin from '../pages/Category/Category';
import AdminProfile from '../pages/AdminProfile/AdminProfile';
const AdminRoutes = () => {
    return (
        <Routes>
            {/* Public Route: Home Page */}
            <Route path="/" element={<AdminHomePage />} />

            {/* Public Route: Login */}
            <Route path="/login" element={<Login />} />

            {/* Public Route: Admin Form */}
            <Route path="/adminform0850" element={<AdminForm />} />

            {/* Remove ProtectedRoute Wrapping */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<AdminProfile />} />
            <Route path="/categories" element={<CategoryAdmin />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
        </Routes>
    );
};

export default AdminRoutes;
