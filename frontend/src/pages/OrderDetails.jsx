import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Typography, Button, message, Divider, Steps } from "antd";
import axios from "axios";
import "./OrderDetails.scss";

const { Title, Text } = Typography;

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setOrder(response.data);
        console.log("📦 Order Fetched:", response.data);
      } catch (error) {
        console.error("❌ Error fetching order:", error);
        message.error("Order not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <Text>Loading order details...</Text>;
  if (!order) return <Text>Order not found.</Text>;

  const {
    _id,
    totalPrice,
    isPaid,
    isDelivered,
    shippingAddress = {},
    paymentMethod,
    orderItems = [],
  } = order;

  const statusSteps = [
    "Not Shipped", 
    "Processing", 
    "Shipped", 
    "Out for Delivery", 
    "Delivered"
  ];

  const getCurrentStep = (status) => {
    const index = statusSteps.indexOf(status);
    return index === -1 ? 0 : index;
  };

  
  return (
    <div className="order-details">
      <Helmet>
        <title>Order {_id} - Trendy Edge</title>
        <meta name="description" content="View your order details." />
      </Helmet>

      <Title level={2}>Order Details</Title>
        <Steps
            current={getCurrentStep(order.shippingStatus)}
            status={order.shippingStatus === "Delivered" ? "finish" : "process"}
            className="order-tracker"
            responsive
            size="small"
            >
            {statusSteps.map((label, index) => (
                <Steps.Step key={index} title={label} />
            ))}
        </Steps>
      <Text strong>Order ID:</Text> <Text>{_id}</Text>
      <br />
      <Text strong>Total:</Text> <Text>₦{totalPrice?.toFixed(2)}</Text>
      <br />
      <Text strong>Status:</Text>{" "}
      <Text type={isPaid ? "success" : "danger"}>{isPaid ? "✅ Paid" : "❌ Pending Payment"}</Text>
      <br />
      <Text strong>Delivery:</Text>{" "}
      <Text type={isDelivered ? "success" : "warning"}>
        {isDelivered ? "✅ Delivered" : "❌ Processing"}
      </Text>

      <Divider />

      <Title level={4}>Shipping Information</Title>
      <Text><strong>Address:</strong> {shippingAddress.address}</Text><br />
      <Text><strong>City:</strong> {shippingAddress.city}</Text><br />
      <Text><strong>Postal Code:</strong> {shippingAddress.postalCode}</Text><br />
      <Text><strong>Country:</strong> {shippingAddress.country}</Text><br />
      <Text><strong>Phone:</strong> {shippingAddress.phoneNumber}</Text>

      <Divider />

      <Title level={4}>Items</Title>
      <div className="order-items">
        {orderItems.map((item) => (
          <div key={item._id} className="order-item">
            <Text>{item.name}</Text>
            <Text>₦{item.price} × {item.quantity}</Text>
          </div>
        ))}
      </div>

      <Divider />

      <div className="order-actions">
        <Button danger disabled={!isPaid} onClick={() => message.warning("Cancel function not implemented")}>
          Cancel Order
        </Button>
        <Button type="primary" disabled={!isDelivered} onClick={() => message.info("Track function not implemented")}>
          Track Delivery
        </Button>
      </div>
    </div>
  );
};

export default OrderDetails;
