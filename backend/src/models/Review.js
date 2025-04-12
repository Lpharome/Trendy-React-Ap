import mongoose from 'mongoose';
import Product from './Product.js'; // ✅ Ensure product reference is correct

const reviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // ✅ Ensure user reference is correct
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5, // ✅ Restrict rating between 1-5 stars
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
