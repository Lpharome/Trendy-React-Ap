import axios from 'axios';

const API_URL = 'http://localhost:4000/api/categories';

// Get all categories
export const fetchCategories = async () => {
    const { data } = await axios.get(API_URL);
    return data;
};

// Add a category
export const addCategory = async (formData) => {
    const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};



// Update a category
export const updateCategory = async (id, categoryData, imageFile) => {
    const formData = new FormData();
    formData.append("name", categoryData.name);
    formData.append("slug", categoryData.slug);
    if (imageFile) {
        formData.append("image", imageFile);
    }

    const { data } = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};

// Delete a category
export const deleteCategory = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};
