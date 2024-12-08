import { Router } from 'express';
import { createOrder, verifyPayment, createQRCode, closeQRCode } from '../controllers/razorpayPaymentController';

const router = Router();

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.post('/create-qr', createQRCode);
router.post('/close-qr', closeQRCode);
export default router;