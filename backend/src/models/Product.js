import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        brand: { type: String},
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
        price: { type: Number, required: true, default: 0 },
        discountPrice: { type: Number, required: true, default: 0 },
        tags: { type: [String], required: true },
        countInStock: { type: Number, required: true, default: 0 },
        image: { type: String, required: true, default: '/images/sample.jpg' },
        rating: { type: Number, required: true, default: 0 },
        numReviews: { type: Number, required: true, default: 0 }
    },
    {timestamps: true}
);

productSchema.virtual('isLowInStock').get(function() {
    return this.countInStock <= 5;
}
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);


export default Product;