import React, { useState, useContext } from "react";
import { Modal, Typography, Input, Button } from "antd";
import { AppContext } from "../context/Appcontext";
import { toast } from "react-toastify"; // Import toast
import { useNavigate } from "react-router-dom";
import "./LoginPage.scss";

const { Title, Text } = Typography;

const LoginPage = ({ onClose, onSwitchToSignup }) => {
    const { loginUser } = useContext(AppContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error("Please enter both email and password!"); // Show error toast
            return;
        }

        setLoading(true);
        try {
            await loginUser({ email, password });
            toast.success("Login successful! Welcome back."); // Show success toast
            onClose();
            navigate("/");
        } catch (error) {
            toast.error("Login failed. Please check your credentials."); // Show error toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={true}
            onCancel={onClose}
            footer={null}
            className="login-page"
        >
            <Title level={4} className="login-title">
                Login
            </Title>
            <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                style={{ marginBottom: "16px" }}
            />
            <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                style={{ marginBottom: "16px" }}
            />
            <Button
                className="login-button"
                type="primary"
                block
                style={{ marginBottom: "16px",
                    backgroundColor: "#020d18",
                    padding: "10px",
                    borderRadius: "10px",
                    transition: "background-color 0.3s ease, transform 0.2s ease",
                    cursor: "pointer"
                 }}

                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#020d18"}
                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#e09d70"}
                loading={loading}
                onClick={handleLogin}
            >
                Login
            </Button>
            <Button onClick={onClose} block>
                Close
            </Button>
            <Text className="switch-link">
                Don't have an account?{" "}
                <Button type="link" onClick={onSwitchToSignup}>
                    Sign Up
                </Button>
            </Text>
        </Modal>
    );
};

export default LoginPage;
