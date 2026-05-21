const productCategoryService = require('../services/productCategoryService');

const createCategory = async (req, res) => {
    try {
        const category = await productCategoryService.createCategory(req.body);

        return res.status(201).json({
            message: 'ProductCategory created successfully',
            category: convertToCategoryResponse(category),
        });
    } catch (error) {
        return handleControllerError(res, error, 'Error creating category');
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await productCategoryService.getCategories();

        return res.status(200).json(categories.map(convertToCategoryResponse));
    } catch (error) {
        return handleControllerError(res, error, 'Error fetching categories');
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await productCategoryService.getCategoryById(req.params.categoryId);

        return res.status(200).json(convertToCategoryResponse(category));
    } catch (error) {
        return handleControllerError(res, error, 'Error fetching category');
    }
};

const updateCategory = async (req, res) => {
    try {
        const category = await productCategoryService.updateCategory(
            req.params.categoryId,
            req.body
        );

        return res.status(200).json({
            message: 'ProductCategory updated successfully',
            category: convertToCategoryResponse(category),
        });
    } catch (error) {
        return handleControllerError(res, error, 'Error updating category');
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await productCategoryService.deleteCategory(req.params.categoryId);

        return res.status(200).json({
            message: 'ProductCategory deleted successfully',
            category: convertToCategoryResponse(category),
        });
    } catch (error) {
        return handleControllerError(res, error, 'Error deleting category');
    }
};

const convertToCategoryResponse = (category) => ({
    categoryId: category.categoryId,
    categoryName: category.categoryName,
});

const handleControllerError = (res, error, fallbackMessage) => {
    return res.status(error.statusCode || 500).json({
        message: error.statusCode ? error.message : fallbackMessage,
        error: error.message,
    });
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    convertToCategoryResponse,
};