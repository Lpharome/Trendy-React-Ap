
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { notifyNewUser } from '../../index.js'

// Register User
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check for existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    

    if (user) {
        
        notifyNewUser(user); // Send WebSocket notification

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user.id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
    try {
        console.log("Login Request Received:", req.body); // Debugging

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find the user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        console.log("User Found:", user.email); // Debugging

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        console.log("Login Successful:", token); // Debugging

        // Return user details and token
        res.json({ user, token });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Create Admin User
export const createAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const newAdmin = await User.create({
            name,
            email,
            password: hashedPassword,
            isAdmin: true,
            profileImage: '/images/profile.jpg',
        });

        res.status(201).json({ message: 'Admin user created successfully', user: newAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin user', error: error.message });
    }
});

// Admin Login
export const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        const adminUser = await User.findOne({ email, isAdmin: true });

        if (!adminUser) {
            return res.status(404).json({ message: 'Admin user not found.' });
        }

        // Correct password comparison
        const isMatch = bcrypt.compareSync(password, adminUser.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        const token = jwt.sign(
            { id: adminUser._id, isAdmin: true },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});



// Get User Profile
export const getUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user?.id).populate('wishlist.product', 'name price imageUrl'); 

    if (user) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
            profileImage: user.profileImage,
            isAdmin: user.isAdmin,
            wishlist: user.wishlist,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// Add to Wishlist
export const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    await User.updateOne(
        { _id: req.user._id },
        { $addToSet: { wishlist: { product: productId, addedAt: Date.now() } } } // ✅ Prevents duplicates efficiently
    );

    res.status(201).json({ message: "Product added to wishlist" });
});


// Remove from Wishlist
export const removeFromWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // ✅ Ensure wishlist update is properly saved in DB
    user.wishlist = user.wishlist.filter((w) => w.product.toString() !== productId);
    await user.save();

    console.log("Updated Wishlist in DB:", user.wishlist); // ✅ Debugging log
    res.json({ message: "Product removed from wishlist", wishlist: user.wishlist });
});


//get wishlist
export const getWishlist = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("wishlist.product");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Wishlist Data from DB:", user.wishlist); // ✅ Debug log

        res.json(user.wishlist);
    } catch (error) {
        console.error("❌ Error fetching wishlist:", error); // ✅ Logs errors for debugging
        res.status(500).json({ message: "Server error fetching wishlist" });
    }
});





// Update Profile Image
export const updateProfileImage = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.profileImage = `/uploads/${req.file.filename}`;
        user.markModified('profileImage');
        console.log('Uploaded File:', req.file);
        console.log('Updating User profile :', user.profileImage);

        const updatedUser = await user.save();
        console.log('Updated User profile :', updatedUser);
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: updatedUser.phoneNumber, 
            address: updatedUser.address, //
            profileImage: user.profileImage,

        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Update User Profile
export const updateUserProfile = asyncHandler(async (req, res) => {
    console.log('updateUserProfile hit');
    console.log('User ID from request:', req.user?.id); // Debugging

    const user = await User.findById(req.user?.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.address = req.body.address || user.address;

    if (req.body.password) {
        user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();
    
    res.json({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
        profileImage: updatedUser.profileImage,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser.id),
    });
});


// Get All Users

// @desc Get all users (Admin Only)
// @route GET /api/users
// @access Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password -cart'); // Exclude sensitive fields

    res.json(
        users.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.isAdmin ? 'Admin' : 'User', // ✅ Convert isAdmin to role
            profileImage: user.profileImage,
        }))
    );
});


// Get User by ID
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Delete User
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.remove();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

//getAdmin
export const getAdminProfile = asyncHandler(async (req, res) => {
    try {
        const admin = await User.findOne({ isAdmin: true });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin profile' });
    }
});

