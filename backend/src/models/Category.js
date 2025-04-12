import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        slug: { type: String, required: true, unique: true },
        image: { type: String, required: false }, // Image field added
    }, { timestamps: true}
);

const Category =  mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
