import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { AppError } from './error.middleware';
import { tokenDogrula } from '../utils/jwt.utils';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const koruma = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Token'ı header'dan al
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Lütfen giriş yapın', 401);
    }

    // Token'ı doğrula
    const decoded = tokenDogrula(token);

    // Kullanıcıyı bul
    const user = await User.findById(decoded);
    if (!user) {
      throw new AppError('Bu token\'a sahip kullanıcı artık mevcut değil', 401);
    }

    // Kullanıcıyı request nesnesine ekle
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}; 