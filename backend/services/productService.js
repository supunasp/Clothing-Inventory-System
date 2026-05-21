const Product = require('../models/Product');
const {
    findCategoryDocumentByCategoryId,
} = require('./productCategoryService');

const createProduct = async ({productId, name, description, category}) => {
    if (!productId || !name || !category) {
        const error = new Error('productId, name, and category are required');
        error.statusCode = 400;
        throw error;
    }

    const existingProduct = await Product.findOne({productId});

    if (existingProduct) {
        const error = new Error('Product with this productId already exists');
        error.statusCode = 409;
        throw error;
    }

    const existingCategory = await findCategoryDocumentByCategoryId(category);

    const product = await Product.create({
        productId: productId,
        name: name,
        description: description,
        category: existingCategory._id,
    });

    return Product.findById(product._id).populate('category');
};

const getProducts = async () => {
    return Product.find()
        .populate('category')
        .sort({createdAt: -1});
};

const getProductById = async (productId) => {
    const product = await Product.findOne({productId}).populate('category');

    if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    return product;
};

const updateProduct = async (productId, {name, description, category}) => {
    const updateData = {};

    if (name !== undefined) {
        updateData.name = name;
    }

    if (description !== undefined) {
        updateData.description = description;
    }

    if (category !== undefined) {
        const existingCategory = await findCategoryDocumentByCategoryId(category);
        updateData.category = existingCategory._id;
    }

    const updatedProduct = await Product.findOneAndUpdate(
        {productId},
        updateData,
        {
            new: true,
            runValidators: true,
        }
    ).populate('category');

    if (!updatedProduct) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    return updatedProduct;
};

const deleteProduct = async (productId) => {
    const deletedProduct = await Product.findOneAndDelete({productId}).populate('category');

    if (!deletedProduct) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    return deletedProduct;
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};