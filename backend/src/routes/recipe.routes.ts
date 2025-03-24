import express from 'express';
import { body } from 'express-validator';
import { Recipe } from '../models/recipe.model';
import { AppError } from '../middleware/error.middleware';
import { koruma } from '../middleware/auth.middleware';
import { tarifOnerisiOlustur } from '../utils/gemini.utils';
import { Ingredient } from '../models/ingredient.model';

const router = express.Router();

// Tüm tarifleri getir
router.get('/', async (req, res, next) => {
  try {
    const tarifler = await Recipe.find()
      .populate('malzemeler.malzeme')
      .populate('olusturanKullanici', 'ad soyad')
      .populate('yorumlar.kullanici', 'ad soyad');

    res.status(200).json({
      status: 'success',
      data: {
        tarifler
      }
    });
  } catch (error) {
    next(error);
  }
});

// Yeni tarif ekle
router.post('/',
  koruma,
  [
    body('ad').notEmpty().withMessage('Tarif adı zorunludur'),
    body('aciklama').notEmpty().withMessage('Tarif açıklaması zorunludur'),
    body('malzemeler').isArray().withMessage('Malzemeler bir dizi olmalıdır'),
    body('malzemeler.*.malzeme').isMongoId().withMessage('Geçerli bir malzeme ID\'si giriniz'),
    body('malzemeler.*.miktar').isNumeric().withMessage('Malzeme miktarı sayı olmalıdır'),
    body('malzemeler.*.birim').isIn(['gram', 'ml', 'adet', 'çay kaşığı', 'yemek kaşığı', 'su bardağı'])
      .withMessage('Geçerli bir birim seçiniz'),
    body('hazirlanis').isArray().withMessage('Hazırlanış adımları bir dizi olmalıdır'),
    body('pisirmeSuresi').isNumeric().withMessage('Pişirme süresi sayı olmalıdır'),
    body('hazirlikSuresi').isNumeric().withMessage('Hazırlık süresi sayı olmalıdır'),
    body('porsiyon').isNumeric().withMessage('Porsiyon sayısı sayı olmalıdır'),
    body('zorluk').isIn(['kolay', 'orta', 'zor']).withMessage('Geçerli bir zorluk seviyesi seçiniz'),
    body('kategori').isIn(['ana yemek', 'çorba', 'tatlı', 'salata', 'meze', 'kahvaltı', 'atıştırmalık'])
      .withMessage('Geçerli bir kategori seçiniz')
  ],
  async (req, res, next) => {
    try {
      const yeniTarif = await Recipe.create({
        ...req.body,
        olusturanKullanici: req.user._id
      });

      res.status(201).json({
        status: 'success',
        data: {
          tarif: yeniTarif
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Tarif detayını getir
router.get('/:id', async (req, res, next) => {
  try {
    const tarif = await Recipe.findById(req.params.id)
      .populate('malzemeler.malzeme')
      .populate('olusturanKullanici', 'ad soyad')
      .populate('yorumlar.kullanici', 'ad soyad');

    if (!tarif) {
      throw new AppError('Tarif bulunamadı', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        tarif
      }
    });
  } catch (error) {
    next(error);
  }
});

// Tarif güncelle
router.patch('/:id',
  koruma,
  async (req, res, next) => {
    try {
      const tarif = await Recipe.findById(req.params.id);
      if (!tarif) {
        throw new AppError('Tarif bulunamadı', 404);
      }

      // Sadece oluşturan kullanıcı güncelleyebilir
      if (tarif.olusturanKullanici.toString() !== req.user._id.toString()) {
        throw new AppError('Bu tarifi güncelleme yetkiniz yok', 403);
      }

      const guncelTarif = await Recipe.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      ).populate('malzemeler.malzeme');

      res.status(200).json({
        status: 'success',
        data: {
          tarif: guncelTarif
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Tarif sil
router.delete('/:id',
  koruma,
  async (req, res, next) => {
    try {
      const tarif = await Recipe.findById(req.params.id);
      if (!tarif) {
        throw new AppError('Tarif bulunamadı', 404);
      }

      // Sadece oluşturan kullanıcı silebilir
      if (tarif.olusturanKullanici.toString() !== req.user._id.toString()) {
        throw new AppError('Bu tarifi silme yetkiniz yok', 403);
      }

      await tarif.deleteOne();

      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }
);

// Tarife yorum ekle
router.post('/:id/yorumlar',
  koruma,
  [
    body('yorum').notEmpty().withMessage('Yorum alanı zorunludur'),
    body('puan').isInt({ min: 1, max: 5 }).withMessage('Puan 1-5 arasında olmalıdır')
  ],
  async (req, res, next) => {
    try {
      const tarif = await Recipe.findById(req.params.id);
      if (!tarif) {
        throw new AppError('Tarif bulunamadı', 404);
      }

      const yeniYorum = {
        kullanici: req.user._id,
        yorum: req.body.yorum,
        puan: req.body.puan,
        tarih: new Date()
      };

      tarif.yorumlar.push(yeniYorum);
      await tarif.save();

      res.status(201).json({
        status: 'success',
        data: {
          yorumlar: tarif.yorumlar
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Tarifi beğen
router.post('/:id/begen',
  koruma,
  async (req, res, next) => {
    try {
      const tarif = await Recipe.findById(req.params.id);
      if (!tarif) {
        throw new AppError('Tarif bulunamadı', 404);
      }

      tarif.begeniSayisi += 1;
      await tarif.save();

      res.status(200).json({
        status: 'success',
        data: {
          begeniSayisi: tarif.begeniSayisi
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Tarif önerisi al
router.post('/oner',
  koruma,
  [
    body('malzemeIds').isArray().withMessage('Malzeme ID\'leri bir dizi olmalıdır'),
    body('malzemeIds.*').isMongoId().withMessage('Geçerli malzeme ID\'leri giriniz'),
    body('diyetTercihleri').optional().isArray().withMessage('Diyet tercihleri bir dizi olmalıdır')
  ],
  async (req, res, next) => {
    try {
      const { malzemeIds, diyetTercihleri = [] } = req.body;

      // Malzemeleri bul
      const malzemeler = await Ingredient.find({
        _id: { $in: malzemeIds }
      });

      if (malzemeler.length === 0) {
        throw new AppError('Malzeme bulunamadı', 404);
      }

      // Gemini API ile tarif önerisi al
      const tarifOnerisi = await tarifOnerisiOlustur(malzemeler, diyetTercihleri);

      res.status(200).json({
        status: 'success',
        data: {
          tarifOnerisi
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router; 