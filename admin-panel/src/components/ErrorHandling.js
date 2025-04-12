import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const ErrorHandling = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/some-endpoint');
                setData(response.data);
            } catch (error) {
                toast.error("Failed to fetch data. Please check your connection!");
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h3>Error Handling Example</h3>
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>No data available.</p>}
        </div>
    );
};

export default ErrorHandling;
