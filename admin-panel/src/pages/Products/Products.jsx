import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Upload, Select, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../../services/ProductService';
import './Products.scss';
import HomeButton from '../../components/HomeButton.jsx';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [file, setFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [form] = Form.useForm();

    // 🟢 Fetch Products and Categories
    useEffect(() => {
        const loadProductsAndCategories = async () => {
            try {
                const productData = await fetchProducts();
                setProducts(productData);
                toast.success('Products loaded successfully');

                const response = await axios.get('http://localhost:4000/api/categories');
                setCategories(response.data);
               toast.success('Categories loaded successfully');
            } catch (error) {
                toast.error('Error loading products or categories');
                console.error('Error:', error);
            }
        };

        loadProductsAndCategories();
    }, []);

    // 🟢 Handle Add/Edit Product
  const handleAddOrEdit = async (values) => {
    try {
        // Create FormData to handle both text and file uploads
        const formData = new FormData();

        // Append form values to FormData
        Object.keys(values).forEach(key => {
            formData.append(key, values[key]);
        });

         // Append image file if available
         if (file) {  // ✅ Ensure file exists
            formData.append("image", file);
        } else {
            console.warn("⚠ No image selected");
        }

        console.log("Submitting data:", [...formData.entries()]); // Debugging

        let response;

        if (isEditing) {
            // Update existing product
            response = await updateProduct(currentProduct._id, formData);
            if (response) {
                setProducts(products.map(p => (p._id === currentProduct._id ? { ...p, ...response } : p)));
                toast.success('Product updated successfully');
            }
        } else {
            // Add new product
            response = await addProduct( formData);
            if (response && response._id) {
                setProducts([...products, response]);
                toast.success('Product added successfully');
            }
        }

        // Reset states and close modal
        setIsModalOpen(false);
        form.resetFields();
        setFile(null);
        setPreviewImage('');

    } catch (error) {
        console.error('Error adding/updating product:', error);
        toast.error(error.response?.data?.message || 'Failed to add/update product');
    }
};


    // 🟢 Handle Product Deletion
    const handleDelete = async (id) => {
        try {
            await deleteProduct(id);
            setProducts(products.filter(p => p._id !== id));
            toast.success('Product deleted successfully');
        } catch (error) {
            toast.error('Failed to delete product');
            console.error('Error:', error);
        }
    };

    // 🟢 Open Modal for Adding a New Product
    const openAddModal = () => {
        setIsEditing(false);
        setCurrentProduct(null);
        setIsModalOpen(true);
    };

    // 🟢 Open Modal for Editing an Existing Product
    const openEditModal = (product) => {
        setIsEditing(true);
        setCurrentProduct(product);
        form.setFieldsValue({
            ...product,
            category: product.category?._id || product.category,
        });
        setIsModalOpen(true);
    };

    // 🟢 Handle File Upload for Images
    const handleFileChange = ({ file }) => {

        console.log("Raw fileObj: ", file); 
        if (file && file.originFileObj) {  // ✅ Ensure file exists
            setFile(file.originFileObj);  // ✅ Save the file in state
            setPreviewImage(URL.createObjectURL(file.originFileObj)); // ✅ Show preview
            console.log("🟢 File Selected:", file.originFileObj); // Debugging
        } else {
            console.warn("⚠ No valid file detected");
        }
    };

    // 🟢 Table Columns
    const columns = [
        {
            title: 'Image',
            key: 'image',
            dataIndex: 'image',
            render: (image) =>
                image ? (
                    <img 
                        src={image} 
                        alt="Product" 
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} 
                        onError={(e) => { e.target.src = '/images/placeholder.jpg'; }} // 🟢 Fallback Image
                    />
                ) : 'No Image'
        },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        { title: 'Brand', dataIndex: 'brand', key: 'brand' },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category_id',
            render: (category) => category?.name || 'No Category',
        },
        { title: 'Stock', dataIndex: 'countInStock', key: 'countInStock' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => openEditModal(record)}>Edit</Button>
                    <Button danger type="link" onClick={() => handleDelete(record._id)}>Delete</Button>
                </>
            ),
        }
    ];

    return (
       <>
       <div className="homeIcon">
        <HomeButton/ >
       </div>
       <div className="products">
            <h2>Products</h2>
            <Button type="primary" onClick={openAddModal}>Add Product</Button>
            <Table dataSource={products} columns={columns} rowKey="_id" />

            {/* 🟢 Add/Edit Product Modal */}
            <Modal
                title={isEditing ? 'Edit Product' : 'Add Product'}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                    setFile(null);
                    setPreviewImage('');
                }}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={handleAddOrEdit} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item name="brand" label="Brand">
                        <Input />
                    </Form.Item>

                    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="discountPrice" label="Discount Price">
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="countInStock" label="Stock" rules={[{ required: true }]}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    {/* 🟢 Category Dropdown (Fixed) */}
                    <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                        <Select placeholder="Select a category">
                            {categories.map((category) => (
                                <Option key={category._id} value={category._id}>
                                    {category.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* 🟢 Image Upload (Fixed) */}
                    <Form.Item label="Image">
                        <Upload
                            listType="picture"
                            beforeUpload={(file) => {
                                handleFileChange({ file });  // ✅ Capture the file manually
                                return false;  // ✅ Prevent automatic upload
                            }}
                            onChange={(info) => {
                                if (info.fileList.length > 0) {
                                    setFile(info.fileList[0].originFileObj);
                                    setPreviewImage(URL.createObjectURL(info.fileList[0].originFileObj));
                                }
                            }}
                            fileList={file ? [{ uid: '-1', name: file.name, status: 'done', url: previewImage }] : []}
                            accept="image/*"
                            showUploadList={{ showPreviewIcon: false }}
                        >
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </Upload>

                        {/* 🟢 Image Preview (Always Visible) */}
                        {previewImage && <img src={previewImage} alt="Preview" style={{ width: 100, marginTop: 10 }} />}
                    </Form.Item>
                </Form>
            </Modal>
        </div>
       </>
        
    );
};

export default Products;



