import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Tabs, Switch, Select, Button, Upload, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import HomeButton from '../../components/HomeButton';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './Settings.scss';

const { Option } = Select;
const { TabPane } = Tabs;

const Settings = () => {
    const { user, fetchUserProfile } = useContext(AuthContext);
    const [profileImage, setProfileImage] = useState(user?.profileImage || '');
    const [previewImage, setPreviewImage] = useState(null);
    const [address, setAddress] = useState(user?.address || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
    const [language, setLanguage] = useState(user?.preferences?.language || 'en');
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
    }, [darkMode]);

    // **📌 Handle Image Selection for Preview**
    const handleImagePreview = (file) => {
        const reader = new FileReader();
        reader.onload = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
    };

    // **📌 Handle Profile Image Upload**
    const handleImageUpload = async ({ file }) => {
        setImageUploading(true);
        const formData = new FormData();
        formData.append('profileImage', file);

        console.log('FormData:', formData.get('profileImage'));

    
        try {
            const response = await axios.put('http://localhost:4000/api/users/profile-uploadimage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
    
            const imageUrl = response.data.profileImage;
            setProfileImage(imageUrl);
            setPreviewImage(null);
            toast.success('Profile image uploaded successfully!');
        } catch (error) {
            console.error('Upload Error:', error.response?.data || error.message);
            toast.error(`Failed to upload image: ${error.response?.data?.message || error.message}`);
        } finally {
            setImageUploading(false);
        }
    };

    // **📌 Handle Save Profile Changes**
    const handleSaveChanges = async () => {
        setLoading(true);
        try {
            const updatedData = { 
                profileImage,
                address,
                phoneNumber,
                preferences: { darkMode, language } 
            };
    
            await axios.put('http://localhost:4000/api/users/profile', updatedData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            });
    
            toast.success('Profile updated successfully!');
            fetchUserProfile();
        } catch (error) {
            console.error('Profile Update Error:', error.response?.data || error.message);
            toast.error(`Failed to update profile: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    

    // **📌 Toggle Dark Mode**
    const handleDarkModeToggle = () => {
        setDarkMode((prev) => {
            const newMode = !prev;
            localStorage.setItem('darkMode', newMode);
            document.body.classList.toggle('dark-mode', newMode);
            return newMode;
        });
    };

    return (
        <>
            <div className="homeIcon">
                <HomeButton />
            </div>
            <div className="settings">
                <h2>Settings</h2>
                <p>Manage your profile and preferences.</p>

                <Tabs defaultActiveKey="1">
                    {/* User Settings Tab */}
                    <TabPane tab="User Settings" key="1">
                        <div className="setting-item">
                            <label>Profile Image:</label>
                            <Upload
                                name="profileImage"
                                showUploadList={false}
                                customRequest={handleImageUpload}
                                beforeUpload={handleImagePreview} // Preview before upload
                            >
                                <Button icon={<UploadOutlined />} loading={imageUploading}>
                                    {imageUploading ? 'Uploading...' : 'Upload New Image'}
                                </Button>
                            </Upload>
                            {previewImage && <img src={previewImage} alt="Preview" className="profile-preview" />}
                            {!previewImage && profileImage && <img src={profileImage} alt="Profile" className="profile-preview" />}
                        </div>

                        <div className="setting-item">
                            <label>Address:</label>
                            <Input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter new address" />
                        </div>

                        <div className="setting-item">
                            <label>Phone Number:</label>
                            <Input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Provide a valid phone number" />
                        </div>
                    </TabPane>

                    {/* Theme Preferences Tab */}
                    <TabPane tab="Theme Preferences" key="2">
                        <div className="setting-item">
                            <label>Dark Mode:</label>
                            <Switch checked={darkMode} onChange={handleDarkModeToggle} />
                        </div>

                        <div className="setting-item">
                            <label>Language:</label>
                            <Select value={language} onChange={setLanguage}>
                                <Option value="en">English</Option>
                                <Option value="fr">French</Option>
                                <Option value="es">Spanish</Option>
                            </Select>
                        </div>
                    </TabPane>
                </Tabs>

                <Button type="primary" onClick={handleSaveChanges} loading={loading}>
                    Save Changes
                </Button>
            </div>
        </>
    );
};

export default Settings;
