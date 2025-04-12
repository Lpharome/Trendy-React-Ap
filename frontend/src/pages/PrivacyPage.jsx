import React from 'react';
import { Helmet } from 'react-helmet-async';
import './PrivacyPage.scss';

const PrivacyPage = () => {
    return (
        <div className="privacy-page">
            <Helmet>
                <title>Privacy Policy - Trendy Edge</title>
                <meta name="description" content="Understand how Trendy Edge manages your privacy and personal data." />
            </Helmet>

            <h1>Privacy Policy</h1>
            <p>
                At Trendy Edge, we are committed to protecting your privacy. This policy outlines how we collect,
                use, and safeguard your information when you visit our website.
            </p>

            <h2>Information We Collect</h2>
            <p>
                We may collect personal information such as your name, email address, and contact details when you
                interact with our website.
            </p>

            <h2>How We Use Your Information</h2>
            <p>
                Your information helps us improve your shopping experience, process orders, and keep you updated
                about new products and promotions.
            </p>

            <h2>Third-Party Sharing</h2>
            <p>
                We do not share your personal information with third parties, except as required by law or to
                deliver your orders (e.g., shipping services).
            </p>

            <h2>Your Rights</h2>
            <p>
                You have the right to access, modify, or delete your personal information. Contact us for assistance
                at privacy@trendyedge.com.
            </p>
        </div>
    );
};

export default PrivacyPage;
