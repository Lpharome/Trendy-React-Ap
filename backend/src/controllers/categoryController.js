import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import mongoose from 'mongoose'
import path from 'path';
import multer from "multer";

const upload = multer();


// Get all categories
export const getCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find().populate('parentCategory', 'name');
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Failed to fetch categories.' });
    }
});

// Get a single category by ID
export const getCategoryById = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate('parentCategory', 'name');

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        res.json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ message: 'Failed to fetch category.' });
    }
});

// Create a new category

export const createCategory = asyncHandler(async (req, res) => {
    console.log("Incoming Raw Form Data:", req.body); // Debugging log

    const name = req.body.name;
    const slug = req.body.slug;

    if (!name || !slug) {
        return res.status(400).json({ message: "Name and slug are required." });
    }

    let imageUrl = "";
    if (req.file) {
        imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const newCategory = new Category({ name, slug, image: imageUrl });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
});




// Update an existing category
export const updateCategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        // Prevent duplicate slugs on update
        if (updates.slug) {
            const existingCategory = await Category.findOne({ slug: updates.slug });
            if (existingCategory && existingCategory._id.toString() !== id) {
                return res.status(400).json({ message: 'Another category with this slug already exists.' });
            }
        }

        // Handle image upload if a new file is provided
        if (req.file) {
            const imagePath = `/uploads/${req.file.filename}`;
            const fullImageUrl = `${req.protocol}://${req.get("host")}${imagePath}`;
            updates.image = fullImageUrl;
        }

        Object.assign(category, updates);
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Failed to update category.' });
    }
});


// Delete a category
export const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: "Category not found." });
        }

        await category.deleteOne();
        res.json({ message: "Category deleted successfully." });

    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ message: "Failed to delete category." });
    }
});


