import { Router } from 'express';
import { register, login ,detail} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/detail',protect, detail);

export default router;