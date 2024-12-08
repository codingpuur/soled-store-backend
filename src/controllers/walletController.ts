import { Request, Response } from 'express';
import User from '../models/User';

export const addFunds = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate amount is a positive number
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    user.wallet += amount;
    await user.save();

    res.json({ wallet: user.wallet });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getWalletBalance = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ wallet: user.wallet });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};