import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/api', // Backend base URL
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Retrieve token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Attach token
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
