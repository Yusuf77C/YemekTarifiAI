import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { Kullanici, GirisFormu, KayitFormu } from '../types';

interface AuthState {
  kullanici: Kullanici | null;
  token: string | null;
  yukleniyor: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    kullanici: null,
    token: null,
    yukleniyor: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Token doğrulama ve kullanıcı bilgilerini getirme
      setState({ kullanici: null, token, yukleniyor: false });
    } else {
      setState({ kullanici: null, token: null, yukleniyor: false });
    }
  }, []);

  const girisYap = async (form: GirisFormu) => {
    try {
      const response = await authService.giris(form);
      const { token, kullanici } = response.data;
      localStorage.setItem('token', token);
      setState({ kullanici, token, yukleniyor: false });
      navigate('/');
    } catch (error) {
      console.error('Giriş yapılırken hata oluştu:', error);
      throw error;
    }
  };

  const kayitOl = async (form: KayitFormu) => {
    try {
      const response = await authService.kayit(form);
      const { token, kullanici } = response.data;
      localStorage.setItem('token', token);
      setState({ kullanici, token, yukleniyor: false });
      navigate('/');
    } catch (error) {
      console.error('Kayıt olurken hata oluştu:', error);
      throw error;
    }
  };

  const cikisYap = () => {
    localStorage.removeItem('token');
    setState({ kullanici: null, token: null, yukleniyor: false });
    navigate('/giris');
  };

  return {
    kullanici: state.kullanici,
    token: state.token,
    yukleniyor: state.yukleniyor,
    girisYap,
    kayitOl,
    cikisYap,
  };
} 