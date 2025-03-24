import mongoose, { Document, Schema } from 'mongoose';

export interface IIngredient extends Document {
  ad: string;
  kategori: string;
  birim: string;
  kalori: number;
  protein: number;
  karbonhidrat: number;
  yag: number;
  lif: number;
  vitaminler: string[];
  mineraller: string[];
  alerjenler: string[];
  diyetUygunlugu: {
    vejetaryen: boolean;
    vegan: boolean;
    glutensiz: boolean;
    keto: boolean;
    paleo: boolean;
  };
  olusturanKullanici: mongoose.Types.ObjectId;
}

const ingredientSchema = new Schema<IIngredient>({
  ad: {
    type: String,
    required: [true, 'Malzeme adı zorunludur'],
    unique: true,
    trim: true
  },
  kategori: {
    type: String,
    required: [true, 'Kategori zorunludur'],
    enum: ['sebze', 'meyve', 'et', 'süt ürünleri', 'tahıl', 'bakliyat', 'baharat', 'diğer']
  },
  birim: {
    type: String,
    required: [true, 'Birim zorunludur'],
    enum: ['gram', 'ml', 'adet', 'çay kaşığı', 'yemek kaşığı', 'su bardağı']
  },
  kalori: {
    type: Number,
    required: [true, 'Kalori değeri zorunludur']
  },
  protein: {
    type: Number,
    required: [true, 'Protein değeri zorunludur']
  },
  karbonhidrat: {
    type: Number,
    required: [true, 'Karbonhidrat değeri zorunludur']
  },
  yag: {
    type: Number,
    required: [true, 'Yağ değeri zorunludur']
  },
  lif: {
    type: Number,
    required: [true, 'Lif değeri zorunludur']
  },
  vitaminler: [{
    type: String,
    enum: ['A', 'B1', 'B2', 'B3', 'B6', 'B12', 'C', 'D', 'E', 'K', 'Folat']
  }],
  mineraller: [{
    type: String,
    enum: ['Demir', 'Kalsiyum', 'Magnezyum', 'Çinko', 'Potasyum', 'Sodyum', 'Fosfor']
  }],
  alerjenler: [{
    type: String,
    enum: ['Süt', 'Yumurta', 'Fıstık', 'Ceviz', 'Soya', 'Buğday', 'Balık', 'Kabuklu Deniz Ürünleri']
  }],
  diyetUygunlugu: {
    vejetaryen: {
      type: Boolean,
      default: true
    },
    vegan: {
      type: Boolean,
      default: true
    },
    glutensiz: {
      type: Boolean,
      default: true
    },
    keto: {
      type: Boolean,
      default: false
    },
    paleo: {
      type: Boolean,
      default: false
    }
  },
  olusturanKullanici: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export const Ingredient = mongoose.model<IIngredient>('Ingredient', ingredientSchema); 