import dotenv from "dotenv";

dotenv.config();

console.log("Loaded JWT Secret:", process.env.JWT_SECRET);
