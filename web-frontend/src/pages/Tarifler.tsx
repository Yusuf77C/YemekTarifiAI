import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { recipeService } from '../services/api';
import { Tarif } from '../types';

export function Tarifler() {
  const [arama, setArama] = useState('');
  const [zorluk, setZorluk] = useState<string>('');

  const { data: tarifler, isLoading } = useQuery({
    queryKey: ['tarifler'],
    queryFn: () => recipeService.tumTarifleriGetir(),
  });

  const zorlukSeviyeleri = ['kolay', 'orta', 'zor'];

  const filtrelenmisTarifler = tarifler?.data.filter((tarif: Tarif) => {
    const aramaUyumu = tarif.baslik.toLowerCase().includes(arama.toLowerCase()) ||
      tarif.aciklama.toLowerCase().includes(arama.toLowerCase());
    const zorlukUyumu = !zorluk || tarif.zorluk === zorluk;
    return aramaUyumu && zorlukUyumu;
  });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Tarifler</h1>
          <p className="mt-2 text-sm text-gray-700">
            Tüm tariflerin listesi. Arama yapabilir ve zorluk seviyesine göre filtreleyebilirsiniz.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tarif ara..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={zorluk}
            onChange={(e) => setZorluk(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="">Tüm Zorluk Seviyeleri</option>
            {zorlukSeviyeleri.map((z) => (
              <option key={z} value={z}>
                {z.charAt(0).toUpperCase() + z.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtrelenmisTarifler?.map((tarif: Tarif) => (
            <Link
              key={tarif.id}
              to={`/tarifler/${tarif.id}`}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <div className="aspect-h-1 aspect-w-1 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-48">
                <img
                  src={tarif.resimUrl || 'https://via.placeholder.com/400x300'}
                  alt={tarif.baslik}
                  className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                />
              </div>
              <div className="flex flex-1 flex-col space-y-6 p-6">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {tarif.baslik}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-3">{tarif.aciklama}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      {tarif.zorluk}
                    </span>
                    <span className="text-sm text-gray-500">
                      {tarif.pisirmeSuresi} dk
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {tarif.yorumlar.length} yorum
                    </span>
                    <span className="text-sm text-gray-500">
                      {tarif.begenenler.length} beğeni
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && filtrelenmisTarifler?.length === 0 && (
        <div className="text-center text-gray-500">
          Arama kriterlerinize uygun tarif bulunamadı.
        </div>
      )}
    </div>
  );
} 