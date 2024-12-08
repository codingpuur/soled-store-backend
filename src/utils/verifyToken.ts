import { Request } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
}

export const verifyToken = async (req: Request): Promise<{ userId: string | null }> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return { userId: null };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as TokenPayload;
 
    return { userId: decoded.id };

  } catch (error) {
    return { userId: null };
  }
};
