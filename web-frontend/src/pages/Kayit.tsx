import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Kayit() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ad: '',
    email: '',
    sifre: '',
    sifreTekrar: '',
  });
  const [hata, setHata] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata('');

    if (formData.sifre !== formData.sifreTekrar) {
      setHata('Şifreler eşleşmiyor');
      return;
    }

    try {
      // TODO: API entegrasyonu yapılacak
      console.log('Kayıt yapılıyor:', formData);
      navigate('/giris');
    } catch (error) {
      setHata('Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Kayıt Ol</h2>
        
        {hata && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {hata}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="ad" className="block text-sm font-medium text-gray-700">
              Ad Soyad
            </label>
            <input
              type="text"
              id="ad"
              value={formData.ad}
              onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-posta
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label htmlFor="sifre" className="block text-sm font-medium text-gray-700">
              Şifre
            </label>
            <input
              type="password"
              id="sifre"
              value={formData.sifre}
              onChange={(e) => setFormData({ ...formData, sifre: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label htmlFor="sifreTekrar" className="block text-sm font-medium text-gray-700">
              Şifre Tekrar
            </label>
            <input
              type="password"
              id="sifreTekrar"
              value={formData.sifreTekrar}
              onChange={(e) => setFormData({ ...formData, sifreTekrar: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Kayıt Ol
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Zaten hesabınız var mı?{' '}
            <Link to="/giris" className="text-orange-500 hover:text-orange-600">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 