import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/Appcontext";
import { Typography, Button, InputNumber, Row, Col, Spin, message } from "antd";
import "./Cart.scss";
import axios from "axios";

const { Title, Text } = Typography;

const Cart = () => {
    const { dispatch } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);

    const navigate = useNavigate();

    // ✅ Fetch cart from API when component mounts
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    message.error("You must be logged in to view the cart.");
                    return;
                }

                const response = await axios.get("http://localhost:4000/api/cart", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setCart(response.data.cartItems || []);
                setLoading(false);
            } catch (error) {
                console.error("❌ Error fetching cart:", error.response?.data?.message || error.message);
                message.error("Failed to fetch cart.");
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    // ✅ Remove item from cart
    const handleRemove = async (productId) => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                message.error("You must be logged in to remove items from the cart.");
                return;
            }

            await axios.delete(`http://localhost:4000/api/cart/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setCart(cart.filter((item) => item.product._id !== productId));
            message.success("Item removed from cart.");
        } catch (error) {
            console.error("❌ Error removing item:", error.response?.data?.message || error.message);
            message.error("Failed to remove item.");
        }
    };

    // ✅ Update item quantity
    const handleQuantityChange = async (productId, quantity) => {
        if (quantity > 0) {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    message.error("You must be logged in to update cart items.");
                    return;
                }

                await axios.put(`http://localhost:4000/api/cart/${productId}`, { quantity }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setCart(cart.map((item) => item.product._id === productId ? { ...item, quantity } : item));
                message.success("Quantity updated.");
            } catch (error) {
                console.error("❌ Error updating quantity:", error.response?.data?.message || error.message);
                message.error("Failed to update item quantity.");
            }
        }
    };

    // ✅ Calculate total cost dynamically
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    if (loading) return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;

    return (
        <div className="cart">
            <Helmet>
                <title>Shopping Cart - Trendy Edge</title>
                <meta name="description" content="View and manage items in your shopping cart." />
            </Helmet>
            <Title level={2} className="cart-title">Shopping Cart</Title>

            {cart.length === 0 ? (
                <Text className="empty-cart">Your cart is empty.</Text>
            ) : (
                <>
                    <Row gutter={[16, 16]} className="cart-items">
                        {cart.map((item) => (
                            <tr key={item.product._id}>
                                <td>
                                    <img
                                        src={item.product.image || "/placeholder.jpg"} 
                                        alt={item.product.name || "No name"}
                                        className="cart-item-image"
                                    />
                                </td>
                                <td>{item.product.name || "Unknown"}</td>
                                <td>₦{item.product.price?.toFixed(2) || "0.00"}</td>
                                <td>
                                    <div className="quantity-controls">
                                        <Button
                                            onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </Button>
                                        <InputNumber
                                            min={1}
                                            value={item.quantity}
                                            onChange={(value) => handleQuantityChange(item.product._id, value)}
                                        />
                                        <Button onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}>+</Button>
                                    </div>
                                </td>
                                <td>₦{((item.product.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                                <td>
                                    <Button type="link" danger onClick={() => handleRemove(item.product._id)}>
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </Row>
                    <div className="cart-summary">
                        <Text className="cart-total">
                            Total: ₦ {calculateTotal().toFixed(2)}
                        </Text>
                        <Button type="primary" size="large" href="/checkout">
                            Proceed to Checkout
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
