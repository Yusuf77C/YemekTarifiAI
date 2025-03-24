import { GoogleGenerativeAI } from '@google/generative-ai';
import { IIngredient } from '../models/ingredient.model';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ITarifOnerisi {
  ad: string;
  aciklama: string;
  malzemeler: {
    malzeme: string;
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
}

export const tarifOnerisiOlustur = async (
  malzemeler: IIngredient[],
  diyetTercihleri: string[] = []
): Promise<ITarifOnerisi> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const malzemeListesi = malzemeler.map(m => `${m.ad} (${m.kategori})`).join(', ');
  const diyetTercihleriMetni = diyetTercihleri.length > 0 
    ? `Diyet tercihleri: ${diyetTercihleri.join(', ')}` 
    : '';

  const prompt = `
    Aşağıdaki malzemelerle bir yemek tarifi oluştur:
    ${malzemeListesi}
    ${diyetTercihleriMetni}

    Lütfen tarifi aşağıdaki JSON formatında döndür:
    {
      "ad": "Tarif Adı",
      "aciklama": "Kısa tarif açıklaması",
      "malzemeler": [
        {
          "malzeme": "Malzeme adı",
          "miktar": sayı,
          "birim": "birim"
        }
      ],
      "hazirlanis": ["Adım 1", "Adım 2", ...],
      "pisirmeSuresi": sayı,
      "hazirlikSuresi": sayı,
      "porsiyon": sayı,
      "zorluk": "kolay/orta/zor",
      "kategori": "ana yemek/çorba/tatlı/salata/meze/kahvaltı/atıştırmalık",
      "besinDegerleri": {
        "kalori": sayı,
        "protein": sayı,
        "karbonhidrat": sayı,
        "yag": sayı,
        "lif": sayı
      },
      "diyetUygunlugu": {
        "vejetaryen": boolean,
        "vegan": boolean,
        "glutensiz": boolean,
        "keto": boolean,
        "paleo": boolean
      }
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // JSON string'i parse et
    const tarifOnerisi = JSON.parse(text);
    
    // Besin değerlerini hesapla
    tarifOnerisi.besinDegerleri = besinDegerleriniHesapla(tarifOnerisi.malzemeler, malzemeler);
    
    return tarifOnerisi;
  } catch (error) {
    console.error('Gemini API Hatası:', error);
    throw new Error('Tarif oluşturulurken bir hata oluştu');
  }
};

const besinDegerleriniHesapla = (
  tarifMalzemeleri: { malzeme: string; miktar: number; birim: string }[],
  mevcutMalzemeler: IIngredient[]
): { kalori: number; protein: number; karbonhidrat: number; yag: number; lif: number } => {
  let toplamKalori = 0;
  let toplamProtein = 0;
  let toplamKarbonhidrat = 0;
  let toplamYag = 0;
  let toplamLif = 0;

  tarifMalzemeleri.forEach(tarifMalzeme => {
    const malzeme = mevcutMalzemeler.find(m => m.ad.toLowerCase() === tarifMalzeme.malzeme.toLowerCase());
    if (malzeme) {
      // Birim dönüşümü yapılabilir (örneğin: gram -> ml)
      const miktarCarpani = birimDonusumCarpani(tarifMalzeme.birim, malzeme.birim);
      const miktar = tarifMalzeme.miktar * miktarCarpani;

      toplamKalori += (malzeme.kalori * miktar) / 100;
      toplamProtein += (malzeme.protein * miktar) / 100;
      toplamKarbonhidrat += (malzeme.karbonhidrat * miktar) / 100;
      toplamYag += (malzeme.yag * miktar) / 100;
      toplamLif += (malzeme.lif * miktar) / 100;
    }
  });

  return {
    kalori: Math.round(toplamKalori),
    protein: Math.round(toplamProtein),
    karbonhidrat: Math.round(toplamKarbonhidrat),
    yag: Math.round(toplamYag),
    lif: Math.round(toplamLif)
  };
};

const birimDonusumCarpani = (hedefBirim: string, kaynakBirim: string): number => {
  // Basit birim dönüşüm çarpanları
  const donusumler: { [key: string]: { [key: string]: number } } = {
    'gram': {
      'ml': 1,
      'adet': 1,
      'çay kaşığı': 5,
      'yemek kaşığı': 15,
      'su bardağı': 240
    },
    'ml': {
      'gram': 1,
      'adet': 1,
      'çay kaşığı': 5,
      'yemek kaşığı': 15,
      'su bardağı': 240
    }
  };

  return donusumler[kaynakBirim]?.[hedefBirim] || 1;
}; 