import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Cart from './pages/Cart'; // Import the Cart page
import Checkout from './pages/Checkout'; // Import Checkout page
import Shop from './pages/Shop';
import AboutUs from './pages/AboutUs';
import ProductDetails from './pages/ProductDetails';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import ProductDetail from './pages/ProductDetails';
import OrderSummaryPage from './pages/OrderSummaryPage'
import { ToastContainer } from 'react-toastify';
import UserProfile from './pages/UserProfile';
import WishlistPage from './pages/WishlistPage';
import ErrorBoundary from './components/ErrorBoundary';
import Invoice from './pages/Invoice'; // 
import OrderDetails from './pages/OrderDetails'; 
import OrderHistory from './pages/OrderHistory'; 
import './App.scss';

const App = () => {
    return (
        <Router>
            <ErrorBoundary>
            <div className="app">
                {/* Header */}
                <Header />

                <ToastContainer position="top-right" autoClose={3000} />
                {/* Main Content */}
                <main>
                    <Routes>
                        <Route path="/orders/history" element={<OrderHistory />}/>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/invoice/:id" element={<Invoice />} />
                        <Route path="/order/:id" element={<OrderDetails />} />
                        <Route path="/order/:id" element={<OrderSummaryPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/cart" element={<Cart />} /> {/* Added Cart route */}
                        <Route path="/checkout" element={<Checkout />} /> {/* Added Checkout route */}
                        <Route path="/product/:id" element={<ProductDetails />} /> {/* Product Details route */}
                        {/* Add more routes here as needed */}
                    </Routes>
                </main>

                {/* Footer */}
                <Footer />
            </div>
            </ErrorBoundary>
        </Router>
    );
};

export default App;