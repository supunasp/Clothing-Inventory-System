const ProductVariant = require('../models/ProductVariant');
const {
    findProductDocumentByProductId,
} = require('./productService');

const createProductVariant = async ({productId, color, size, stockAmount}) => {
    if (!productId || !color || !size || !stockAmount) {
        const error = new Error('productId, color, size and stockAmount are required');
        error.statusCode = 400;
        throw error;
    }

    const existingProduct = await findProductDocumentByProductId(productId);

    if (!existingProduct) {
        const error = new Error('productId does not exist');
        error.statusCode = 400;
        throw error;

    }

    const existingProductVariant = await ProductVariant.findOne({
        product: existingProduct._id,
        color: color,
        size: size
    });
    if (existingProductVariant) {
        const error = new Error('Product Variant with this productId,color and size already exists');
        error.statusCode = 409;
        throw error;

    }

    const productVariant = await ProductVariant.create({
        sku: getSkuValue(productId, color, size),
        product: existingProduct._id,
        color: color,
        size: size,
        stockAmount: stockAmount,
    });

    return ProductVariant.findById(productVariant._id).populate('product');
};

const getProductVariants = async () => {
    return ProductVariant.find()
        .populate('product')
        .sort({createdAt: -1});
};

const getProductVariantsById = async (sku) => {


    const product = await ProductVariant.findOne({sku}).populate('product');

    if (!product) {
        const error = new Error('Product Variant not found');
        error.statusCode = 404;
        throw error;
    }

    return product;
};

const getProductVariantsByProductId = async (productId) => {

    const existingProduct = await findProductDocumentByProductId(productId);

    if (!existingProduct) {
        const error = new Error('productId does not exist');
        error.statusCode = 400;
        throw error;

    }

    const products = await ProductVariant.find({product: existingProduct._id}).populate('product');

    if (!products) {
        const error = new Error('Product Variants not found');
        error.statusCode = 404;
        throw error;
    }

    return products;
};

const updateProductVariantStocks = async (sku, {stockAmount}) => {
    const updateData = {};

    if (stockAmount !== undefined) {
        updateData.stockAmount = stockAmount;
    }

    const updatedProductVariant = await ProductVariant.findOneAndUpdate(
        {sku},
        updateData,
        {
            new: true,
            runValidators: true,
        })
        .populate('product');

    if (!updatedProductVariant) {
        const error = new Error('Product Variant not found');
        error.statusCode = 404;
        throw error;
    }

    return updatedProductVariant;
};

const deleteProductVariant = async (sku) => {
    const deletedProductVariant = await ProductVariant
        .findOneAndDelete({sku})
        .populate('product');

    if (!deletedProductVariant) {
        const error = new Error('Product Variant not found');
        error.statusCode = 404;
        throw error;
    }

    return deletedProductVariant;
};

function getSkuValue(productId, color, size) {
    return productId + "#" + color.trim() + "#" + size.trim();
}

module.exports = {
    createProductVariant,
    getProductVariants,
    getProductVariantsById,
    getProductVariantsByProductId,
    updateProductVariantStocks,
    deleteProductVariant,
};