import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const register = async (req: Request, res: Response) => {
  try {
   
    const { firstName, lastName, email, password, userType, gender } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      userType,
      gender,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '30d'
    });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      gender: user.gender,
      tssMoney: user.tssMoney,
      tssPoints: user.tssPoints,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '30d'
    });

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      gender: user.gender,
      tssMoney: user.tssMoney,
      tssPoints: user.tssPoints,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const detail = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token is required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); 
    }

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      gender: user.gender,
      tssMoney: user.tssMoney,
      tssPoints: user.tssPoints,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      birthdateUpdatedAt: user.birthdateUpdatedAt,
      disableBirthdate: user.disableBirthdate,
      nextTssMoneyToExpire: user.nextTssMoneyToExpire,
      tssMoneyExpiry: user.tssMoneyExpiry
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};