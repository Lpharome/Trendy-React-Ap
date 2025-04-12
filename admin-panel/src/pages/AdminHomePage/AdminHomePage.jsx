import React from 'react';
import './AdminHomePage.scss';
import Dashboard from '../Dashboard/Dashboard';
import Sidebar from '../../components/Sidebar/Sidebar';

const AdminHomePage = () => {
    return (
        <div className="admin-home">

            {/* Sidebar and Main Content */}
            <div className="admin-layout">
                <Sidebar/>
                <div className="main-content">
                    <h1>Admin Dashboard</h1>
                    <Dashboard/>
                </div>
            </div>
        </div>
    );
};

export default AdminHomePage;
