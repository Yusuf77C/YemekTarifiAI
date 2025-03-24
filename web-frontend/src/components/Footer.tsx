import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Hakkımızda
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/hakkimizda" className="text-base text-gray-500 hover:text-gray-900">
                  Biz Kimiz
                </Link>
              </li>
              <li>
                <Link to="/iletisim" className="text-base text-gray-500 hover:text-gray-900">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Yemek Tarifleri
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/tarifler" className="text-base text-gray-500 hover:text-gray-900">
                  Tüm Tarifler
                </Link>
              </li>
              <li>
                <Link to="/tarif-olustur" className="text-base text-gray-500 hover:text-gray-900">
                  Tarif Oluştur
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Malzemeler
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/malzemeler" className="text-base text-gray-500 hover:text-gray-900">
                  Tüm Malzemeler
                </Link>
              </li>
              <li>
                <Link to="/malzemeler/kategoriler" className="text-base text-gray-500 hover:text-gray-900">
                  Kategoriler
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Yasal
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/gizlilik" className="text-base text-gray-500 hover:text-gray-900">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link to="/kullanim-kosullari" className="text-base text-gray-500 hover:text-gray-900">
                  Kullanım Koşulları
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} YemekTarifiAI. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
} 