import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '../services/api';
import { Tarif } from '../types';
import { useAuth } from '../hooks/useAuth';

export function TarifDetay() {
  const { id } = useParams<{ id: string }>();
  const { kullanici } = useAuth();
  const queryClient = useQueryClient();
  const [yorum, setYorum] = useState('');
  const [puan, setPuan] = useState(5);

  const { data, isLoading } = useQuery({
    queryKey: ['tarif', id],
    queryFn: () => recipeService.tarifDetayGetir(id!),
  });

  const begeniMutation = useMutation({
    mutationFn: () => recipeService.tarifBegen(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarif', id] });
    },
  });

  const yorumMutation = useMutation({
    mutationFn: () => recipeService.yorumEkle(id!, yorum, puan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarif', id] });
      setYorum('');
      setPuan(5);
    },
  });

  if (isLoading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  if (!data?.data) {
    return <div className="text-center">Tarif bulunamadı.</div>;
  }

  const tarifData = data.data;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Sol Taraf - Resim ve Temel Bilgiler */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {tarifData.baslik}
            </h1>
          </div>

          <section aria-labelledby="information-heading" className="mt-6">
            <h2 id="information-heading" className="sr-only">
              Tarif Bilgileri
            </h2>

            <div className="flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <svg
                    key={rating}
                    className={`h-5 w-5 flex-shrink-0 ${
                      rating < puan ? 'text-yellow-400' : 'text-gray-200'
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="ml-3 text-sm text-gray-500">
                {tarifData.yorumlar.length} yorum
              </p>
            </div>

            <div className="mt-4 space-y-6">
              <div className="text-base text-gray-700">{tarifData.aciklama}</div>

              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                  {tarifData.zorluk}
                </span>
                <span className="text-sm text-gray-500">
                  {tarifData.pisirmeSuresi} dk
                </span>
                <span className="text-sm text-gray-500">
                  {tarifData.porsiyon} porsiyon
                </span>
                <span className="text-sm text-gray-500">
                  {tarifData.kalori} kalori
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Sağ Taraf - Resim */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
            <img
              src={tarifData.resimUrl || 'https://via.placeholder.com/800x600'}
              alt={tarifData.baslik}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* Malzemeler */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900">Malzemeler</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tarifData.malzemeler.map((malzeme, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">
                    {malzeme.malzeme.ad}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {malzeme.miktar} {malzeme.birim}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hazırlanışı */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900">Hazırlanışı</h2>
        <div className="mt-4 space-y-6">
          {tarifData.hazirlanis.map((adim, index) => (
            <div key={index} className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                  <span className="text-sm font-medium text-primary-600">
                    {index + 1}
                  </span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-700">{adim}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Yorumlar */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900">Yorumlar</h2>

        {kullanici && (
          <div className="mt-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="yorum" className="block text-sm font-medium text-gray-700">
                  Yorumunuz
                </label>
                <div className="mt-1">
                  <textarea
                    id="yorum"
                    name="yorum"
                    rows={3}
                    value={yorum}
                    onChange={(e) => setYorum(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="puan" className="block text-sm font-medium text-gray-700">
                  Puanınız
                </label>
                <div className="mt-1">
                  <select
                    id="puan"
                    name="puan"
                    value={puan}
                    onChange={(e) => setPuan(Number(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    {[5, 4, 3, 2, 1].map((p) => (
                      <option key={p} value={p}>
                        {p} Yıldız
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => yorumMutation.mutate()}
                  disabled={!yorum || yorumMutation.isPending}
                  className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {yorumMutation.isPending ? 'Gönderiliyor...' : 'Yorum Yap'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-6">
          {tarifData.yorumlar.map((yorum) => (
            <div key={yorum.id} className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-600">
                    {yorum.kullanici.ad[0]}
                  </span>
                </div>
              </div>
              <div className="flex-grow">
                <div className="text-sm">
                  <span className="font-medium text-gray-900">
                    {yorum.kullanici.ad} {yorum.kullanici.soyad}
                  </span>
                  <span className="ml-2 text-gray-500">
                    {new Date(yorum.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div className="mt-1">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <svg
                        key={rating}
                        className={`h-5 w-5 flex-shrink-0 ${
                          rating < yorum.puan ? 'text-yellow-400' : 'text-gray-200'
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{yorum.yorum}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Beğeni Butonu */}
      {kullanici && (
        <div className="mt-8">
          <button
            type="button"
            onClick={() => begeniMutation.mutate()}
            disabled={begeniMutation.isPending}
            className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {begeniMutation.isPending ? 'Beğeniliyor...' : 'Beğen'}
            <span className="ml-2">{tarifData.begenenler.length}</span>
          </button>
        </div>
      )}
    </div>
  );
} 