import express from 'express';
import { getAllProducts, addProduct, updateProduct, deleteProduct, getRecommendedProducts, getProductById } from '../controllers/productController.js';
import upload from '../middlewares/uploadMiddleware.js';
import multer from 'multer';


const router = express.Router();

// Routes with file upload handling
router.get('/', getAllProducts);
router.get('/recommended', getRecommendedProducts);
router.get('/:id', getProductById);
router.post('/addProduct', upload.single('image'), addProduct); // Add product with image upload
router.put('/:id', upload.single('image'), updateProduct); // Update product with new image upload
router.delete('/:id', deleteProduct);

export default router;
