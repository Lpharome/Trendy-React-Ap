import React, { useEffect, useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Row, Col, Typography, Spin, Alert } from 'antd';
import ProductCard from '../components/ProductCard';
import Banner from '../components/Banner';
import CategoryList from '../components/CategoryList';
import { AppContext } from '../context/Appcontext';
import RecommendedProduct from './Recommended';
import CustomerReviews from './Reviews';
import './Home.scss';
import axios from 'axios';

const { Title } = Typography;

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { state, dispatch } = useContext(AppContext);

    // ✅ Shuffle function to randomize default products
    const shuffleArray = (array) => {
        let shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // ✅ Fetch categories and initial product list
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productResponse, categoryResponse] = await Promise.all([
                    axios.get('http://localhost:4000/api/products'),
                    axios.get('http://localhost:4000/api/categories'),
                ]);
    
                setProducts(Array.isArray(productResponse.data) ? productResponse.data : []);
                setCategories(Array.isArray(categoryResponse.data) ? categoryResponse.data : []);
                setError(null);
            } catch (err) {
                console.error('❌ Error fetching data:', err);
                setError(err.response?.data?.message || 'Failed to load data.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);

     

    // ✅ Fetch featured products based on selected category
    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                let response;
                
                if (!state.selectedCategory || state.selectedCategory === "default") {
                    console.log("Fetching ALL products since no category is selected"); 
                    response = await axios.get("/products"); // ✅ Fetch all products
                    setProducts(shuffleArray(response.data).slice(0, 20)); // ✅ Shuffle & limit results
                } else {

                    response = await axios.get(`/products?category=${state.selectedCategory}`); // ✅ Fetch category-specific products
                    
                    // if (!response.data || response.data.length === 0) {
                    //     console.warn("⚠️ No products found for selected category, showing random default instead.");
                    //     response = await axios.get("/products"); // ✅ Fallback to all products
                    //     setProducts(shuffleArray(response.data).slice(0, 20));
                    // } else {
                    //     setProducts(response.data);
                    // }
                }
        
            } catch (error) {
                console.error("❌ Error fetching featured products:", error);
                setProducts([]); // ✅ Prevent crash
            }
        };
        

        fetchFeaturedProducts();
    }, [state.selectedCategory]);

    // ✅ Handle category selection & update global state
    const handleCategoryClick = (category) => {
        console.log("Category clicked:", category);
        dispatch({ type: "SET_SELECTED_CATEGORY", payload: category?._id || "default" });
    };


    // ✅ Ensure correct filtering logic
    const filteredProducts = Array.isArray(products)
    ? state.selectedCategory && state.selectedCategory !== "default"
        ? products.filter(product => String(product.category?._id || product.category) === String(state.selectedCategory))
        : shuffleArray(products).slice(0, 20) // ✅ Show default random products
    : [];


    if (loading) {
        return <Spin size="large" className="loading-container" />;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon className="error-container" />;
    }

    return (
        <div className="home">
            <Helmet>
                <title>Home - Trendy Edge</title>
                <meta name="description" content="Explore the latest products on Trendy Edge." />
            </Helmet>

            {/* Banner */}
            <Banner />

            {/* Categories */}
            <CategoryList categories={categories} onCategoryClick={handleCategoryClick} />

            {/* Products Section */}
            <div className="products">
                <Title level={3} className="products-title">
                    {state.selectedCategory && state.selectedCategory !== "default"
                        ? "Filtered Products" 
                        : "Featured Products"}
                </Title>
                <Row gutter={[16, 16]} className="product-grid">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.slice(0, 20).map(product => (
                            <Col xs={24} sm={12} md={8} lg={5} key={product._id}>
                                <ProductCard product={product} />
                            </Col>
                        ))
                    ) : (
                        <p>No products found in this category.</p>
                    )}
                </Row>
            </div>

            {/* Recommended Products */}
            <RecommendedProduct />

        </div>
    );
};

export default Home;
