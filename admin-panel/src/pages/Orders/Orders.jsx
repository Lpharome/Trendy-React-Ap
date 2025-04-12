import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import axios from 'axios';
import { Table, Select, Button, message, Modal } from 'antd';
import HomeButton from '../../components/HomeButton';
import './Orders.scss';

const { Option } = Select;

const Orders = () => {
    const { data: orders, loading, error, refetch } = useFetch('/api/orders');
    const [filter, setFilter] = useState('all');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [actionType, setActionType] = useState('');
    const [updatedOrders, setUpdatedOrders] = useState([]);

    const mergedOrders = orders?.map(order =>
        updatedOrders.find(updated => updated._id === order._id) || order
    );

    const filteredOrders = mergedOrders?.filter(order => {
        if (filter === 'paid') return order.isPaid;
        if (filter === 'unpaid') return !order.isPaid;
        return true;
    });

    const showConfirmModal = (order, type) => {
        setSelectedOrder(order);
        setActionType(type);
        setModalVisible(true);
    };

    const handleTrackDelivery = async (id) => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.put(
                `http://localhost:4000/api/orders/${id}/track`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            message.success(`Shipping status updated to: ${response.data.shippingStatus}`);
            return response.data;
        } catch (error) {
            console.error("Tracking failed:", error);
            message.error(error?.response?.data?.message || "Failed to update shipping status.");
            return null;
        }
    };

    const handleConfirmAction = async () => {
        if (!selectedOrder) return;

        try {
            const token = localStorage.getItem("authToken");
            let updatedOrder = { ...selectedOrder };

            if (actionType === 'pay') {
                await axios.put(
                    `/api/orders/${selectedOrder._id}/pay`,
                    {
                        id: `manual-${selectedOrder._id}`,
                        status: 'COMPLETED',
                        update_time: new Date().toISOString(),
                        payer: { email_address: 'admin@manual.com' }
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                updatedOrder.isPaid = true;
                message.success('Order marked as paid!');
            } else if (actionType === 'deliver') {
                await axios.put(
                    `/api/orders/${selectedOrder._id}/deliver`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                updatedOrder.isDelivered = true;
                message.success('Order marked as delivered!');
            } else if (actionType === 'track') {
                const updated = await handleTrackDelivery(selectedOrder._id);
                if (updated) {
                    updatedOrder = updated;
                } else {
                    throw new Error("Failed to update shipping status.");
                }
            }

            setUpdatedOrders(prevOrders => [
                ...prevOrders.filter(order => order._id !== updatedOrder._id),
                updatedOrder
            ]);
        } catch (error) {
            message.error('Failed to update order.');
        } finally {
            setModalVisible(false);
            setSelectedOrder(null);
            setActionType('');
        }
    };

    const columns = [
        { title: 'Order ID', dataIndex: '_id', key: '_id' },
        {
            title: 'Customer Name',
            dataIndex: 'user',
            key: 'user',
            render: (user) => (user?.name ? user.name : 'Guest')
        },
        { title: 'Total', dataIndex: 'totalPrice', key: 'totalPrice' },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                <div>
                    <p>{record.isPaid ? '✅ Paid' : '❌ Unpaid'}</p>
                    <p>{record.isDelivered ? '📦 Delivered' : '🚚 Pending'}</p>
                </div>
            )
        },
        {
            title: 'Shipping Status',
            dataIndex: 'shippingStatus',
            key: 'shippingStatus',
            render: (status) => {
                const colorMap = {
                    "Processing": "#faad14",
                    "Shipped": "#1890ff",
                    "In Transit": "#722ed1",
                    "Delivered": "#52c41a",
                };
                return (
                    <span style={{ color: colorMap[status] || '#999' }}>
                        {status || "Not started"}
                    </span>
                );
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div>
                    {!record.isPaid && (
                        <Button
                            onClick={() => showConfirmModal(record, 'pay')}
                            type="primary"
                            style={{ marginRight: 8 }}
                        >
                            Confirm Payment
                        </Button>
                    )}
                    {!record.isDelivered && (
                        <Button
                            onClick={() => showConfirmModal(record, 'deliver')}
                            type="default"
                            style={{ marginRight: 8 }}
                        >
                            Mark as Delivered
                        </Button>
                    )}
                    {record.shippingStatus !== 'Delivered' && (
                        <Button
                            onClick={() => showConfirmModal(record, 'track')}
                            type="dashed"
                        >
                            Next Shipping Step
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <>
            <div className="homeIcon">
                <HomeButton />
            </div>
            <div className="orders">
                <Button onClick={refetch} type="primary" style={{ marginBottom: 10 }}>
                    Refresh Orders
                </Button>
                <h2>Orders</h2>

                <Select defaultValue="all" style={{ marginBottom: 10 }} onChange={setFilter}>
                    <Option value="all">All Orders</Option>
                    <Option value="paid">Paid Orders</Option>
                    <Option value="unpaid">Unpaid Orders</Option>
                </Select>

                {error && <p style={{ color: 'red' }}>Failed to load orders.</p>}
                {!loading && filteredOrders?.length === 0 && (
                    <p>No orders found for this filter.</p>
                )}

                <Table
                    dataSource={filteredOrders}
                    columns={columns}
                    rowKey="_id"
                    loading={loading}
                />
            </div>

            <Modal
                title="Confirm Action"
                open={modalVisible}
                onOk={handleConfirmAction}
                onCancel={() => setModalVisible(false)}
                okText="Yes"
                cancelText="No"
            >
                <p>
                    Are you sure you want to{' '}
                    {actionType === 'pay'
                        ? 'mark this order as Paid'
                        : actionType === 'deliver'
                        ? 'mark this order as Delivered'
                        : 'advance to the next shipping step'}?
                </p>
            </Modal>
        </>
    );
};

export default Orders;
