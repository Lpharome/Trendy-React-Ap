import React from 'react';
import { toast } from 'react-toastify';
import './Notification.scss';

const Notification = () => {
    const handleSuccess = () => {
        toast.success('This is a success notification! 🎉');
    };

    const handleError = () => {
        toast.error('Oops! Something went wrong. 😞');
    };

    const handleInfo = () => {
        toast.info('Here’s some useful information. 📢');
    };

    const handleWarning = () => {
        toast.warning('Be careful! This is a warning. ⚠️');
    };

    return (
        <div className="notification-container">
            <h3>Notification Example</h3>
            <div className="notification-buttons">
                <button className="success-btn" onClick={handleSuccess}>Show Success</button>
                <button className="error-btn" onClick={handleError}>Show Error</button>
                <button className="info-btn" onClick={handleInfo}>Show Info</button>
                <button className="warning-btn" onClick={handleWarning}>Show Warning</button>
            </div>
        </div>
    );
};

export default Notification;
