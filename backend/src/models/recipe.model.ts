import mongoose, { Document, Schema } from 'mongoose';
import { IIngredient } from './ingredient.model';

export interface IRecipe extends Document {
  ad: string;
  aciklama: string;
  malzemeler: {
    malzeme: mongoose.Types.ObjectId | IIngredient;
    miktar: number;
    birim: string;
  }[];
  hazirlanis: string[];
  pisirmeSuresi: number;
  hazirlikSuresi: number;
  porsiyon: number;
  zorluk: 'kolay' | 'orta' | 'zor';
  kategori: string;
  besinDegerleri: {
    kalori: number;
    protein: number;
    karbonhidrat: number;
    yag: number;
    lif: number;
  };
  diyetUygunlugu: {
    vejetaryen: boolean;
    vegan: boolean;
    glutensiz: boolean;
    keto: boolean;
    paleo: boolean;
  };
  resimUrl?: string;
  olusturanKullanici: mongoose.Types.ObjectId;
  begeniSayisi: number;
  yorumlar: {
    kullanici: mongoose.Types.ObjectId;
    yorum: string;
    puan: number;
    tarih: Date;
  }[];
}

const recipeSchema = new Schema<IRecipe>({
  ad: {
    type: String,
    required: [true, 'Tarif adı zorunludur'],
    trim: true
  },
  aciklama: {
    type: String,
    required: [true, 'Tarif açıklaması zorunludur']
  },
  malzemeler: [{
    malzeme: {
      type: Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true
    },
    miktar: {
      type: Number,
      required: [true, 'Malzeme miktarı zorunludur']
    },
    birim: {
      type: String,
      required: [true, 'Malzeme birimi zorunludur'],
      enum: ['gram', 'ml', 'adet', 'çay kaşığı', 'yemek kaşığı', 'su bardağı']
    }
  }],
  hazirlanis: [{
    type: String,
    required: [true, 'Hazırlanış adımları zorunludur']
  }],
  pisirmeSuresi: {
    type: Number,
    required: [true, 'Pişirme süresi zorunludur']
  },
  hazirlikSuresi: {
    type: Number,
    required: [true, 'Hazırlık süresi zorunludur']
  },
  porsiyon: {
    type: Number,
    required: [true, 'Porsiyon sayısı zorunludur']
  },
  zorluk: {
    type: String,
    required: [true, 'Zorluk seviyesi zorunludur'],
    enum: ['kolay', 'orta', 'zor']
  },
  kategori: {
    type: String,
    required: [true, 'Kategori zorunludur'],
    enum: ['ana yemek', 'çorba', 'tatlı', 'salata', 'meze', 'kahvaltı', 'atıştırmalık']
  },
  besinDegerleri: {
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
    }
  },
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
  resimUrl: {
    type: String
  },
  olusturanKullanici: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  begeniSayisi: {
    type: Number,
    default: 0
  },
  yorumlar: [{
    kullanici: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    yorum: {
      type: String,
      required: true
    },
    puan: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    tarih: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

export const Recipe = mongoose.model<IRecipe>('Recipe', recipeSchema); 