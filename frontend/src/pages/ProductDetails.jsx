import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Typography, Button, Rate, Spin, message, Modal, Form, Input } from "antd";
import { AppContext } from "../context/Appcontext";
import axios from "axios";
import RecommendedProduct from "./Recommended";
import "./ProductDetails.scss";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";


const { Title, Text } = Typography;

const ProductDetails = () => {
    const { id } = useParams();
    const { state, dispatch } = useContext(AppContext);
    const [product, setProduct] = useState(null);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reviewForm] = Form.useForm();
    const [expandedReviews, setExpandedReviews] = useState({});

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/reviews/${id}`);
            setReviews(response.data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [id]);

    const handleReviewSubmit = async (values) => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                message.error("You must be logged in to leave a review.");
                return;
            }

            const response = await axios.post(
                `http://localhost:4000/api/reviews/${product._id}`,
                {
                    rating: values.rating,
                    comment: values.comment,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                message.success("Thank you for your review!");
                reviewForm.resetFields();
                setIsModalOpen(false);
                fetchReviews();
            } else {
                throw new Error("Failed to submit review.");
            }
        } catch (error) {
            console.error("Error submitting review:", error.response?.data || error.message);
            message.error(error.response?.data?.message || "Failed to submit review.");
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        reviewForm.resetFields();
    };

    const openReviewModal = () => {
        setIsModalOpen(true);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/products/${id}`);
                setProduct(response.data);

                if (response.data.category) {
                    dispatch({ type: "SET_SELECTED_CATEGORY", payload: response.data.category._id || response.data.category });
                    fetchRecommendedProducts(response.data.category._id || response.data.category);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const fetchRecommendedProducts = async (categoryId) => {
        try {
            const response = await axios.get(`/products/recommended?category=${categoryId}`);
            setRecommendedProducts(response.data.slice(0, 4));
        } catch (error) {
            console.error("Error fetching recommended products:", error);
            setRecommendedProducts([]);
        }
    };

    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                message.error("You must be logged in to add items to the cart.");
                return;
            }

            const response = await axios.post(
                "http://localhost:4000/api/cart",
                { productId: product._id, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            dispatch({ type: "ADD_TO_CART", payload: response.data.cart });
            message.success(`${product.name} added to cart!`);
        } catch (error) {
            console.error("Error adding to cart:", error.response?.data?.message || error.message);
            message.error("Failed to add to cart.");
        }
    };

    const handleAddToWishlist = async () => {
        const alreadyWishlisted = (state?.wishlist || []).some((item) => {
            const wishId = typeof item === "object" ? item._id : item;
            return wishId === product._id;
        });

        if (alreadyWishlisted) {
            message.info("This product is already in your wishlist.");
            return;
        }

        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                message.error("You must be logged in to add items to the wishlist.");
                return;
            }

            const response = await axios.post("http://localhost:4000/api/users/wishlist", { productId: product._id }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            dispatch({ type: "ADD_TO_WISHLIST", payload: response.data.wishlist });
            message.success(`${product.name} added to wishlist!`);
        } catch (error) {
            console.error("Error adding to wishlist:", error.response?.data?.message || error.message);
            message.error("Failed to add to wishlist.");
        }
    };

    const handleUpdateQuantity = async (newQuantity) => {
        try {
            setButtonLoading(true);
            const token = localStorage.getItem("authToken");
            if (!token) {
                message.error("You must be logged in to update items in the cart.");
                return;
            }

            if (newQuantity <= 0) {
                await axios.delete(`http://localhost:4000/api/cart/${product._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                dispatch({ type: "REMOVE_FROM_CART", payload: product._id });
                message.success("Item removed from cart");
            } else {
                await axios.put(`http://localhost:4000/api/cart/${product._id}`, { quantity: newQuantity }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                dispatch({ type: "UPDATE_CART_ITEM", payload: { productId: product._id, quantity: newQuantity } });
                message.success("Quantity updated");
            }
        } catch (error) {
            console.error("Error updating quantity:", error.response?.data?.message || error.message);
            message.error("Failed to update cart.");
        } finally {
            setButtonLoading(false);
        }
    };

    if (loading) {
        return <Spin size="large" />;
    }

    if (!product) {
        return <Text>Product not found.</Text>;
    }

    const cartItem = (state?.cart || []).find((item) => item.product && item.product.toString() === product._id);

    const isWishlisted = (state?.wishlist || []).some((item) => {
        const wishId = typeof item === "object" ? item._id : item;
        return wishId === product._id;
    });

    const handleSeeMore = (reviewId) => {
        setExpandedReviews((prevState) => ({
            ...prevState,
            [reviewId]: !prevState[reviewId],
        }));
    };

    return (
        <>
            <div className="product-details">
                <Helmet>
                    <title>{product.name} - Trendy Edge</title>
                    <meta name="description" content={`Details about ${product.name}`} />
                </Helmet>
                <div className="product-image">
                    <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                    <Title level={2}>{product.name}</Title>
                    <Text className="product-price"> ₦ {product.price}</Text>
                    <Text className="product-description">{product.description}</Text>

                    <div className="product-actions">
                        {cartItem ? (
                            <div className="cart-controls">
                                <Button
                                    onClick={() => handleUpdateQuantity(cartItem.quantity - 1)}
                                    disabled={cartItem.quantity <= 1}
                                    loading={buttonLoading}
                                >
                                    -
                                </Button>
                                <span className="cart-quantity">{cartItem.quantity}</span>
                                <Button
                                    onClick={() => handleUpdateQuantity(cartItem.quantity + 1)}
                                    loading={buttonLoading}
                                >
                                    +
                                </Button>
                            </div>
                        ) : (
                            <Button
                                type="primary"
                                onClick={handleAddToCart}
                                loading={buttonLoading}
                                style={{ marginRight: "8px" }}
                                className="add-to-cart"
                            >
                                Add to Cart
                            </Button>
                        )}
                        <Button type="default" onClick={handleAddToWishlist} disabled={isWishlisted}>
                            {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="reviews-section">
                <Title level={3} style={{textAlign: 'center'}}>Customer Reviews</Title>
                {reviews.length > 0 ? (
                    <div className="reviews-container">
                        {reviews.slice(0, 4).map((review) => (
                            <div key={review._id} className="review-card">
                                <Rate allowHalf disabled defaultValue={review.rating} />
                                <p>
                                    {expandedReviews[review._id] ? review.comment : `${review.comment.substring(0, 50)}...`}
                                    {review.comment.length > 50 && (
                                        <Button type="link" onClick={() => handleSeeMore(review._id)}>
                                            {expandedReviews[review._id] ? "See Less" : "See More"}
                                        </Button>
                                    )}
                                </p>
                                <small>— {review.user?.name || "Anonymous"}</small>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No reviews yet. Be the first to write one!</p>
                )}

                <Button type="default" onClick={openReviewModal}>
                    Write a Review
                </Button>

                
            <Modal
                title="Write a Review"
                open={isModalOpen}
                onOk={() => reviewForm.submit()}
                onCancel={handleCancel}
            >

                <Form
                    form={reviewForm}
                    layout="vertical"
                    onFinish={handleReviewSubmit}
                >
                    <Form.Item
                        name="rating"
                        label="Rating"
                        rules={[{ required: true, message: "Please select a rating!" }]}
                    >
                        <Rate />
                    </Form.Item>
                    <Form.Item
                        name="comment"
                        label="Comment"
                        rules={[{ required: true, message: "Please enter your comment!" }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>


            </div>

            {recommendedProducts.length > 0 && (
                <div className="recommended-section">
                    <RecommendedProduct products={recommendedProducts} />
                </div>
            )}
        </>
    );
};

export default ProductDetails;
