import { Router } from 'express';
import { protect } from '../middleware/auth';
import { createCoupon, validateCoupon } from '../controllers/couponController';

const router = Router();

router.post('/', protect, createCoupon);
router.post('/validate', validateCoupon);

export default router;