const express = require('express');

const {
    createProductVariant,
    getProductVariants,
    getProductVariantById,
    updateProductVariant,
    deleteProductVariant,
} = require('../controllers/productVariantController');

const router = express.Router();

router.post('/', createProductVariant);
router.get('/', getProductVariants);
router.get('/:sku', getProductVariantById);
router.put('/:sku', updateProductVariant);
router.delete('/:sku', deleteProductVariant);

module.exports = router;