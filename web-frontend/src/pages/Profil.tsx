import { useState } from 'react';

interface Kullanici {
  ad: string;
  email: string;
  kayitTarihi: string;
  sonGiris: string;
}

export function Profil() {
  const [kullanici] = useState<Kullanici>({
    ad: 'Örnek Kullanıcı',
    email: 'ornek@email.com',
    kayitTarihi: '2024-01-01',
    sonGiris: '2024-03-20',
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profil Bilgileri</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
            <p className="mt-1 text-gray-900">{kullanici.ad}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">E-posta</label>
            <p className="mt-1 text-gray-900">{kullanici.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kayıt Tarihi
            </label>
            <p className="mt-1 text-gray-900">
              {new Date(kullanici.kayitTarihi).toLocaleDateString('tr-TR')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Son Giriş
            </label>
            <p className="mt-1 text-gray-900">
              {new Date(kullanici.sonGiris).toLocaleDateString('tr-TR')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Hesap Ayarları</h2>
        <div className="space-y-4">
          <button
            type="button"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
          >
            Şifre Değiştir
          </button>
          <button
            type="button"
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
          >
            Hesabı Sil
          </button>
        </div>
      </div>
    </div>
  );
} 