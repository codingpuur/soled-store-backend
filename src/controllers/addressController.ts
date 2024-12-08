import { Request, Response } from 'express';
import Address from '../models/Address';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Add a new address
// @route   POST /api/addresses
// @access  Private
export const addAddress = async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token is required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };

    const address = await Address.create({
      ...req.body,
      user: decoded.id
    });
    res.status(201).json(address);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Error adding address' });
  }
};

// @desc    Get all addresses for a user
// @route   GET /api/addresses
// @access  Private
export const getAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token is required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };

    const addresses = await Address.find({ user: decoded.id });
    res.json(addresses);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching addresses' });
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
export const updateAddress = async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token is required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };

    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Make sure user owns address
    if (address.user.toString() !== decoded.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedAddress);
  } catch (error) {
    res.status(400).json({ message: 'Error updating address' });
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token is required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };

    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Make sure user owns address
    if (address.user.toString() !== decoded.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await address.deleteOne();
    res.json({ message: 'Address removed' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting address' });
  }
};
