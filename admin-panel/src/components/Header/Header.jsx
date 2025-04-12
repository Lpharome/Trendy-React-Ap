import React from 'react';
import { Input, Badge, Avatar, Dropdown, Menu } from 'antd';
import { AiOutlineNotification, AiOutlineUser } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import useSocket from '../../hooks/useSocket.js';
import './Header.scss';

const Header = ({ adminProfile }) => {
    const notifications = useSocket(); // Get live notifications

    const menu = (
        <Menu>
            {notifications.length > 0 ? (
                notifications.map((msg, index) => (
                    <Menu.Item key={index}>{msg}</Menu.Item>
                ))
            ) : (
                <Menu.Item>No new notifications</Menu.Item>
            )}
        </Menu>
    );

    return (
        <div className="header">
            <Input.Search placeholder="Search..." className="header-search" />
            <div className="header-icons">
                <Dropdown overlay={menu} trigger={['click']}>
                    <Badge count={notifications.length} size="small">
                        <AiOutlineNotification className="header-icon" />
                    </Badge>
                </Dropdown>

                <Link to="/profile" className="profile-link">
                    {adminProfile?.profileImage ? (
                        <Avatar
                            src={adminProfile.profileImage}
                            size={30}
                            className="header-avatar"
                        />
                    ) : (
                        <AiOutlineUser className="header-icon" />
                    )}
                </Link>
            </div>
        </div>
    );
};

export default Header;
