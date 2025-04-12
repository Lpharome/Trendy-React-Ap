import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, Form, Popconfirm, message } from 'antd';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../../services/CatrgoryApi';
import './Category.scss';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeButton from '../../components/HomeButton';


const CategoryAdmin = () => {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            message.error('Failed to fetch categories');
        }
    };

    const handleAddCategory = async (values) => {
        console.log("Form Values Before Creating FormData:", values.name, values.slug);
    
        const formData = new FormData();
        formData.append("name", values.name || ""); // Ensure value is not undefined
        formData.append("slug", values.slug || "");
    
        if (imageFile) {
            formData.append("image", imageFile);
        }
    
        console.log("FormData Before Sending:");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
    
        try {
            await addCategory(formData);
            toast.success("✅ Category added successfully!", { position: "top-right", autoClose: 3000 });
            setIsModalOpen(false);
            form.resetFields();
            setEditingCategory(null);
            loadCategories();
        } catch (error) {
            console.error("Error adding category:", error);
            toast.error("🚨 Failed to add category!", { position: "top-right", autoClose: 3000 });
        }
    };
    
    
    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    
        // Ensure form fields are properly populated
        form.setFieldsValue({
            name: category.name,
            slug: category.slug,
        });
    
        // Reset the image file state (so it doesn't retain previous selection)
        setImageFile(null);
    };
    

    const handleDeleteCategory = async (id) => {
        try {
            await deleteCategory(id);
            toast.success("✅ Category deleted successfully!", { position: "top-right", autoClose: 3000 });
            loadCategories();
        } catch (error) {
            toast.error("🚨 Failed to delete category!", { position: "top-right", autoClose: 3000 });
        }
    };

    const columns = [
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (image) => <img src={image} alt="Category" className="category-image" />,
        },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Slug', dataIndex: 'slug', key: 'slug' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, category) => (
                <div className="actions">
                    <Button onClick={() => handleEditCategory(category)} type="link">Edit</Button>
                    <Popconfirm
                        title="Are you sure to delete this category?"
                        onConfirm={() => handleDeleteCategory(category._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>Delete</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <>
        <div className="homeIcon">
            <HomeButton/>
        </div>
        <div className="category-admin">
            <h2>Category Management</h2>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>Add Category</Button>
            <Table
                columns={columns}
                dataSource={categories}
                rowKey={(category) => category._id}
                pagination={{ pageSize: 5 }}
                className="category-table"
            />

            <Modal
                title={editingCategory ? 'Edit Category' : 'Add Category'}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                    setEditingCategory(null);
                }}
                footer={null}
            >
                <Form form={form} onFinish={handleAddCategory} layout="vertical" encType="multipart/form-data">
                    <Form.Item label="Category Name" name="name" rules={[{ required: true, message: "Please enter category name" }]}>
                        <Input onChange={(e) => form.setFieldsValue({ name: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Slug" name="slug" rules={[{ required: true, message: "Please enter category slug" }]}>
                        <Input onChange={(e) => form.setFieldsValue({ slug: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Category Image">
                        <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">{editingCategory ? "Update" : "Add"}</Button>
                </Form>
            </Modal>
        </div>
        </>
    );
};

export default CategoryAdmin;
