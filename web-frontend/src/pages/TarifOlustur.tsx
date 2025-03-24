import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService, malzemeService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Tarif } from '../types';

interface TarifMalzeme {
  id: string;
  ad: string;
  miktar: string;
}

export function TarifOlustur() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [yeniTarif, setYeniTarif] = useState<Partial<Tarif>>({
    ad: '',
    aciklama: '',
    kategori: '',
    pisirmeSuresi: 30,
    zorluk: 'orta',
    malzemeler: [],
    hazirlanisi: [],
    besinDegerleri: {
      kalori: 0,
      protein: 0,
      karbonhidrat: 0,
      yag: 0,
      lif: 0
    },
    diyetTercihleri: []
  });

  const [malzemeler, setMalzemeler] = useState<TarifMalzeme[]>([]);
  const [yeniMalzeme, setYeniMalzeme] = useState({ ad: '', miktar: '' });
  const [diyetTercihleri, setDiyetTercihleri] = useState<string[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');

  const tarifOlusturMutation = useMutation({
    mutationFn: (tarif: Omit<Tarif, '_id' | 'createdAt' | 'updatedAt'>) =>
      recipeService.tarifOlustur(tarif),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarifler'] });
      navigate('/tarifler');
    }
  });

  const handleMalzemeEkle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yeniMalzeme.ad || !yeniMalzeme.miktar) return;

    setMalzemeler([
      ...malzemeler,
      {
        id: Date.now().toString(),
        ad: yeniMalzeme.ad,
        miktar: yeniMalzeme.miktar,
      },
    ]);
    setYeniMalzeme({ ad: '', miktar: '' });
  };

  const handleMalzemeSil = (id: string) => {
    setMalzemeler(malzemeler.filter((m) => m.id !== id));
  };

  const handleAdimEkle = () => {
    setYeniTarif({
      ...yeniTarif,
      hazirlanisi: [...(yeniTarif.hazirlanisi || []), '']
    });
  };

  const handleAdimGuncelle = (index: number, deger: string) => {
    const yeniHazirlanis = [...(yeniTarif.hazirlanisi || [])];
    yeniHazirlanis[index] = deger;
    setYeniTarif({ ...yeniTarif, hazirlanisi: yeniHazirlanis });
  };

  const handleDiyetTercihiToggle = (tercih: string) => {
    setDiyetTercihleri((prev) =>
      prev.includes(tercih)
        ? prev.filter((t) => t !== tercih)
        : [...prev, tercih]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (yeniTarif.ad && yeniTarif.aciklama && malzemeler.length > 0) {
      setYukleniyor(true);
      setHata('');

      try {
        // TODO: API entegrasyonu yapılacak
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simüle edilmiş API çağrısı
        console.log('Tarif oluşturuluyor:', { malzemeler, diyetTercihleri });
        tarifOlusturMutation.mutate(yeniTarif as Omit<Tarif, '_id' | 'createdAt' | 'updatedAt'>);
      } catch (error) {
        setHata('Tarif oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setYukleniyor(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Yeni Tarif Oluştur</h1>

      {hata && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {hata}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Temel Bilgiler */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Temel Bilgiler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tarif Adı</label>
              <input
                type="text"
                value={yeniTarif.ad}
                onChange={(e) => setYeniTarif({ ...yeniTarif, ad: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kategori</label>
              <select
                value={yeniTarif.kategori}
                onChange={(e) => setYeniTarif({ ...yeniTarif, kategori: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              >
                <option value="">Seçiniz</option>
                <option value="ana-yemek">Ana Yemek</option>
                <option value="corba">Çorba</option>
                <option value="tatli">Tatlı</option>
                <option value="salata">Salata</option>
                <option value="meze">Meze</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pişirme Süresi (dk)</label>
              <input
                type="number"
                value={yeniTarif.pisirmeSuresi}
                onChange={(e) => setYeniTarif({ ...yeniTarif, pisirmeSuresi: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Zorluk</label>
              <select
                value={yeniTarif.zorluk}
                onChange={(e) => setYeniTarif({ ...yeniTarif, zorluk: e.target.value as 'kolay' | 'orta' | 'zor' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              >
                <option value="kolay">Kolay</option>
                <option value="orta">Orta</option>
                <option value="zor">Zor</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Açıklama</label>
            <textarea
              value={yeniTarif.aciklama}
              onChange={(e) => setYeniTarif({ ...yeniTarif, aciklama: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        {/* Malzemeler */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Malzemeler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Malzeme Adı</label>
              <input
                type="text"
                value={yeniMalzeme.ad}
                onChange={(e) => setYeniMalzeme({ ...yeniMalzeme, ad: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Miktar</label>
              <input
                type="text"
                value={yeniMalzeme.miktar}
                onChange={(e) => setYeniMalzeme({ ...yeniMalzeme, miktar: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleMalzemeEkle}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Malzeme Ekle
          </button>

          {/* Malzeme Listesi */}
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Eklenen Malzemeler</h3>
            <ul className="space-y-2">
              {malzemeler.map((malzeme) => (
                <li key={malzeme.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{malzeme.ad} - {malzeme.miktar}</span>
                  <button
                    type="button"
                    onClick={() => handleMalzemeSil(malzeme.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Sil
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Hazırlanışı */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Hazırlanışı</h2>
          <div className="space-y-4">
            {yeniTarif.hazirlanisi?.map((adim, index) => (
              <div key={index} className="flex items-start space-x-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
                <textarea
                  value={adim}
                  onChange={(e) => handleAdimGuncelle(index, e.target.value)}
                  className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  rows={2}
                  placeholder={`${index + 1}. adım`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const yeniHazirlanis = [...(yeniTarif.hazirlanisi || [])];
                    yeniHazirlanis.splice(index, 1);
                    setYeniTarif({ ...yeniTarif, hazirlanisi: yeniHazirlanis });
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  Sil
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAdimEkle}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Adım Ekle
            </button>
          </div>
        </div>

        {/* Besin Değerleri */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Besin Değerleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Kalori</label>
              <input
                type="number"
                value={yeniTarif.besinDegerleri?.kalori}
                onChange={(e) => setYeniTarif({
                  ...yeniTarif,
                  besinDegerleri: { ...yeniTarif.besinDegerleri!, kalori: Number(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Protein (g)</label>
              <input
                type="number"
                value={yeniTarif.besinDegerleri?.protein}
                onChange={(e) => setYeniTarif({
                  ...yeniTarif,
                  besinDegerleri: { ...yeniTarif.besinDegerleri!, protein: Number(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Karbonhidrat (g)</label>
              <input
                type="number"
                value={yeniTarif.besinDegerleri?.karbonhidrat}
                onChange={(e) => setYeniTarif({
                  ...yeniTarif,
                  besinDegerleri: { ...yeniTarif.besinDegerleri!, karbonhidrat: Number(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Yağ (g)</label>
              <input
                type="number"
                value={yeniTarif.besinDegerleri?.yag}
                onChange={(e) => setYeniTarif({
                  ...yeniTarif,
                  besinDegerleri: { ...yeniTarif.besinDegerleri!, yag: Number(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Lif (g)</label>
              <input
                type="number"
                value={yeniTarif.besinDegerleri?.lif}
                onChange={(e) => setYeniTarif({
                  ...yeniTarif,
                  besinDegerleri: { ...yeniTarif.besinDegerleri!, lif: Number(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Diyet Tercihleri */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Diyet Tercihleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Vejetaryen', 'Vegan', 'Glutensiz'].map((tercih) => (
              <button
                key={tercih}
                type="button"
                onClick={() => handleDiyetTercihiToggle(tercih)}
                className={`px-4 py-2 rounded-full ${
                  diyetTercihleri.includes(tercih)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tercih}
              </button>
            ))}
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={yukleniyor}
            className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {yukleniyor ? 'Tarif Oluşturuluyor...' : 'Tarif Oluştur'}
          </button>
        </div>
      </form>
    </div>
  );
} 