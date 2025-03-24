import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';
import { AppError } from '../middleware/error.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'gizli-anahtar-buraya';
const JWT_EXPIRES_IN = '30d';

export const tokenOlustur = (user: IUser): string => {
  return jwt.sign(
    { id: user._id },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const tokenDogrula = (token: string): string => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded.id;
  } catch (error) {
    throw new AppError('Geçersiz veya süresi dolmuş token', 401);
  }
}; 