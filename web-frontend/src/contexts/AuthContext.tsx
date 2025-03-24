import { createContext, useContext, useState, ReactNode } from 'react';

interface Kullanici {
  email: string;
  ad?: string;
  resim?: string;
}

interface AuthContextType {
  kullanici: Kullanici | null;
  girisYap: (email: string, sifre: string, googleUser?: Kullanici) => Promise<void>;
  cikisYap: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [kullanici, setKullanici] = useState<Kullanici | null>(null);

  const girisYap = async (email: string, sifre: string, googleUser?: Kullanici) => {
    try {
      if (googleUser) {
        setKullanici(googleUser);
        return;
      }

      // TODO: API entegrasyonu yapılacak
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simüle edilmiş API çağrısı
      setKullanici({ email });
    } catch (error) {
      throw new Error('Giriş yapılamadı');
    }
  };

  const cikisYap = () => {
    setKullanici(null);
  };

  return (
    <AuthContext.Provider value={{ kullanici, girisYap, cikisYap }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 