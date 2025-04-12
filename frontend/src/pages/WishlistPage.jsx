import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/Appcontext";
import { Typography, message, Button } from "antd";
import ProductCard from "../components/ProductCard";
import "./WishlistPage.scss";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

const WishlistPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const { wishlist } = state;
  const navigate = useNavigate();

  // Save wishlist to localStorage whenever it updates
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Load wishlist from localStorage on mount + sync with API if user logged in
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist"));
    if (!state.user && savedWishlist) {
      dispatch({ type: "SET_WISHLIST", payload: savedWishlist });
    }

    const fetchWishlist = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/users/wishlist", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });

        if (JSON.stringify(response.data) !== JSON.stringify(wishlist)) {
          dispatch({ type: "SET_WISHLIST", payload: response.data });
          localStorage.setItem("wishlist", JSON.stringify(response.data));
        }
      } catch (error) {
        console.error("❌ Error fetching wishlist:", error);
      }
    };

    if (state.user) {
      fetchWishlist();
    }
  }, [state.user, dispatch]);

  // Handle removing a product from wishlist
  const handleRemove = async (productId) => {
    try {
      await axios.delete(`http://localhost:4000/api/users/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });

      const updatedWishlist = wishlist.filter((item) => item.product._id !== productId);
      dispatch({ type: "SET_WISHLIST", payload: updatedWishlist });
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

      message.success("Product removed from wishlist");
    } catch (error) {
      message.error("Failed to remove product from wishlist");
    }
  };

  // Remove duplicates
  const uniqueWishlist = [
    ...new Map(
      wishlist
        .filter((item) => item?.product && item.product._id) // ✅ Only valid items
        .map((item) => [item.product._id, item])
    ).values(),
  ];

  

  return (
    <div className="wishlist-page">
      <Helmet>
        <title>Wishlist - Trendy Edge</title>
        <meta name="description" content="Explore your wishlist." />
      </Helmet>

      <Title level={2}>Your Wishlist</Title>

      {uniqueWishlist.length === 0 ? (
        <div className="empty-wishlist">
          <img
            src="/empty-wishlist.png"
            alt="No Wishlist Items"
            className="empty-wishlist-img"
          />
          <p>Your wishlist is empty. Start exploring and add items you love!</p>
          <Button type="primary" onClick={() => navigate("/shop")}>
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {uniqueWishlist.map((item, index) => (
            <div key={`${item._id}-${index}`} className="wishlist-item">
              <ProductCard product={item.product} showWishlistIcon={false} />
              <Button
                danger
                onClick={() => handleRemove(item.product._id)}
                className="remove-wishlist-btn"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
