import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Kullanici, Tarif, Malzeme, GirisFormu, KayitFormu } from '../types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
}) as unknown as AxiosInstance;

// Token interceptor
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/giris';
    }
    return Promise.reject(error);
  }
);

interface AuthResponse {
  token: string;
  kullanici: Kullanici;
}

// Auth servisi
export const authService = {
  girisYap: async (data: GirisFormu): Promise<AxiosResponse<AuthResponse>> => {
    const response = await api.post<AuthResponse>('/auth/giris', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },

  kayitOl: async (data: KayitFormu): Promise<AxiosResponse<AuthResponse>> => {
    const response = await api.post<AuthResponse>('/auth/kayit', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },

  googleGiris: (token: string) => 
    api.post<{ data: { token: string; kullanici: Kullanici } }>('/auth/google', { token }),

  cikisYap: () => {
    localStorage.removeItem('token');
  },
};

// Malzeme servisi
export const malzemeService = {
  malzemeleriGetir: async (): Promise<AxiosResponse<Malzeme[]>> => {
    const response = await api.get<Malzeme[]>('/malzemeler');
    return response;
  },

  malzemeGetir: (id: string) => api.get<{ data: Malzeme }>(`/malzemeler/${id}`),

  malzemeOlustur: async (malzeme: Omit<Malzeme, '_id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<Malzeme>> => {
    const response = await api.post<Malzeme>('/malzemeler', malzeme);
    return response;
  },

  malzemeGuncelle: async (id: string, malzeme: Partial<Malzeme>): Promise<AxiosResponse<Malzeme>> => {
    const response = await api.put<Malzeme>(`/malzemeler/${id}`, malzeme);
    return response;
  },

  malzemeSil: async (id: string): Promise<AxiosResponse<void>> => {
    const response = await api.delete(`/malzemeler/${id}`);
    return response;
  },
};

// Tarif servisi
export const recipeService = {
  tarifleriGetir: async (): Promise<AxiosResponse<Tarif[]>> => {
    const response = await api.get<Tarif[]>('/tarifler');
    return response;
  },

  tarifGetir: (id: string) => api.get<{ data: Tarif }>(`/tarifler/${id}`),

  tarifOlustur: async (tarif: Omit<Tarif, '_id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<Tarif>> => {
    const response = await api.post<Tarif>('/tarifler', tarif);
    return response;
  },

  tarifGuncelle: async (id: string, tarif: Partial<Tarif>): Promise<AxiosResponse<Tarif>> => {
    const response = await api.put<Tarif>(`/tarifler/${id}`, tarif);
    return response;
  },

  tarifSil: async (id: string): Promise<AxiosResponse<void>> => {
    const response = await api.delete(`/tarifler/${id}`);
    return response;
  },

  tarifBegen: (id: string) => api.post(`/tarifler/${id}/begen`),

  tarifBegenmektenVazgec: (id: string) => api.post(`/tarifler/${id}/begenmekten-vazgec`),

  yorumEkle: (id: string, yorum: { yorum: string; puan: number }) => 
    api.post<{ data: Tarif }>(`/tarifler/${id}/yorumlar`, yorum),

  yorumSil: (tarifId: string, yorumId: string) => 
    api.delete(`/tarifler/${tarifId}/yorumlar/${yorumId}`),
}; 