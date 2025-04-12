import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// ✅ Add to Cart
export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    console.log("User ID:", req.user ? req.user._id : "No user detected");

    try {
        // ✅ Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            console.error("❌ Product not found:", productId);
            return res.status(404).json({ message: "Product not found" });
        }

        // ✅ Find existing cart or create a new one
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            console.warn("⚠️ No existing cart found, creating a new one...");
            cart = new Cart({ user: req.user._id, cartItems: [] });
        }

        console.log("📌 Cart Items Before Update:", cart.cartItems);

        // ✅ Update existing product or add new item
        const existingItemIndex = cart.cartItems.findIndex(item => item.product.toString() === productId);

        if (existingItemIndex !== -1) {
            // Update quantity for existing item
            cart.cartItems[existingItemIndex].quantity += quantity;
            console.log(`🛒 Updated quantity: ${cart.cartItems[existingItemIndex].quantity}`);
        } else {
            // Add new product
            cart.cartItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity
            });
            console.log("✅ Added new item to cart:", product.name);
        }

        // ✅ Save cart & confirm update
        await cart.save();
        console.log("📌 Cart After Save:", await Cart.findById(cart._id));

        res.status(201).json({ message: "Product added to cart", cart });
    } catch (error) {
        console.error("❌ Error adding to cart:", error);
        res.status(500).json({ message: "Error adding to cart", error: error.message });
    }
});

// ✅ Get Cart Data
export const getCart = asyncHandler(async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');

        if (!cart) {
            return res.status(200).json({ cartItems: [], totalPrice: 0 }); // ✅ Return empty cart structure
        }

        res.json(cart);
    } catch (error) {
        console.error('❌ Error fetching cart:', error);
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
});

// ✅ Update Cart Item Quantity
export const updateCartItem = asyncHandler(async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.cartItems.find(item => item.product.toString() === req.params.id); // FIXED
        if (!item) return res.status(404).json({ message: 'Product not found in cart' });

        // ✅ Validate quantity before updating
        const newQuantity = Number(req.body.quantity);
        if (isNaN(newQuantity) || newQuantity < 1) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        item.quantity = newQuantity;
        await cart.save();

        res.json({ message: 'Quantity updated', cart });
    } catch (error) {
        console.error("❌ Error updating quantity:", error);
        res.status(500).json({ message: 'Error updating quantity' });
    }
});


// ✅ Remove from Cart
export const removeFromCart = asyncHandler(async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        console.log("🗑️ Cart Items Before Removal:", cart.cartItems);

        // ✅ Remove specific product
        cart.cartItems = cart.cartItems.filter(item => item.product.toString() !== req.params.id); // FIXED
        cart.markModified("cartItems"); // 🔥 Ensures MongoDB recognizes the change
        await cart.save();

        console.log("✅ Cart After Removal:", await Cart.findById(cart._id));

        res.json({ message: 'Item removed', cart });
    } catch (error) {
        console.error("❌ Error removing item:", error);
        res.status(500).json({ message: 'Error removing item' });
    }
});

