import React, { createContext } from 'react';
import { toast } from 'react-toastify';

// Create NotificationContext
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const notifySuccess = (message) => {
        toast.success(message);
    };

    const notifyError = (message) => {
        toast.error(message);
    };

    const notifyInfo = (message) => {
        toast.info(message);
    };

    const notifyWarning = (message) => {
        toast.warning(message);
    };

    return (
        <NotificationContext.Provider
            value={{ notifySuccess, notifyError, notifyInfo, notifyWarning }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
