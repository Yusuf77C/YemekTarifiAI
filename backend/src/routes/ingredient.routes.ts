import express from 'express';
import { body } from 'express-validator';
import { Ingredient } from '../models/ingredient.model';
import { AppError } from '../middleware/error.middleware';
import { koruma } from '../middleware/auth.middleware';

const router = express.Router();

// Tüm malzemeleri getir
router.get('/', async (req, res, next) => {
  try {
    const malzemeler = await Ingredient.find();
    res.status(200).json({
      status: 'success',
      data: {
        malzemeler
      }
    });
  } catch (error) {
    next(error);
  }
});

// Yeni malzeme ekle
router.post('/',
  koruma,
  [
    body('ad').notEmpty().withMessage('Malzeme adı zorunludur'),
    body('kategori').isIn(['sebze', 'meyve', 'et', 'süt ürünleri', 'tahıl', 'bakliyat', 'baharat', 'diğer'])
      .withMessage('Geçerli bir kategori seçiniz'),
    body('birim').isIn(['gram', 'ml', 'adet', 'çay kaşığı', 'yemek kaşığı', 'su bardağı'])
      .withMessage('Geçerli bir birim seçiniz'),
    body('kalori').isNumeric().withMessage('Kalori değeri sayı olmalıdır'),
    body('protein').isNumeric().withMessage('Protein değeri sayı olmalıdır'),
    body('karbonhidrat').isNumeric().withMessage('Karbonhidrat değeri sayı olmalıdır'),
    body('yag').isNumeric().withMessage('Yağ değeri sayı olmalıdır'),
    body('lif').isNumeric().withMessage('Lif değeri sayı olmalıdır')
  ],
  async (req, res, next) => {
    try {
      const yeniMalzeme = await Ingredient.create({
        ...req.body,
        olusturanKullanici: req.user._id
      });

      res.status(201).json({
        status: 'success',
        data: {
          malzeme: yeniMalzeme
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Malzeme detayını getir
router.get('/:id', async (req, res, next) => {
  try {
    const malzeme = await Ingredient.findById(req.params.id);
    if (!malzeme) {
      throw new AppError('Malzeme bulunamadı', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        malzeme
      }
    });
  } catch (error) {
    next(error);
  }
});

// Malzeme güncelle
router.patch('/:id',
  koruma,
  async (req, res, next) => {
    try {
      const malzeme = await Ingredient.findById(req.params.id);
      if (!malzeme) {
        throw new AppError('Malzeme bulunamadı', 404);
      }

      // Sadece oluşturan kullanıcı güncelleyebilir
      if (malzeme.olusturanKullanici.toString() !== req.user._id.toString()) {
        throw new AppError('Bu malzemeyi güncelleme yetkiniz yok', 403);
      }

      const guncelMalzeme = await Ingredient.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

      res.status(200).json({
        status: 'success',
        data: {
          malzeme: guncelMalzeme
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Malzeme sil
router.delete('/:id',
  koruma,
  async (req, res, next) => {
    try {
      const malzeme = await Ingredient.findById(req.params.id);
      if (!malzeme) {
        throw new AppError('Malzeme bulunamadı', 404);
      }

      // Sadece oluşturan kullanıcı silebilir
      if (malzeme.olusturanKullanici.toString() !== req.user._id.toString()) {
        throw new AppError('Bu malzemeyi silme yetkiniz yok', 403);
      }

      await malzeme.deleteOne();

      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router; 