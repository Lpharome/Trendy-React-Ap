import bcrypt from 'bcryptjs';

const enteredPassword = "0850lpharome";
const hashedPassword = "$2b$10$CkuCeEUBZMyiaW5sib5gvulggeZulorPS/L4nK/t5oeUDJs40YFF6"; // Update this with the correct hash

const isMatch = bcrypt.compareSync(enteredPassword, hashedPassword);
console.log("Password Match Result:", isMatch);  // Should log 'true'
