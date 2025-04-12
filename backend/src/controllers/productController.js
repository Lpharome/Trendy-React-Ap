import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import path from 'path';

// Get all products
export const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products.' });
    }
});

// Add a new product
export const addProduct = asyncHandler(async (req, res) => {

    try {
        const {
            name,
            description,
            brand,
            category,
            price,
            discountPrice,
            tags,
            countInStock,
            rating,
            numReviews
        } = req.body;

        if (!name || !description || !brand || !category || !price) {
            return res.status(400).json({ message: 'All required fields must be filled.' });
        }

        let categoryId;
        try {
            categoryId = new mongoose.Types.ObjectId(category);
        } catch (error) {
            return res.status(400).json({ message: 'Invalid category ID.' });
        }

        const parsedPrice = parseFloat(price);
        const parsedDiscountPrice = discountPrice ? parseFloat(discountPrice) : 0;
        const parsedCountInStock = parseInt(countInStock) || 0;
        const parsedRating = parseFloat(rating) || 0;
        const parsedNumReviews = parseInt(numReviews) || 0;

        if (isNaN(parsedPrice) || isNaN(parsedDiscountPrice) || isNaN(parsedCountInStock)) {
            return res.status(400).json({ message: 'Invalid numeric values for price, discountPrice, or countInStock.' });
        }

        const imagePath = req.file ? `/uploads/${req.file.filename}` : '/images/sample.jpg';
        const fullImageUrl = `${req.protocol}://${req.get('host')}${imagePath}`;

        const newProduct = new Product({
            name,
            description,
            brand,
            category: categoryId,
            price: parsedPrice,
            discountPrice: parsedDiscountPrice,
            tags: tags ? tags.split(',') : [],
            countInStock: parsedCountInStock,
            image :fullImageUrl,
            rating: parsedRating,
            numReviews: parsedNumReviews
        });

        await newProduct.save();

        // 🔹 Fetch the full product with populated category before sending response
        const populatedProduct = await Product.findById(newProduct._id).populate('category');

        res.status(201).json(populatedProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Failed to add product.' });
    }
});


// Update a product
export const updateProduct = asyncHandler(async (req, res) => {
    try {
        const { category, price, discountPrice, countInStock, rating, numReviews } = req.body;
        const updateData = { ...req.body };

        // Convert category to ObjectId if provided
        if (category) {
            try {
                updateData.category = new mongoose.Types.ObjectId(category);
            } catch (error) {
                return res.status(400).json({ message: 'Invalid category ID.' });
            }
        }

        // Convert numeric fields safely
        if (price) updateData.price = parseFloat(price);
        if (discountPrice) updateData.discountPrice = parseFloat(discountPrice);
        if (countInStock) updateData.countInStock = parseInt(countInStock);
        if (rating) updateData.rating = parseFloat(rating);
        if (numReviews) updateData.numReviews = parseInt(numReviews);

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true } // Return the updated product
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Failed to update product.' });
    }
});

// Delete a product
export const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        await product.deleteOne();
        res.json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Failed to delete product.' });
    }
});


export const getRecommendedProducts = asyncHandler(async (req, res) => {
    const { category } = req.query;

    try {
        let query = {};

        // Convert category to ObjectId if provided
        if (category && category !== "default") {
            query.category = new mongoose.Types.ObjectId(category);
        }

        // Fetch recommended products
        const recommendedProducts = await Product.find(query).sort({ rating: -1 }).limit(5);

        res.json(recommendedProducts);
    } catch (error) {
        console.error("Error fetching recommended products:", error);
        res.status(500).json({ message: "Failed to fetch recommended products." });
    }
});

export const getProductById = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category'); // Populate category details

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ message: 'Failed to fetch product.' });
    }
});


export default {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getRecommendedProducts,
    getProductById
};
