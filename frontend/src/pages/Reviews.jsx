import React, { useEffect, useState } from 'react';
import { Input, Button, Rate, message } from 'antd';
import axios from '../services/api'; // Our configured Axios instance
import "./Reviews.scss";

const { TextArea } = Input;

const CustomerReviews = () => {
  // State to store fetched reviews
  const [reviews, setReviews] = useState([]);
  // State for new review text and rating
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  // State for managing submit loading
  const [loading, setLoading] = useState(false);

  // Function to fetch reviews from the backend
  const fetchReviews = async () => {
    try {
      const response = await axios.get('/reviews');
      // Assuming the backend returns an array of review objects which include a "createdAt" field.
      // Sort reviews by createdAt in descending order (most recent first)
      const sortedReviews = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setReviews(sortedReviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      message.error('Error fetching reviews.');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Handler for when the user submits a new review
  const handleSubmitReview = async () => {
    if (!newReview || newRating === 0) {
      message.error('Please enter your review and select a rating.');
      return;
    }
    setLoading(true);
    try {
      // Send the new review to the backend
      await axios.post('/reviews', { review: newReview, rating: newRating });
      message.success('Review submitted successfully!');
      // Clear the form fields
      setNewReview('');
      setNewRating(0);
      // Re-fetch reviews after successful submission
      await fetchReviews();
    } catch (error) {
      console.error('Failed to submit review:', error);
      message.error('Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reviews">
      <h2>Customer Reviews</h2>
      <div className="reviews-grid">
        {/* Display the 4 most recent reviews */}
        {reviews.slice(0, 4).map((review) => (
          <div key={review._id} className="review-card">
            <h3>{review.name}</h3>
            <p className="comments">{review.review}</p>
            <div className="rating">
              <Rate disabled defaultValue={review.rating} />
              <span> {review.rating} stars</span>
            </div>
          </div>
        ))}
      </div>

      {/* Review submission form */}
      <div className="review-form">
        <h3>Write a Review</h3>
        <TextArea
          rows={4}
          placeholder="Write your review here..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
        />
        <div className="rating-input">
          <Rate value={newRating} onChange={(value) => setNewRating(value)} />
          <span>{newRating} stars</span>
        </div>
        <Button
          type="primary"
          onClick={handleSubmitReview}
          loading={loading}
          style={{ marginTop: "16px" }}
        >
          Submit Review
        </Button>
      </div>
    </div>
  );
};

export default CustomerReviews;
