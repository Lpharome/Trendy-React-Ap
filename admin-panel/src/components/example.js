import React from 'react';
import useToast from '../hooks/useToast';

const ExampleComponent = () => {
    const { notifySuccess, notifyError } = useToast(); // Import notification hook

    const handleActionSuccess = () => {
        notifySuccess('Action completed successfully!');
    };

    const handleActionError = () => {
        notifyError('An error occurred.');
    };

    return (
        <div>
            <h3>React-Toastify Example</h3>
            <button onClick={handleActionSuccess}>Show Success</button>
            <button onClick={handleActionError}>Show Error</button>
        </div>
    );
};

export default ExampleComponent;
