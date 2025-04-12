import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        cartItems: [
            {
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
            },
        ],
    },
    { timestamps: true }
);

cartSchema.virtual('totalPrice').get(function() {
    return this.cartItems.reduce((price, item) => price + item.price * item.quantity, 0);
});
const Cart =  mongoose.models.Cart || mongoose.model('Cart', cartSchema);
export default Cart;