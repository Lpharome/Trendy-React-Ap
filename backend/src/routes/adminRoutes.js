import express from 'express';
import { adminLogin, createAdmin, getAdminProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js'; // adminOnly

const router = express.Router();

// Admin Login Route
router.post('/login', adminLogin);

// Create Admin Route
router.post('/create-Admin' , createAdmin); // Ensure protected

// Get Admin Profile Route - Protected
router.get('/profile', protect,  getAdminProfile); //adminOnly,

export default router;
