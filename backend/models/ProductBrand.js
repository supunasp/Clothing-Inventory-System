const mongoose = require('mongoose');

const productBrandSchema = new mongoose.Schema(
    {
        brandId: {
            type: String,
            required: [true, 'Brand ID is required'],
            unique: true,
            trim: true,
        },
        brandName: {
            type: String,
            required: [true, 'Brand name is required'],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('ProductBrand', productBrandSchema);