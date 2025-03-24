import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { malzemeService } from '../services/api';
import { Malzeme } from '../types';

export function Malzemeler() {
  const queryClient = useQueryClient();
  const [yeniMalzeme, setYeniMalzeme] = useState<Partial<Malzeme>>({
    ad: '',
    kategori: '',
    birim: '',
    besinDegerleri: {
      kalori: 0,
      protein: 0,
      karbonhidrat: 0,
      yag: 0,
      lif: 0
    }
  });

  const { data: malzemeler, isLoading } = useQuery({
    queryKey: ['malzemeler'],
    queryFn: () => malzemeService.malzemeleriGetir()
  });

  const malzemeEkleMutation = useMutation({
    mutationFn: (malzeme: Omit<Malzeme, '_id' | 'createdAt' | 'updatedAt'>) => 
      malzemeService.malzemeOlustur(malzeme),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['malzemeler'] });
      setYeniMalzeme({
        ad: '',
        kategori: '',
        birim: '',
        besinDegerleri: {
          kalori: 0,
          protein: 0,
          karbonhidrat: 0,
          yag: 0,
          lif: 0
        }
      });
    }
  });

  const malzemeSilMutation = useMutation({
    mutationFn: (id: string) => malzemeService.malzemeSil(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['malzemeler'] });
    }
  });

  const handleMalzemeEkle = (e: React.FormEvent) => {
    e.preventDefault();
    if (yeniMalzeme.ad && yeniMalzeme.kategori && yeniMalzeme.birim) {
      malzemeEkleMutation.mutate(yeniMalzeme as Omit<Malzeme, '_id' | 'createdAt' | 'updatedAt'>);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Malzemeler</h1>

      {/* Yeni Malzeme Formu */}
      <form onSubmit={handleMalzemeEkle} className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Yeni Malzeme Ekle</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ad</label>
            <input
              type="text"
              value={yeniMalzeme.ad}
              onChange={(e) => setYeniMalzeme({ ...yeniMalzeme, ad: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kategori</label>
            <input
              type="text"
              value={yeniMalzeme.kategori}
              onChange={(e) => setYeniMalzeme({ ...yeniMalzeme, kategori: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Birim</label>
            <input
              type="text"
              value={yeniMalzeme.birim}
              onChange={(e) => setYeniMalzeme({ ...yeniMalzeme, birim: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kalori</label>
            <input
              type="number"
              value={yeniMalzeme.besinDegerleri?.kalori}
              onChange={(e) => setYeniMalzeme({
                ...yeniMalzeme,
                besinDegerleri: { ...yeniMalzeme.besinDegerleri!, kalori: Number(e.target.value) }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Malzeme Ekle
          </button>
        </div>
      </form>

      {/* Malzeme Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {malzemeler?.data.map((malzeme) => (
          <div key={malzeme._id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">{malzeme.ad}</h3>
            <p className="text-gray-600 mb-2">Kategori: {malzeme.kategori}</p>
            <p className="text-gray-600 mb-2">Birim: {malzeme.birim}</p>
            <div className="text-sm text-gray-500">
              <p>Kalori: {malzeme.besinDegerleri.kalori}</p>
              <p>Protein: {malzeme.besinDegerleri.protein}g</p>
              <p>Karbonhidrat: {malzeme.besinDegerleri.karbonhidrat}g</p>
              <p>Yağ: {malzeme.besinDegerleri.yag}g</p>
              <p>Lif: {malzeme.besinDegerleri.lif}g</p>
            </div>
            <button
              onClick={() => malzemeSilMutation.mutate(malzeme._id)}
              className="mt-4 text-red-600 hover:text-red-800"
            >
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 