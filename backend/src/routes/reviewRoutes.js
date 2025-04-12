import express from "express";
import {
    getReviewsByProduct,
    createReview,
    deleteReview,
} from "../controllers/reviewController.js";
import { protect } from "../middlewares/authMiddleware.js"; // ✅ Import protect middleware

const router = express.Router();

// ✅ Apply `protect` middleware to review submission
router.route("/:productId").get(getReviewsByProduct).post(protect, createReview);
router.route("/:id").delete(protect, deleteReview);

export default router;
