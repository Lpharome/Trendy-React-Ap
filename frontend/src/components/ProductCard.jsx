import React, { useContext,  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/Appcontext";
import { Card, Typography, Rate, Button , message } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; // ✅ Added Axios import
import "./ProductCard.scss";





const { Meta } = Card;

const ProductCard = ({product, showWishlistIcon = true  }) => {
    const { state, dispatch, addToCart, updateCartItemQuantity, addToWishlist, removeFromWishlist } = useContext(AppContext);
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);

    
    
    
    // ✅ Fetch reviews when the component mounts or when the product ID changes

    useEffect(() => {
        if (product?._id) {  // ✅ Ensure `product._id` exists before making API call
            fetchReviews();
        }
    }, [product._id]); // ✅ Reactively fetch reviews when product changes

      // ✅ Fetch reviews for the product
      const fetchReviews = async () => {
        try {
            
            const response = await axios.get(`http://localhost:4000/api/reviews/${product._id}`); 
            
            
            setReviews(response.data);
        } catch (error) {
            console.error("❌ Error fetching reviews:", error);
        }
    };

    const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
    : 0; 

    

    // ✅ Handle card click to navigate to product 
    const handleCardClick = () => {
        if (product.category) {
            dispatch({ type: "SET_SELECTED_CATEGORY", payload: product.category._id || product.category });
        } else {
            dispatch({ type: "SET_SELECTED_CATEGORY", payload: "default" }); // ✅ Sets default when category is missing
        }
        navigate(`/product/${product._id}`);
    };


    // Ensure ID consistency
    //const cartItem = state.cart.find((item) => item._id === product._id);
    const cartItem = state.cart.find((item) => String(item._id) === String(product._id));
    const isInWishlist = state.wishlist
    .filter((item) => item && item._id)
    .some((item) => String(item._id) === String(product._id));



    const handleAddToCart = async (productId, quantity = 1) => {
        try {
            console.log("Adding to cart:", productId, quantity); // ✅ Debugging log
    
            const response = await axios.post("http://localhost:4000/api/cart", { productId, quantity }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            });
    
            console.log("Cart API Response:", response.data); // ✅ Log backend response
    
            const updatedCart = response.data.cart.cartItems;
            dispatch({ type: "SET_CART", payload: updatedCart });
    
            localStorage.setItem("cart", JSON.stringify(updatedCart)); // ✅ Ensures cart is stored in localStorage
            message.success("Added to cart");
        } catch (error) {
            console.error("❌ Error adding to cart:", error.response?.data?.message || error.message);
            message.error("Failed to add to cart.");
        }
    };
  
    const handleWishlistToggle = async (e) => {
        e.stopPropagation();
    
        try {
            if (isInWishlist) {
                await axios.delete(`http://localhost:4000/api/users/wishlist/${product._id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
                });
                dispatch({ type: "REMOVE_FROM_WISHLIST", payload: product._id });
                message.success("Removed from wishlist");
            } else {
                await axios.post("http://localhost:4000/api/users/wishlist", { productId: product._id }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
                });
                dispatch({ type: "ADD_TO_WISHLIST", payload: product });
                message.success("Added to wishlist");
            }
        } catch (error) {
            console.error("❌ Wishlist update failed:", error.response?.data?.message || error.message);
            message.error("Failed to update wishlist.");
        }
    };
    

    return (
        <Card
            hoverable
            className="product-card"
            onClick={handleCardClick}
            cover={
                <img src={product.image ? product.image : "/placeholder-image.png"} alt={product.name}
                className="product-image" />

            }
        >
            {/* Wishlist Icon */}
            {showWishlistIcon && (
                <div className="wishlist-icon" onClick={handleWishlistToggle}>
                    {isInWishlist ? (
                    <HeartFilled style={{ color: "red" }} />
                    ) : (
                    <HeartOutlined />
                    )}
                </div>
                )}

            {/* Product Details */}
            <Meta
                title={
                    <Typography className="product-name" level={5}>
                        {product.name}
                    </Typography>
                }
                description={
                    <>
                        <Typography.Text className="product-description">
                            {product.description?.length > 20
                                ? `${product.description.substring(0, 20)}...`
                                : product.description}
                        </Typography.Text>
                        <Typography.Text className="product-price" strong>
                            ₦{product.price}
                        </Typography.Text>
                        <Rate allowHalf disabled value={parseFloat(averageRating)} />

                    </>
                }
            />

            {/* Add to Cart or Increment/Decrement Buttons */}
            {cartItem ? (
                <div className="cart-controls">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            updateCartItemQuantity(cartItem._id, cartItem.quantity - 1);
                        }}
                        disabled={cartItem.quantity <= 1}
                    >
                        -
                    </Button>
                    <span className="cart-quantity">{cartItem.quantity}</span>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            updateCartItemQuantity(cartItem._id, cartItem.quantity + 1);
                        }}
                    >
                        +
                    </Button>
                </div>
            ) : (
                <Button
                    type="primary"
                    block
                    className="add-to-cart-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product._id);
                    }}
                >
                    Add to Cart
                </Button>
                
            )}
                    </Card>
                );
            };

export default ProductCard;
