import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phoneNumber: { type: String },
        address: { type: String },
        cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
        isAdmin: { type: Boolean, default: false },
        profileImage: { type: String, default: '/images/profile.jpg' },
        wishlist: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                addedAt: { type: Date },
            },
        ],
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
