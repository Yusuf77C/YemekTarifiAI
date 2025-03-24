import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Giris } from './pages/Giris';
import { Kayit } from './pages/Kayit';
import { Tarifler } from './pages/Tarifler';
import { TarifOlustur } from './pages/TarifOlustur';
import { Profil } from './pages/Profil';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/giris" element={<Giris />} />
                <Route path="/kayit" element={<Kayit />} />
                <Route path="/tarifler" element={<Tarifler />} />
                <Route path="/tarif-olustur" element={<TarifOlustur />} />
                <Route path="/profil" element={<Profil />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
