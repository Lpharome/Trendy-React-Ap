import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const OrderManagement = () => {
    const [orderId, setOrderId] = useState('');
    const [status, setStatus] = useState('');

    const handleOrderUpdate = async () => {
        if (!orderId || !status) {
            toast.error("Please enter order ID and status!");
            return;
        }

        try {
            const response = await axios.put(`/api/orders/${orderId}`, { status });
            toast.success(`Order #${orderId} status updated to "${status}"!`);
        } catch (error) {
            toast.error("Failed to update order. Please try again.");
        }
    };

    return (
        <div>
            <h3>Order Management</h3>
            <input
                type="text"
                placeholder="Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
            />
            <input
                type="text"
                placeholder="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            />
            <button onClick={handleOrderUpdate}>Update Order</button>
        </div>
    );
};

export default OrderManagement;
