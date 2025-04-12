import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Create ProductContext
export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
            toast.success('Products fetched successfully!');
        } catch (error) {
            toast.error('Failed to fetch products.');
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async (product) => {
        try {
            const response = await axios.post('/api/products', product);
            setProducts([...products, response.data]);
            toast.success('Product added successfully!');
        } catch (error) {
            toast.error('Failed to add product.');
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`/api/products/${id}`);
            setProducts(products.filter((product) => product.id !== id));
            toast.success('Product deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete product.');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider
            value={{ products, fetchProducts, addProduct, deleteProduct, loading }}
        >
            {children}
        </ProductContext.Provider>
    );
};
