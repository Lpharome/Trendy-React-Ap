import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';

const ExampleComponent = () => {
    const { user, login, logout } = useContext(AuthContext);
    const { notifySuccess, notifyError } = useContext(NotificationContext);

    const handleLogin = async () => {
        try {
            await login('admin@example.com', 'password123');
            notifySuccess('Logged in successfully!');
        } catch {
            notifyError('Failed to login.');
        }
    };

    return (
        <div>
            {user ? <p>Welcome, {user.name}!</p> : <p>Please log in.</p>}
            <button onClick={handleLogin}>Log In</button>
            <button onClick={logout}>Log Out</button>
        </div>
    );
};

export default ExampleComponent;
