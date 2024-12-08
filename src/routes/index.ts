import { Router } from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import walletRoutes from './walletRoutes';
import couponRoutes from './couponRoutes';
import orderRoutes from './orderRoutes';
import paymentRoutes from './paymentRoutes';
import addressRoutes from './addressRoutes';
import razorpayPaymentRoutes from './razorpayPaymentRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/wallet', walletRoutes);
router.use('/coupons', couponRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/address', addressRoutes);
router.use('/razorpay', razorpayPaymentRoutes);
export default router;