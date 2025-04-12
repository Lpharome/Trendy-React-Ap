import React from 'react';
import useFetch from '../../hooks/useFetch';
import { Table } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './Users.scss';
import HomeButton from '../../components/HomeButton';

const Users = () => {
    const { data: users, loading, error } = useFetch('/api/users'); // Fetch users using custom hook

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Role', dataIndex: 'role', key: 'role' },
        {
            title: 'Profile Image',
            dataIndex: 'profileImage',
            key: 'profileImage',
            render: (url) => (
                <img 
                    src={url ? `http://localhost:4000${url}` : 'https://via.placeholder.com/50'} 
                    alt="Profile" 
                    style={{ width: 50, height: 50, borderRadius: '50%' }} 
                />
            ),
        },
    ];
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading users!</p>;

    return (
        <>
            <div className="homeIcon">
                <HomeButton/>
            </div>
            <div className="users">
                <h2>Users</h2>
                <Table dataSource={users} columns={columns} rowKey="_id" />
            </div>
        </>
    );
};

export default Users;
