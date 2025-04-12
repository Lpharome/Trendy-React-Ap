import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Typography, Button, Table, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyOrders.scss";

const { Title } = Typography;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/orders/myorders", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });

        setOrders(response.data);
      } catch (error) {
        message.error("❌ Error fetching order history.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `₦${price.toFixed(2)}`,
    },
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
      render: (delivered) => (delivered ? "✅ Yes" : "❌ No"),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, order) => (
        <Button type="link" onClick={() => navigate(`/order/${order._id}`)}> {/* ✅ Navigates to `OrderDetails.jsx` */}
          View Details
        </Button>
      ),
    },
  ];
  

  return (
    <div className="my-orders">
      <Helmet>
        <title>My Orders - Trendy Edge</title>
        <meta name="description" content="View your order history." />
      </Helmet>

      <Title level={2}>My Orders</Title>

      {loading ? (
        <Typography.Text>Loading orders...</Typography.Text>
      ) : orders.length === 0 ? (
        <Typography.Text>You have no orders.</Typography.Text>
      ) : (
        <Table dataSource={orders} columns={columns} rowKey="_id" />
      )}
    </div>
  );
};

export default MyOrders;
