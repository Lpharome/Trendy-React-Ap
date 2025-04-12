import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/Appcontext";
import axios from "../services/api";
import "./Recommended.scss";
import ProductCard from "../components/ProductCard"; 
import { message } from "antd";

const RecommendedProduct = () => {
    const { state } = useContext(AppContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchRecommendedProducts = async () => {
            try {
                setLoading(true);
                const categoryId = state.selectedCategory || "default";
                const response = await axios.get(`/products/recommended?category=${categoryId}`);
                setProducts(response.data.slice(0, 4));
            } catch (error) {
                console.error("❌ Error fetching recommended products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
    
        fetchRecommendedProducts();
    }, [state.selectedCategory]);

    if (loading) return <div className="recommended-loading">Loading recommended products...</div>;
    if (error) return <div className="recommended-error">{error}</div>;

    return (
        <div className="recommended">
            <h2>Recommended Products</h2>
            <div className="recommended-grid">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} /> // ✅ Uses ProductCard component
                ))}
            </div>
        </div>
    );
};

export default RecommendedProduct;
