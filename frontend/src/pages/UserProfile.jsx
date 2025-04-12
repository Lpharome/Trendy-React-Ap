import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/Appcontext';
import { Button, Input, Form, Typography, message } from 'antd';
import { Helmet } from 'react-helmet-async';
import './userProfile.scss';
import { useNavigate } from 'react-router-dom';
import { Modal } from "antd";



const { Title } = Typography;

const Profile = () => {
    const { state, dispatch } = useContext(AppContext);
    const user = state.user; // ✅ Ensure `user` is explicitly defined
    const [updatedName, setUpdatedName] = useState(state.user?.name || "");
    const [updatedEmail, setUpdatedEmail] = useState(state.user?.email || "");
    const [updatedPhone, setUpdatedPhone] = useState(state.user?.phoneNumber || "");
    const [updatedAddress, setUpdatedAddress] = useState(state.user?.address || "");
    const [profileImage, setProfileImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false); 


    const showModal = () => {
      setIsModalOpen(true);
    };

    const handleCancel = () => {
      setIsModalOpen(false);
    };

    useEffect(() => {
        if (state.user) {
            setUpdatedName(state.user.name);
            setUpdatedEmail(state.user.email);
            setUpdatedPhone(state.user.phoneNumber);
            setUpdatedAddress(state.user.address);
        }
    },  [state.user, isModalOpen]);


    const handleUpdateProfile = async () => {
      setLoading(true);
      try {
          const formData = new FormData();
          formData.append("name", updatedName);
          formData.append("email", updatedEmail);
          formData.append("phoneNumber", updatedPhone);
          formData.append("address", updatedAddress);
          if (profileImage) {
              formData.append("profileImage", profileImage); // ✅ Attach image file
          }


  
          const response = await fetch("http://localhost:4000/api/users/profile-uploadimage", {
              method: "PUT",
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: formData, // ✅ Send image as multipart form data
          });
  
          if (!response.ok) {
              throw new Error("Failed to update profile");
          }
  
          const updatedUserData = await response.json();


          dispatch({ type: "SET_USER", payload: updatedUserData });
          message.success("Profile updated successfully!");
      } catch (error) {
          console.error("❌ Error updating profile:", error);
          message.error("Failed to update profile.");
      } finally {
          setLoading(false);
      }
  };
  

    return (

        <div className="profile-page">
            <Helmet>
              <title>Your Profile - Trendy Edge</title>
              <meta name="description" content="View and update your profile information" />
            </Helmet>
     
            <Title level={2}>My Profile</Title>
            <div className="profileImage">
              {user?.profileImage && (
                    <img src={`http://localhost:4000${user.profileImage}`} alt="Profile" className="profile-image" />
                )}
            </div>
            <div className="profileO">
                <h2>{user?.name}</h2>
                <p><span className='span' >User Emaill :</span>  {user?.email}</p>
                <p><span className='span'>Phone Number :</span>  {user?.phoneNumber}</p>
                <p><span className='span'>Address : </span> {user?.address}</p>
                <p><span className='span'>Country :</span>  Nigeria</p>
            </div>

             
            <Button type="primary" onClick={showModal}>Edit Profile</Button>

                <Modal
                    title="Edit Profile"
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Form layout="vertical" onFinish={handleUpdateProfile}>
                        <Form.Item label="Name">
                            <Input value={updatedName} disabled />
                        </Form.Item>
                        <Form.Item label="Email">
                            <Input value={updatedEmail} disabled />
                        </Form.Item>
                        <Form.Item label="Phone Number">
                            <Input 
                                value={updatedPhone} 
                                onChange={(e) => setUpdatedPhone(e.target.value)} 
                                placeholder="Enter your phone number" 
                            />
                        </Form.Item>
                        <Form.Item label="Address">
                            <Input 
                                value={updatedAddress} 
                                onChange={(e) => setUpdatedAddress(e.target.value)} 
                                placeholder="Enter your address" 
                            />
                        </Form.Item>
                        <Form.Item label="Profile Image">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => setProfileImage(e.target.files[0])} 
                            />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">Update Profile</Button>
                    </Form>
                </Modal>
        </div>
    );
};

export default Profile;
