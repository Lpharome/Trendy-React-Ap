import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // ✅ Import toastify
import 'react-toastify/dist/ReactToastify.css'; // ✅ Import toastify CSS
import './AdminForm.scss';
import '../../services/api';

const AdminForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/admin/create-Admin', formData);
            
            // ✅ Show success toast notification
            toast.success(response.data.message || 'Admin created successfully!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            // Reset form
            setFormData({ name: '', email: '', password: '' });

        } catch (error) {
            // ✅ Show error toast notification
            toast.error(error.response?.data?.message || 'Error creating admin!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    return (
        <div className="admin-form-container">
            <h2 className="admin-form-title">Create Admin User</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className="admin-form-label">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={handleChange}
                        className="admin-form-input"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="admin-form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={handleChange}
                        className="admin-form-input"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="admin-form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        className="admin-form-input"
                        required
                    />
                </div>
                <button type="submit" className="admin-form-button">
                    Create Admin
                </button>
            </form>
        </div>
    );
};

export default AdminForm;
