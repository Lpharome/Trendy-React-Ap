import express from 'express';
import {
    registerUser,
    getUserProfile,
    addToWishlist,
    loginUser,
    updateUserProfile,
    getUserById,
    deleteUser,
    removeFromWishlist,
    getUsers,
    updateProfileImage,
    getWishlist,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js'; //adminOnly
import upload from '../middlewares/uploadMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (for authenticated users)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/profile-uploadimage', protect, upload.single('profileImage'), updateProfileImage);
router.post('/wishlist', protect, addToWishlist);
router.get('/wishlist', protect, getWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist); // ✅ Ensures correct parameter


// Admin-only routes (accessible only by admins)
router.get('/',  getUsers);         // Get all users - admin only
router.get('/:id', protect, getUserById);   // Get user by ID - admin only adminOnly
router.delete('/:id', protect,  deleteUser); // Delete user - admin only adminOnly,

export default router;
