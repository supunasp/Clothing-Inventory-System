const express = require('express');

const {
    createBrand,
    getBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
} = require('../controllers/productBrandController');

const router = express.Router();

router.post('/', createBrand);
router.get('/', getBrands);
router.get('/:brandId', getBrandById);
router.put('/:brandId', updateBrand);
router.delete('/:brandId', deleteBrand);

module.exports = router;