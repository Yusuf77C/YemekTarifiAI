import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}

export function Giris() {
  const navigate = useNavigate();
  const { girisYap } = useAuth();
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [hata, setHata] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);
    setHata('');

    try {
      // TODO: API entegrasyonu yapılacak
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simüle edilmiş API çağrısı
      await girisYap(email, sifre);
      navigate('/tarifler');
    } catch (error) {
      setHata('Giriş yapılırken bir hata oluştu. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setYukleniyor(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential) as GoogleUser;
      await girisYap(decoded.email, '', decoded);
      navigate('/tarifler');
    } catch (error) {
      setHata('Google ile giriş yapılırken bir hata oluştu.');
    }
  };

  const handleGoogleError = () => {
    setHata('Google ile giriş yapılırken bir hata oluştu.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Hesabınıza giriş yapın
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {hata && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {hata}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="E-posta adresi"
              />
            </div>
            <div>
              <label htmlFor="sifre" className="sr-only">
                Şifre
              </label>
              <input
                id="sifre"
                name="sifre"
                type="password"
                required
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Şifre"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={yukleniyor}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {yukleniyor ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">veya</span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
                width="100%"
                text="signin_with"
                locale="tr"
              />
            </GoogleOAuthProvider>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Hesabınız yok mu?{' '}
            <button
              onClick={() => navigate('/kayit')}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Kayıt olun
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 