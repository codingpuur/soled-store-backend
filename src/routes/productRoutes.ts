import { Router } from 'express';
import { protect } from '../middleware/auth';
import { addProduct, getProducts, getProductById } from '../controllers/productController';

const router = Router();

router.post('/', protect, addProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);

export default router;