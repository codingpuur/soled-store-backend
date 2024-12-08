import { Router } from 'express';
import { protect } from '../middleware/auth';
import { addFunds, getWalletBalance } from '../controllers/walletController';

const router = Router();

router.post('/add-funds', protect, addFunds);
router.get('/balance', protect, getWalletBalance);

export default router;