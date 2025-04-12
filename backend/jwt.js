import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();  // Load .env

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTUzNDg4ZDk4M2RhNzAxODViOWVkMCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc0MzI3OTczNywiZXhwIjoxNzQzMzY2MTM3fQ.VeO_fLZY0u2MoUVTVmZix0xxmjQV7Dh6t_RG04nyREI";

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Verified:", decoded);
} catch (error) {
    console.error("❌ Verification Failed:", error.message);
}


const expDate = new Date(1743366137 * 1000);
console.log("Token expires at:", expDate.toISOString());

