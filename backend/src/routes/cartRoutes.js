import express from 'express';
import { addToCart, getCart, updateCartItem, removeFromCart } from '../controllers/cartContoller.js';
import { protect } from '../middlewares/authMiddleware.js';
import validateObjectId from '../middlewares/validateObjectId.js';


const router = express.Router();


router.get('/',protect, getCart);       // ✅ Fetch cart
router.post('/', protect, addToCart);    // ✅ Add item to cart
router.delete('/:id', protect, removeFromCart); // ✅ Remove item
router.put('/:id', protect, validateObjectId, updateCartItem); // ✅ Update item in cart

export default router;