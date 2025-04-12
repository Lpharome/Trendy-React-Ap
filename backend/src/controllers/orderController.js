import asyncHandler from 'express-async-handler'
import Order from '../models/Order.js'
import { notifyNewOrder } from '../../index.js';
import jwt from 'jsonwebtoken';

//Create Order
export const createOrder = asyncHandler(async (req, res) => {
    const userId = req.user._id; // ✅ Use extracted user ID from middleware
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No Order Items');
    }

    

    if (!shippingAddress.phoneNumber) {
        res.status(400);
        throw new Error("Phone number is required");
    }

    const order = new Order({
        orderItems,
        user: userId, // ✅ Use authenticated user ID
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    });

    const createdOrder = await order.save();
    if (!createdOrder) {
    throw new Error("Order could not be saved to database.");
    }
    res.status(201).json(createdOrder);
    console.log("✅ Created Order:", createdOrder);

    notifyNewOrder(createdOrder); // ✅ Send WebSocket notification
    res.status(201).json(createdOrder);
});



//Get User Oder
 export const getUserOrderHistory = async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id });
      res.json(orders);
    } catch (error) {
      console.error("Error fetching order history:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  



//Get all Orders
export const getOrders = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.isAdmin) { // ✅ Restrict access to admin users
        res.status(403);
        throw new Error("Access denied. Admins only.");
    }

    const orders = await Order.find({})
        .populate('user', 'name')
        .sort({ isPaid: 1, createdAt: -1 });

    res.json(orders);
});



//Update Order to Delivered
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if(order){
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    }else{
        res.status(404);
        throw new Error('Order not found');
    }
});

//Update Order to Paid
export const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    if (order.isPaid) { // ✅ Prevent duplicate payment updates
        res.status(400);
        throw new Error("Order is already marked as paid.");
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
});

export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error("Order not found.");
    }
});

// PUT /api/orders/:id/track
export const trackOrder = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      const statusSteps = ["Processing", "Shipped", "In Transit", "Delivered"];
      const currentIndex = statusSteps.indexOf(order.shippingStatus);
  
      if (currentIndex < statusSteps.length - 1) {
        order.shippingStatus = statusSteps[currentIndex + 1];
      }
  
      await order.save();
      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
