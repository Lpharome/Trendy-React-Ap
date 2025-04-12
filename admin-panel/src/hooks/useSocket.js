import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000'; // Change this if backend is deployed

const useSocket = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const socket = io(SOCKET_URL);

        socket.on('newUser', (user) => {
            setNotifications((prev) => [...prev, `New user registered: ${user.name}`]);
        });

        socket.on('newOrder', (order) => {
            setNotifications((prev) => [...prev, `New order placed: ${order._id}`]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return notifications;
};

export default useSocket;
