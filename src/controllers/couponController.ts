import { Request, Response } from 'express';
import Coupon from '../models/Coupon';

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, purchaseAmount } = req.body;
    const coupon = await Coupon.findOne({ 
      code, 
      isActive: true,
      validUntil: { $gt: new Date() },
      minimumPurchase: { $lte: purchaseAmount }
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon' });
    }

    res.json({ discount: coupon.discount });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};