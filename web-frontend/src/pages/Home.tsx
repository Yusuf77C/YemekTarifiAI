import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Yapay Zeka ile Yemek Tarifleri Oluşturun
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Elinizdeki malzemelerle harika tarifler keşfedin
        </p>
        <Link
          to="/tarif-olustur"
          className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Hemen Başla
        </Link>
      </section>

      {/* Özellikler */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Malzeme Bazlı Tarifler</h3>
          <p className="text-gray-600">
            Elinizdeki malzemeleri girin, yapay zeka size uygun tarifler önersin
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Diyet Tercihleri</h3>
          <p className="text-gray-600">
            Vejetaryen, vegan veya glutensiz tarifler için özel filtreleme
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Detaylı Tarifler</h3>
          <p className="text-gray-600">
            Adım adım hazırlama talimatları ve malzeme listeleri
          </p>
        </div>
      </section>
    </div>
  );
} 