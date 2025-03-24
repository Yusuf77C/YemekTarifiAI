import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { recipeService } from '../services/api';
import { Tarif } from '../types';

export function AnaSayfa() {
  const { data: tarifler, isLoading } = useQuery({
    queryKey: ['tarifler'],
    queryFn: () => recipeService.tumTarifleriGetir(),
  });

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <span className="rounded-full bg-primary-600/10 px-3 py-1 text-sm font-semibold leading-6 text-primary-600 ring-1 ring-inset ring-primary-600/10">
                Yeni Özellik
              </span>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Yapay zeka destekli yemek tarifi önerileri ile mutfağınızı keşfedin.
              </p>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Yapay Zeka ile Yemek Tarifleri
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Elinizdeki malzemelerle harika tarifler oluşturun. Yapay zeka size özel öneriler sunar.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                to="/tarif-olustur"
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Tarif Oluştur
              </Link>
              <Link to="/malzemeler" className="text-sm font-semibold leading-6 text-gray-900">
                Malzemeleri Görüntüle <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Yemek tarifleri"
                className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Öne Çıkan Tarifler */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Öne Çıkan Tarifler
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            En çok beğenilen ve yorum alan tariflerimiz
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-3 text-center">Yükleniyor...</div>
          ) : (
            tarifler?.data.slice(0, 3).map((tarif: Tarif) => (
              <article key={tarif.id} className="flex flex-col items-start">
                <div className="relative w-full">
                  <img
                    src={tarif.resimUrl || 'https://via.placeholder.com/400x300'}
                    alt={tarif.baslik}
                    className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                  />
                </div>
                <div className="max-w-xl">
                  <div className="mt-6 flex items-center gap-x-4 text-xs">
                    <time dateTime={tarif.createdAt} className="text-gray-500">
                      {new Date(tarif.createdAt).toLocaleDateString('tr-TR')}
                    </time>
                    <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600">
                      {tarif.zorluk}
                    </span>
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <Link to={`/tarifler/${tarif.id}`}>
                        <span className="absolute inset-0" />
                        {tarif.baslik}
                      </Link>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                      {tarif.aciklama}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {/* Özellikler */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">
            Daha Hızlı Yemek Yapın
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Yapay Zeka ile Yemek Yapmak Artık Çok Kolay
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Elinizdeki malzemelerle harika tarifler oluşturun. Yapay zeka size özel öneriler sunar.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <svg
                  className="h-5 w-5 flex-none text-primary-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 001.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z"
                    clipRule="evenodd"
                  />
                </svg>
                Malzeme Önerileri
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Elinizdeki malzemeleri girin, yapay zeka size uygun tarifleri önersin.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <svg
                  className="h-5 w-5 flex-none text-primary-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clipRule="evenodd"
                  />
                </svg>
                Diyet Tercihleri
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Vejetaryen, vegan veya glutensiz diyet tercihlerinize uygun tarifler bulun.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <svg
                  className="h-5 w-5 flex-none text-primary-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                    clipRule="evenodd"
                  />
                </svg>
                Tarif Paylaşımı
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Kendi tariflerinizi oluşturun ve toplulukla paylaşın.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
} 