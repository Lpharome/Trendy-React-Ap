import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Spin } from "antd";

const { Title, Text } = Typography;

const OrderSummaryPage = () => {
    const { id } = useParams(); // Get the order ID from the URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                const data = await response.json();
                setOrder(data);
            } catch (error) {
                console.error("Failed to fetch order:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) {
        return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
    }

    if (!order) {
        return <Text>Order not found.</Text>;
    }

    return (
        <div className="order-summary">
            <Title level={2}>Order Summary</Title>
            <Text>Order ID: {order.id}</Text>
            <div className="order-items">
                {order.items.map((item) => (
                    <div key={item.id} className="order-item">
                        <Text>{item.name}</Text>
                        <Text>
                            #{item.price} x {item.quantity}
                        </Text>
                    </div>
                ))}
            </div>
            <Text>Total: #{order.total}</Text>
        </div>
    );
};

export default OrderSummaryPage;
