import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

// Get all reviews for a product
export const getReviewsByProduct = asyncHandler(async (req, res) => {
    console.log("Fetching reviews for product:", req.params.productId); 
    
    const reviews = await Review.find({ product: req.params.productId })
        .populate("user", "name") 
        .sort("-createdAt");

    console.log("Retrieved Reviews:", reviews);  // ✅ Logs fetched reviews
    
    if (!reviews.length) {
        console.warn("⚠️ No reviews found for this product.");
    }

    res.json(reviews);
});



// Create a new review
export const createReview = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    console.log("Incoming review request:", req.body);
    console.log("User ID:", req.user?._id);


    // ✅ Verify user is authenticated
    if (!req.user) {
        res.status(401);
        throw new Error("User not authenticated");
    }

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    // ✅ Prevent duplicate reviews
    const existingReview = await Review.findOne({ product: productId, user: req.user._id });
    if (existingReview) {
        res.status(400);
        throw new Error("You have already reviewed this product");
    }

    // ✅ Save new review
    const review = new Review({
        product: productId,
        user: req.user._id,
        rating,
        comment,
    });

    const createdReview = await review.save();
    res.status(201).json(createdReview);
});


// Delete a review
export const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        res.status(404);
        throw new Error("Review not found");
    }

    if (review.user.toString() !== req.user._id) {
        res.status(403);
        throw new Error("You are not authorized to delete this review");
    }

    await review.remove();
    res.json({ message: "Review removed successfully" });

    // ✅ Recalculate product rating after deletion
    const reviews = await Review.find({ product: review.product });
    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    await Product.findByIdAndUpdate(review.product, { rating: avgRating });
});
