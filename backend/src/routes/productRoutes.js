import express from 'express';
import {
  getAllProducts,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} from '../controllers/productController.js';
import {
  validateCreateProduct,
  validateUpdateProduct,
} from '../middleware/validation.js';

const router = express.Router();

/**
 * IMPORTANT: Route order matters in Express!
 * Specific, literal routes must come BEFORE dynamic routes (:param routes)
 */

/**
 * GET /api/catalog - Get all products
 */
router.get('/catalog', getAllProducts);

/**
 * GET /api/catalog/category/:category - Get products by category
 * MUST come before /catalog/:id to avoid parameter collision
 */
router.get('/catalog/category/:category', getProductsByCategory);

/**
 * GET /api/catalog/product/:id - Get single product detail by ID
 * MUST come before /catalog/:id to avoid parameter collision
 */
router.get('/catalog/product/:id', getProductDetail);

/**
 * POST /api/catalog - Create new product
 */
router.post('/catalog', validateCreateProduct, createProduct);

/**
 * PUT /api/catalog/:id - Update product by ID
 */
router.put('/catalog/:id', validateUpdateProduct, updateProduct);

/**
 * DELETE /api/catalog/:id - Delete product by ID
 */
router.delete('/catalog/:id', deleteProduct);

export default router;
