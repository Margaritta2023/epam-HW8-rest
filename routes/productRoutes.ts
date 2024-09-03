import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  partialUpdateProduct,
  deleteProduct
} from '../controllers/productController';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.patch('/:id/manufacturer/address', partialUpdateProduct);
router.delete('/:id', deleteProduct);

export default router;
