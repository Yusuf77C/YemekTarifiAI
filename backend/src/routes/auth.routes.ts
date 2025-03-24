import express, { Request, Response, NextFunction } from 'express';
import { check } from 'express-validator';
import { User } from '../models/user.model';
import { AppError } from '../middleware/error.middleware';
import { tokenOlustur } from '../utils/jwt.utils';

const router = express.Router();

// Kayıt olma
router.post('/kayit',
  [
    check('email').isEmail().withMessage('Geçerli bir email adresi giriniz'),
    check('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır'),
    check('ad').notEmpty().withMessage('Ad alanı zorunludur'),
    check('soyad').notEmpty().withMessage('Soyad alanı zorunludur')
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, ad, soyad } = req.body;

      // Email kontrolü
      const mevcutKullanici = await User.findOne({ email });
      if (mevcutKullanici) {
        throw new AppError('Bu email adresi zaten kullanımda', 400);
      }

      // Yeni kullanıcı oluştur
      const yeniKullanici = await User.create({
        email,
        password,
        ad,
        soyad
      });

      // Token oluştur
      const token = tokenOlustur(yeniKullanici);

      res.status(201).json({
        status: 'success',
        token,
        data: {
          user: {
            id: yeniKullanici._id,
            email: yeniKullanici.email,
            ad: yeniKullanici.ad,
            soyad: yeniKullanici.soyad
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Giriş yapma
router.post('/giris',
  [
    check('email').isEmail().withMessage('Geçerli bir email adresi giriniz'),
    check('password').notEmpty().withMessage('Şifre alanı zorunludur')
  ],
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Kullanıcıyı bul
      const kullanici = await User.findOne({ email }).select('+password');
      if (!kullanici) {
        throw new AppError('Geçersiz email veya şifre', 401);
      }

      // Şifreyi kontrol et
      const dogruMu = await kullanici.karsilastirmaYontemi(password);
      if (!dogruMu) {
        throw new AppError('Geçersiz email veya şifre', 401);
      }

      // Token oluştur
      const token = tokenOlustur(kullanici);

      res.status(200).json({
        status: 'success',
        token,
        data: {
          user: {
            id: kullanici._id,
            email: kullanici.email,
            ad: kullanici.ad,
            soyad: kullanici.soyad
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router; 