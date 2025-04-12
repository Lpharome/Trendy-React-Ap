import React, { useEffect, useState } from "react";
import { Table, Typography, message } from "antd";
import axios from "axios";
import '../styles/OrderHistory.scss'; 

const { Title } = Typography;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/orders/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setOrders(data);
      } catch (error) {
        message.error("Failed to fetch order history");
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    { title: "Order ID", dataIndex: "_id", key: "_id" },
    { title: "Date", dataIndex: "createdAt", key: "createdAt" },
    { title: "Total", dataIndex: "totalPrice", key: "totalPrice" },
    {
      title: "Paid",
      dataIndex: "isPaid",
      key: "isPaid",
      render: (paid) => (paid ? "✅ Yes" : "❌ No"),
    },
    {
      title: "Delivered",
      dataIndex: "isDelivered",
      key: "isDelivered",
      render: (delivered) => (delivered ? "📦 Yes" : "🚚 No"),
    },
  ];

  return (
    <div className="order-history">
      <Title level={2}>Your Order History</Title>
      <Table dataSource={orders} columns={columns} rowKey="_id" />
    </div>
  );
};

export default OrderHistory;

