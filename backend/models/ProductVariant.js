const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema(
    {
        sku: {
            type: String,
            required: [true, 'SKU is required'],
            unique: true,
            trim: true,
        },
        color: {
            type: String,
            required: [true, 'Color is required'],
            trim: true,
        },
        size: {
            type: String,
            required: [true, 'size is required'],
            trim: true,
        },
        stockAmount: {
            type: Number,
            required: [true, 'stockAmount is required'],
            trim: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product is required'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('ProductVariant', productVariantSchema);