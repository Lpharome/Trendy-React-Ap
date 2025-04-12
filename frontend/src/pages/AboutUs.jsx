import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Row, Col, Typography, Card } from 'antd';
import './AboutPage.scss';

const { Title, Paragraph } = Typography;

const AboutPage = () => {
    return (
        <div className="about-page">
            <Helmet>
                <title>About Us - Trendy Edge</title>
                <meta name="description" content="Learn more about Trendy Edge, our story, mission, and values." />
            </Helmet>

            {/* Hero Section */}
            <div className="about-hero">
                <Title level={1}>About Us</Title>
                <Paragraph>At Trendy Edge, we believe in delivering style, quality, and innovation.</Paragraph>
            </div>

            {/* Our Story Section */}
            <div className="about-section">
                <Title level={2}>Our Story</Title>
                <Paragraph>
                    Trendy Edge was founded with a vision to redefine fashion and accessories. What started as a small
                    passion project has grown into a trusted platform where thousands find their unique style.
                </Paragraph>
            </div>

            {/* Core Values Section */}
            <div className="about-section">
                <Title level={2}>Our Core Values</Title>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Card title="Innovation" bordered={false}>
                            We stay ahead of trends, curating products that speak to the future of fashion.
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card title="Quality" bordered={false}>
                            Every piece we deliver is crafted with care and attention to detail.
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card title="Sustainability" bordered={false}>
                            We strive to minimize our impact on the planet with eco-friendly practices.
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Call to Action */}
            <div className="about-cta">
                <Title level={3}>Ready to explore your next look?</Title>
                <Paragraph>
                    Visit our <a href="/shop">Shop</a> to discover the latest collections.
                </Paragraph>
            </div>
        </div>
    );
};

export default AboutPage;
