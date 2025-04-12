import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    console.log("Authorization Header:", req.headers.authorization);
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Extract token after "Bearer"
            

            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
            

            req.user = await User.findById(decoded.id).select('-password');


            if (!req.user) {
                throw new Error("User not found");
            }

            next();
        } catch (error) {
            // console.error("JWT Verification Error:", error.message);
            res.status(401).json({ message: "Invalid or expired token" });
        }
    } else {
        res.status(401).json({ message: "Authorization token missing" });
    }
});


export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};



export default {protect, authenticate};
