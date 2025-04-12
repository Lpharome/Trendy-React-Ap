import React, { useEffect, useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async'; // For handling page metadata
import { Row, Col, Typography, Input, Select, Spin } from 'antd'; // Ant Design components
import ProductCard from '../components/ProductCard'; // Reusable product card component
import { AppContext } from '../context/Appcontext'; // App-wide context
import './Shop.scss'; // Scoped styles for the Shop Page
import axios from 'axios'; 

const { Title } = Typography;
const { Option } = Select;

const ShopPage = () => {
  const [products, setProducts] = useState([]);      // All fetched products (based on category)
  const [filteredProducts, setFilteredProducts] = useState([]); // Products after applying search filter
  const [categories, setCategories] = useState([]);    // Category list
  const [selectedCategory, setSelectedCategory] = useState('All'); // Selected category
  const [searchTerm, setSearchTerm] = useState('');    // Search term state
  const [loading, setLoading] = useState(false);       // Loading indicator

  const { state } = useContext(AppContext);            // Get global state from AppContext
  const { searchQuery } = state;                       
  // Optionally, you can update searchTerm from global state:
  // useEffect(() => { setSearchTerm(searchQuery); }, [searchQuery]);

  // Fetch categories once when the component mounts.
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/categories");
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("❌ Error fetching categories:", error.response?.data || error.message);
      }
    };
  
    fetchCategories();
  }, []);

  // Fetch products from backend based on the selected category.
  useEffect(() => {
    console.log(`API Request URL: http://localhost:4000/api/products?category=${encodeURIComponent(selectedCategory)}`);
  }, [selectedCategory]);
  
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const url = selectedCategory === "All" 
          ? "http://localhost:4000/api/products" 
          : `http://localhost:4000/api/products?category=${encodeURIComponent(selectedCategory)}`;
        const response = await axios.get(url);
  
        console.log("API Response:", response.data); // Log response
        setProducts(response.data);
      } catch (error) {
        console.error("❌ Error fetching products:", error.response?.data || error.message);
      }
    };
  
    fetchProductsByCategory();
  }, [selectedCategory]);
  
  useEffect(() => {
    console.log("Updated Products State:", products); // ✅ Log state after API call
  }, [products]);
  
  
  
  

  // Filter products based on the search term (client-side)
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }, 300); // ✅ Adds a small delay to prevent excessive filtering
    
    return () => clearTimeout(delaySearch); // ✅ Clears timeout on next input
  }, [searchTerm, products]);
  

  return (
    <div className="shop-page">
      <Helmet>
        <title>Shop - Trendy Edge</title>
        <meta name="description" content="Explore a variety of products on our Shop Page." />
      </Helmet>

      <div className="shop-header">
        <Title level={2}>Shop</Title>
        <div className="filters">
          {/* Search Input */}
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '50%', marginRight: '1rem' }}
          />

          {/* Category Filter */}
          <Select
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value)}
            style={{ width: '30%' }}
          >
            <Option value="All">All Categories</Option>
            {categories.map((category) => (
              <Option key={category.id} value={category.name}>
                {category.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <Spin style={{ display: 'block', margin: '40px auto' }} size="large" />
      ) : (
        <div className="product-grid">
          <Row gutter={[16, 16]}>
            {filteredProducts.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product._id || product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
