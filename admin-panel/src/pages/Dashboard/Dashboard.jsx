import React, { useState, useEffect } from 'react';
import Widget from '../../components/Widgets/Widgets';
import { AiOutlineDollar, AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';
import axios from 'axios';
import './Dashboard.scss';
import HomeButton from '../../components/HomeButton';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [data, setData] = useState({ revenue: 0, orders: 0, users: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch orders and user data from the backend
                const token = localStorage.getItem('authToken');

                const [ordersResponse, usersResponse] = await Promise.all([
                    axios.get('http://localhost:4000/api/orders', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:4000/api/users', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                ]);

                // Calculate total revenue by summing all orders' totalPrice
                const totalRevenue = ordersResponse.data.reduce((acc, order) => acc + order.totalPrice, 0);

                // Update state with calculated data
                setData({
                    revenue: totalRevenue,
                    orders: ordersResponse.data.length, // Total number of orders
                    users: usersResponse.data.length,   // Total number of users
                });
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <>
        <div className="homeIcon">
            <HomeButton/>
        </div>
        <div className="dashboard">
            <h2>Dashboard</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="dashboard-widgets">
                    <Widget
                        title="Orders"
                        value={data.orders}
                        icon={<AiOutlineShoppingCart />}
                    />
                    <Widget
                        title="Revenue"
                        value={`$${data.revenue.toLocaleString()}`}
                        icon={<AiOutlineDollar />}
                    />
                    <Widget
                        title="Users"
                        value={data.users}
                        icon={<AiOutlineUser />}
                    />
                </div>
            )}
        </div>
        </>
    );
};

export default Dashboard;
