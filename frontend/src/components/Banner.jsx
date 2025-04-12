import React from 'react';
import { Typography, Button } from 'antd';
import './Banner.scss';

const { Title, Text } = Typography;

const Banner = () => {
    return (
        <div className="banner">
            <div className="banner-text">
                <div >
                    <h1 className="banner-title">
                        Welcome to Trendy
                    </h1>
                </div>
                <div className="banner-subtitle">
                    <p >
                        Discover the latest trends and shop your favorite products.
                    </p>
                </div>
            </div>
                <Button type="primary" size="large" href="/shop" className="banner-button">
                        Shop Now
                </Button>
        </div>
    );
};

export default Banner;