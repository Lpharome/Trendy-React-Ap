import React, { useState, useContext } from "react";
import { Modal, Typography, Input, Button, message } from "antd";
import { AppContext } from "../context/Appcontext";
import { toast } from "react-toastify"; 
import { useNavigate } from "react-router-dom"; // React Router's navigation hook
import "./LoginPage.scss";

const { Title, Text } = Typography;

const SignupPage = ({ onClose, onSwitchToLogin }) => {
    const { registerUser } = useContext(AppContext); // Access registerUser function from AppContext
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // For button loading state
    const navigate = useNavigate(); // Initialize navigation hook

    const handleSignUp = async () => {
        if (!name || !email || !password) {
            toast.error("Please fill in all the fields!"); // Error message for empty fields
            return;
        }

        setLoading(true); // Start loading state
        try {
            await registerUser({ name, email, password }); // Call registerUser from context
            toast.success("Registration successful!"); // Display success message
            onClose(); // Close modal on successful signup
            navigate("/login"); // Redirect to landing page (adjust route as needed)
        } catch (error) {
            toast.error("Registration failed. Please try again."); // Display error message
        } finally {
            setLoading(false); // Stop loading state
        }
    };

    return (
        <Modal
            open={true}
            onCancel={onClose}
            footer={null}
            className="signup-page"
        >
            <Title level={4} className="signup-title">
                Sign Up
            </Title>
            <Input
                placeholder="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)} // Update name state
                className="signup-input"
                style={{ marginBottom: "16px" }}
            />
            <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state
                className="signup-input"
                style={{ marginBottom: "16px" }}
            />
            <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state
                className="signup-input"
                style={{ marginBottom: "16px" }}
            />
            <Button
                className="signup-button"
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
                loading={loading} // Add loading state to button
                onClick={handleSignUp}
            >
                Sign Up
            </Button>
            <Button onClick={onClose} block>
                Close
            </Button>
            <Text className="switch-link">
                Already have an account?{" "}
                <Button type="link" onClick={onSwitchToLogin}>
                    Login
                </Button>
            </Text>
        </Modal>
    );
};

export default SignupPage;
