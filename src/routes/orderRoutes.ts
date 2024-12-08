import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
  createOrder,
  confirmOrder,
  getOrders,
  updateOrderStatus
} from '../controllers/orderController';

const router = Router();

router.post('/', protect, createOrder);
router.post('/:orderId/confirm', protect, confirmOrder);
router.get('/', protect, getOrders);
router.patch('/:orderId/status', protect, updateOrderStatus);

export default router;