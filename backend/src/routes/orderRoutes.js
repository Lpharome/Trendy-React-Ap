import express from 'express';
import { createOrder, 
    getUserOrderHistory, 
    getOrders, 
    updateOrderToDelivered,
    updateOrderToPaid,
    getOrderById,
    trackOrder
     } from '../controllers/orderController.js';

import { protect , authenticate } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post( '/' , protect ,createOrder);
router.get("/", protect, getOrders); // ✅ Ensure only authenticated users can access
router.get('/history', protect, getUserOrderHistory);
// protect
router.put("/:id/pay", protect, updateOrderToPaid); // ✅ Protected
router.put("/:id/deliver", authenticate, updateOrderToDelivered); // ✅ Protected
router.get("/:id", protect, getOrderById); // ✅ Fetch single order
router.put('/:id/track', protect, trackOrder);


export default router;