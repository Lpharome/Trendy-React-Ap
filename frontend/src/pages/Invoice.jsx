import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "antd";
import axios from "axios";
import "./Invoice.scss";

const { Title, Text } = Typography;

const Invoice = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setOrder(response.data);
      } catch (error) {
        console.error("❌ Error fetching invoice:", error);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) return <Text>Invoice not found.</Text>;

  return (
    <div className="invoice">
      <Title level={2}>Invoice</Title>
      <Text strong>Order ID: {order._id}</Text>
      <Text>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
      <Text>Total Price: ₦{order.totalPrice.toFixed(2)}</Text>
      <Text>Payment Status: {order.isPaid ? "Paid" : "Pending Payment"}</Text>

      <div className="invoice-items">
        {order.orderItems.map((item) => (
          <div key={item._id} className="invoice-item">
            <Text>{item.name}</Text>
            <Text>₦{item.price} × {item.quantity}</Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Invoice;
