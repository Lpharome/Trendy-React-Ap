import bcrypt from 'bcryptjs';

const password = "0850lpharome";
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);

console.log("New Hashed Password:", hashedPassword);
