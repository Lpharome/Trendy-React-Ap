import React from "react";
import { Link } from "react-router-dom";
import { Layout, Row, Col, Typography, Input, Button } from "antd";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import "./Footer.scss";

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer = () => {
    return (
        <AntFooter className="footer">
            <Row gutter={[16, 16]}>
                {/* Quick Links */}
                <Col xs={24} sm={12} md={6}>
                    <Title level={5} className="footer-heading">Quick Links</Title>
                    <ul className="footer-links">
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms of Service</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </Col>

                {/* Social Media Links */}
                <Col xs={24} sm={12} md={8}>
                    <Title level={5} className="footer-heading">Follow Us</Title>
                    <div className="footer-icons">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebook size={24} />
                        </a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaTwitter size={24} />
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <FaInstagram size={24} />
                        </a>
                    </div>
                </Col>

                {/* Newsletter */}
                <Col xs={24} md={10}>
                    <Title level={5} className="footer-heading">Newsletter</Title>
                    <div className="newsletter-form">
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            className="newsletter-input"
                        />
                        <Button type="primary" className="newsletter-button">Subscribe</Button>
                    </div>
                </Col>
            </Row>

            {/* Footer Bottom */}
            <Row justify="center" className="footer-bottom">
                <Text>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</Text>
            </Row>
        </AntFooter>
    );
};

export default Footer;