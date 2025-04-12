import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Typography, Button, message, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/Appcontext";
import PaystackPop from "@paystack/inline-js";
import axios from "axios";
import "./Checkout.scss";

const { Title, Text } = Typography;

const Checkout = () => {
  const { state, dispatch } = useContext(AppContext);
  const { cart, user } = state;
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [previousOrder, setPreviousOrder] = useState(null); // Track last order to check for repeated orders
  const [orderConfirmationVisible, setOrderConfirmationVisible] = useState(false); // To show confirmation dialog

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedCart.length > 0) {
      dispatch({ type: "SET_CART", payload: storedCart });
    }

    // Fetch user profile for address
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        const { address = "", city = "", postalCode = "", country = "", phoneNumber = "" } = response.data;
        form.setFieldsValue({ address, city, postalCode, country, phoneNumber });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [dispatch, form]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const placeOrder = async (paymentRef) => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Create the order
      const { data: order } = await axios.post(
        "http://localhost:4000/api/orders",
        {
          orderItems: cart,
          shippingAddress: values,
          paymentMethod: "Paystack",
          totalPrice: calculateTotal(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // Ensure order was successfully created
      if (!order || !order._id) {
        throw new Error("Order creation failed. No Order ID returned.");
      }

      console.log("✅ Created Order:", order);

      // Mark order as paid
      await axios.put(
        `http://localhost:4000/api/orders/${order._id}/pay`,
        {
          id: paymentRef,
          status: "success",
          update_time: new Date().toISOString(),
          payer: {
            email_address: user?.email || "guest@example.com",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // Clear the cart after successful order
      localStorage.setItem("cart", JSON.stringify([])); // Clear cart in localStorage
      dispatch({ type: "SET_CART", payload: [] }); // Clear cart in the state

      message.success("Order placed and payment confirmed!");
      navigate(`/order/${order._id}`);
    } catch (error) {
      console.error("❌ Error during order process:", error);
      message.error(error.message || "Failed to complete your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (previousOrder && isSameOrder(previousOrder, cart)) {
      setOrderConfirmationVisible(true); // Show confirmation if it's the same order
      return;
    }

    try {
      const paystack = new PaystackPop();
      const amount = Number(calculateTotal()) * 100;

      paystack.newTransaction({
        key: "pk_test_af4485677e9908f5b9e04b900710ca30eb01aa20",
        email: user?.email || "guest@example.com",
        amount,
        onSuccess(transaction) {
          console.log("✅ Payment Successful:", transaction);
          message.success(`Payment Complete! Reference: ${transaction.reference}`);
          placeOrder(transaction.reference);
        },
        onCancel() {
          console.log("⚠️ Payment Cancelled");
          message.warning("Payment was cancelled. Order not placed.");
        },
      });
    } catch (error) {
      console.error("❌ Error initiating payment:", error);
      message.error("Failed to start Paystack payment.");
    }
  };

  const isSameOrder = (previousOrder, currentOrder) => {
    return JSON.stringify(previousOrder) === JSON.stringify(currentOrder);
  };

  const handleConfirmOrder = () => {
    handlePlaceOrder(); // Place order if confirmed
    setOrderConfirmationVisible(false); // Hide confirmation dialog
  };

  const handleCancelOrder = () => {
    setOrderConfirmationVisible(false); // Hide confirmation dialog if canceled
  };

  return (
    <div className="checkout">
      <Helmet>
        <title>Checkout - Trendy Edge</title>
        <meta name="description" content="Review your cart and place your order." />
      </Helmet>

      <Title level={2}>Checkout</Title>

      {cart.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <div className="checkout-content">
          <div className="checkout-summary">
            {cart.map((item) => (
              <div key={item._id} className="checkout-item">
                <Text>{item.name}</Text>
                <Text>₦{item.price} × {item.quantity}</Text>
              </div>
            ))}
            <Text strong>Total: ₦{calculateTotal().toFixed(2)}</Text>
          </div>

          {/* Shipping Address Form */}
          <Form form={form} layout="vertical" className="checkout-form">
            <Form.Item name="address" label="Address" rules={[{ required: true, message: "Please enter address" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="city" label="City" rules={[{ required: true, message: "Please enter city" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="postalCode" label="Postal Code" rules={[{ required: true, message: "Please enter postal code" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="country" label="Country" rules={[{ required: true, message: "Please enter country" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true, message: "Please enter phone number" }]}>
              <Input />
            </Form.Item>
          </Form>

          <Button type="primary" size="large" onClick={handlePlaceOrder} loading={loading}>
            Pay & Place Order
          </Button>
        </div>
      )}

      {orderConfirmationVisible && (
        <div className="order-confirmation">
          <p>You are about to place the same order again. Do you want to continue?</p>
          <Button onClick={handleConfirmOrder}>Yes</Button>
          <Button onClick={handleCancelOrder}>No</Button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
