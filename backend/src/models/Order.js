import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
        orderItems:[
            {
                name: {type: String , required: true },
                quantity: {type: Number , required: true },
                price: {type: Number , required: true },
                product: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product'}
            },
        ],
        coupon: {
            couponCode: {type: String},
            discount: {type: Number},
        },
        shippingStatus: {type: String, default: 'Not Shipped'},
        trackingNumber: {type: String},
        isArchieved: {type: Boolean, default: false},
        carrier: {type: String},
        shippingAddress: {
            address: {type: String , required: true },
            city: {type: String , required: true },
            postalCode: {type: String , required: true },
            country: {type: String , required: true },
            phoneNumber: { type: String, required: true }
        },
        paymentMethod: {type: String , required: true },
        paymentResult: {
            id: {type: String },
            status: {type: String },
            update_time: {type: String },
            email_address: {type: String }
            },
        totalPrice: {type: Number , required: true },
        isPaid: {type: Boolean , required: true , default: false },
        PaidAt: {type: Date },
        isDelivered: {type: Boolean , required: true , default: false },
        deliveredAt: {type: Date }
    },
    {timestamps: true}
);

const Order =  mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;