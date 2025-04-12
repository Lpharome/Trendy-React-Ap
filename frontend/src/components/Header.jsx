import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Input, Badge, Button, Dropdown, Space, Avatar } from "antd";
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined, HeartOutlined,  HistoryOutlined  } from "@ant-design/icons";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import { AppContext } from "../context/Appcontext";
import "./Header.scss";

const { Header: AntHeader } = Layout;

const Header = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const { state, dispatch } = useContext(AppContext); // Access state and dispatch from AppContext

    const { user, cart, wishlist } = state; // Extract user, cart, wishlist, and searchQuery from state

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
    };

    

    const switchToSignup = () => {
        setIsLoginOpen(false);
        setIsSignupOpen(true);
    };

    const switchToLogin = () => {
        setIsSignupOpen(false);
        setIsLoginOpen(true);
    };

    const userMenu = (
        <Menu>
            <Menu.Item disabled>
                Welcome, {user?.name || "User"}
            </Menu.Item>
            <Menu.Item>
                <Link to="/profile">My Profile</Link> {/* ✅ Added a link to profile */}
            </Menu.Item>
            <Menu.Item key="orders" icon={<HistoryOutlined />}>
                <Link to="/orders/history">My Orders</Link>
            </Menu.Item>
            <Menu.Item onClick={handleLogout} icon={<LogoutOutlined />}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <header className="header">
            <div className="logo-seach">
                <div className="logo">
                    <a href="/">Trendy</a>
                </div>
            </div>
            <div className="nav-links">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/shop">Shop</Link></li>
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </div>
            <div className="user-actions">
                {user ? (
                    <Dropdown overlay={userMenu} placement="bottomRight">
                        <Space>
                        <Avatar 
                            src={user?.profileImage ? `http://localhost:4000${user.profileImage}` : "/default-avatar.png"} 
                            icon={!user?.profileImage && <UserOutlined />} 
                            size="large" 
                            style={{ cursor: "pointer" }} 
                        />
                        </Space>
                    </Dropdown>
                ) : (
                    <Button type="link" onClick={() => setIsSignupOpen(true)}>
                        Sign Up
                    </Button>
                )}

                {/* Wishlist Badge and Icon */}
                <Badge count={wishlist?.length || 0} offset={[10, 0]}>
                    <Link to="/wishlist" className="wishlist-icon">
                        <HeartOutlined />
                    </Link>
                </Badge>

                {/* Cart Badge and Icon */}
                <Badge count={cart?.length || 0} offset={[10, 0]}>
                    <Link to="/cart" className="cart-icon">
                        <ShoppingCartOutlined />
                    </Link>
                </Badge>
            </div>

            {/* Login Modal */}
            {isLoginOpen && (
                <LoginPage
                    onClose={() => setIsLoginOpen(false)}
                    onSwitchToSignup={switchToSignup}
                />
            )}

            {/* Signup Modal */}
            {isSignupOpen && (
                <SignupPage
                    onClose={() => setIsSignupOpen(false)}
                    onSwitchToLogin={switchToLogin}
                />
            )}
        </header>
    );
};

export default Header;
