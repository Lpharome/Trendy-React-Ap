import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './src/config/db.js';
import userRoutes from './src/routes/userRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import reviewRoutes from './src/routes/reviewRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import { notFound, errorHandler } from './src/middleWares/errorMiddleware.js';
import http from 'http';

//load environment
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json()); // <-- Add this to parse JSON requests
app.use(express.urlencoded({ extended: true })); // <-- Ensures form-data can be read
// Create HTTP server
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (change this in production)
        methods: ["GET", "POST"]
    }
});
export { io };

// Connect to MongoDB
await connectDB().catch((err) => console.error('Failed to connect to MongoDB:', err));

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Error Handling
app.use(notFound);
app.use(errorHandler);


    // WebSocket Connection
    io.on('connection', (socket) => {
        console.log('New WebSocket connection');

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    // Listen for new user registration
    export const notifyNewUser = (user) => {
        io.emit('newUser', user);
    };

    // Listen for new order creation
   // Emit Events
    export const notifyNewOrder = (order) => {
        io.emit('newOrder', order);
    };



const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
