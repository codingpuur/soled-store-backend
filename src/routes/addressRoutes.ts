import { Router } from 'express';
import { protect } from '../middleware/auth';
import { addAddress, deleteAddress, getAddresses, updateAddress } from '../controllers/addressController';


const router = Router();

router.post('/', protect, addAddress);
router.get('/', protect, getAddresses);
router.put('/:id', protect, updateAddress);
router.delete('/:id', protect, deleteAddress);

export default router;
