import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import api from './api/api';

// Impor Komponen Utama & Halaman
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import StatusPage from './pages/StatusPage';

// Impor Halaman Registrasi & Login
import Register from './pages/auth/Register';
import RegisterCaptain from './pages/auth/RegisterCaptain';
import RegisterMitra from './pages/auth/RegisterMitra';
import Login from './pages/auth/Login';

// Impor Halaman Terproteksi
import AdminDashboard from './pages/admin/AdminDashboard';
import MembershipPage from './pages/admin/MembershipPage';
import ApprovalPage from './pages/admin/ApprovalPage';
import CaptainProfile from './pages/captain/CaptainProfile';

// Impor Komponen Pelindung Rute
import GuestRoute from './components/auth/GuestRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MitraProfile from './pages/mitra/MitraProfile';
import ReferredUsersPage from './pages/captain/ReferredUserPage';
import SettingsPage from './pages/admin/SettingsPage';
import CheckEmailPage from './pages/auth/CheckEmailPage';
import VerifyPage from './pages/auth/VerifyPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import JoinUs from './pages/JoinUs';
import GabCo from './pages/GabCo';
import GabMi from './pages/GabMi';
import ScrollToTop from './components/ScrollToTop';
import StoreProfilePage from './pages/mitra/StoreProfilePage';
import AddItemPage from './pages/mitra/AddItemPage';

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function App() {

  const [auth, setAuth] = useState({ token: null, user: null, isLoggedIn: false });
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      if (token && user) {
        setAuth({ token, user, isLoggedIn: true });
      }
    } catch (error) {
      console.error("Gagal mem-parsing data user:", error);
      localStorage.clear();
    } finally {
      // Tandai bahwa proses pengecekan selesai
      setAuthLoading(false);
    }

  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;

      // ✅ Hanya simpan token dan tandai login jika token tersedia
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setAuth({ token, user, isLoggedIn: true });
      } else {
        // ⛔ Tidak simpan token atau tandai login jika tidak ada token
        localStorage.removeItem('token');
        localStorage.setItem('user', JSON.stringify(user));
        setAuth({ token: null, user, isLoggedIn: false });
      }

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data
      };
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ token: null, user: null, isLoggedIn: false });
  };
  const authContextValue = {
    isLoggedIn: auth.isLoggedIn,
    user: auth.user,
    authLoading,
    login, // Tambahkan fungsi login ke context
    logout,
  };

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Memverifikasi sesi...</div>;
  }


  return (

    <AuthContext.Provider value={ authContextValue }>
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* --- Rute Publik --- */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/verify-email" element={<CheckEmailPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/gabung" element={<JoinUs />} />
            <Route path="/gabung/co" element={<GabCo />} />
            <Route path="/gabung/mitra" element={<GabMi />} />

              {/* --- Rute Khusus Tamu (Tidak Bisa Diakses Jika Sudah Login) --- */}
              <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
              <Route path="/register/captain" element={<GuestRoute><RegisterCaptain /></GuestRoute>} />
              <Route path="/register/mitra" element={<GuestRoute><RegisterMitra /></GuestRoute>} />
              <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
              <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />

              {/* --- Rute Terproteksi (Hanya Bisa Diakses Jika Sudah Login) --- */}

              {/* Rute Admin */}
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/membership" element={<ProtectedRoute><MembershipPage /></ProtectedRoute>} />
              <Route path="/admin/approval" element={<ProtectedRoute><ApprovalPage /></ProtectedRoute>} />
              <Route path="/admin/pengaturan" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

              {/* Rute Pengguna */}
              <Route path="/status" element={<ProtectedRoute><StatusPage /></ProtectedRoute>} />
              <Route path="/captain/profile" element={<ProtectedRoute><CaptainProfile /></ProtectedRoute>} />
              <Route path="/captain/recruits" element={<ProtectedRoute><ReferredUsersPage /></ProtectedRoute>} />

              <Route path="/mitra/profile" element={<ProtectedRoute><MitraProfile /></ProtectedRoute>} />
              <Route path="/mitra/store" element={<ProtectedRoute><StoreProfilePage /></ProtectedRoute>} />
              <Route path="/mitra/store/add-item" element={<ProtectedRoute><AddItemPage /></ProtectedRoute>} />

              {/* Rute Pendaftaran Ulang */}
              <Route
                path="/captain/resubmit"
                element={<ProtectedRoute><RegisterCaptain isResubmitMode={true} /></ProtectedRoute>}
              />
              <Route
                path="/mitra/resubmit"
                element={<ProtectedRoute><RegisterMitra isResubmitMode={true} /></ProtectedRoute>}
              />

              {/* --- Rute Fallback --- */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;