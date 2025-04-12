import express from 'express';
import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController.js';
import upload from '../middlewares/uploadMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Updated Routes with Image Upload Handling
router.get('/', getCategories);
    // Get all categories
    
router.post("/", upload.single("image"), createCategory);
    // Allow image upload when creating a category

router.route('/:id')
    .get(getCategoryById)
    .put(upload.single('image'), updateCategory) // Allow image upload when updating a category
router.route("/:id").delete(deleteCategory);


export default router;