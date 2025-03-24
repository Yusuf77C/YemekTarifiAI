// Kullanıcı tipleri
export interface Kullanici {
  _id: string;
  ad: string;
  soyad: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Malzeme tipleri
export interface Malzeme {
  _id: string;
  ad: string;
  kategori: string;
  birim: string;
  besinDegerleri: {
    kalori: number;
    protein: number;
    karbonhidrat: number;
    yag: number;
    lif: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Tarif tipleri
export interface TarifMalzeme {
  malzeme: string | Malzeme;
  miktar: number;
  birim: string;
}

export interface Yorum {
  _id: string;
  kullanici: string | Kullanici;
  yorum: string;
  puan: number;
  tarih: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tarif {
  _id: string;
  ad: string;
  aciklama: string;
  kategori: string;
  pisirmeSuresi: number;
  zorluk: 'kolay' | 'orta' | 'zor';
  malzemeler: {
    malzeme: string;
    miktar: number;
    birim: string;
  }[];
  hazirlanisi: string[];
  besinDegerleri: {
    kalori: number;
    protein: number;
    karbonhidrat: number;
    yag: number;
    lif: number;
  };
  diyetTercihleri: string[];
  resimUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// API yanıt tipleri
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Form tipleri
export interface GirisFormu {
  email: string;
  password: string;
}

export interface KayitFormu extends GirisFormu {
  ad: string;
  soyad: string;
}

export interface TarifFormu {
  baslik: string;
  aciklama: string;
  malzemeler: {
    malzemeId: string;
    miktar: number;
    birim: string;
  }[];
  hazirlanis: string[];
  pisirmeSuresi: number;
  zorluk: 'kolay' | 'orta' | 'zor';
  porsiyon: number;
  kalori: number;
  resimUrl?: string;
  diyetTercihleri: string[];
} 