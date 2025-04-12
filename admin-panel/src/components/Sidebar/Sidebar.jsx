import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DashboardOutlined, UserOutlined, ShoppingCartOutlined , ProductOutlined, SettingOutlined} from '@ant-design/icons';
import './Sidebar.scss';

const Sidebar = () => {
    const location = useLocation();
        return (
            <div className="sidebar">
            <h2 className="sidebar-title">Admin Panel</h2>
                <ul className="sidebar-menu">
                    <li className={location.pathname === '/' ? 'active' : ''}>
                        <Link to="/dashboard">
                            <DashboardOutlined /> Dashboard
                        </Link>
                    </li>
                    <li className={location.pathname === '/categories' ? 'active' : ''}>
                        <Link to="/categories">
                            <SettingOutlined/> Categories
                        </Link>
                    </li>
                    <li className={location.pathname === '/products' ? 'active' : ''}>
                        <Link to="/products">
                            <ProductOutlined /> Products
                        </Link>
                    </li>
                    <li className={location.pathname === '/user' ? 'active' : ''}>
                        <Link to="/users">
                            <UserOutlined /> Users
                        </Link>
                    </li>
                    <li className={location.pathname === '/orders' ? 'active' : ''}>
                        <Link to="/orders">
                            <ShoppingCartOutlined /> Orders
                        </Link>
                    </li>
                    <li className={location.pathname === '/settings' ? 'active' : ''}>
                        <Link to="/settings">
                            <SettingOutlined/> Settings
                        </Link>
                    </li>
                </ul>
            </div>
        );
};

export default Sidebar;
