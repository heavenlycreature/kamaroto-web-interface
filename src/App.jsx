import React, { useState, useEffect, createContext, useContext }  from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function App() {

   const [auth, setAuth] = useState({ token: null, user: null, isLoggedIn: false });

    useEffect(() => {
        // Cek localStorage sekali saat aplikasi dimuat
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (token && user) {
            setAuth({ token, user, isLoggedIn: true });
        }
    }, []);

    const login = (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setAuth({ token, user, isLoggedIn: true });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuth({ token: null, user: null, isLoggedIn: false });
    };


  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* --- Rute Publik --- */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

            {/* --- Rute Khusus Tamu (Tidak Bisa Diakses Jika Sudah Login) --- */}
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/register/captain" element={<GuestRoute><RegisterCaptain /></GuestRoute>} />
            <Route path="/register/mitra" element={<GuestRoute><RegisterMitra /></GuestRoute>} />
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />

            {/* --- Rute Terproteksi (Hanya Bisa Diakses Jika Sudah Login) --- */}
            
            {/* Rute Admin */}
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/membership" element={<ProtectedRoute><MembershipPage /></ProtectedRoute>} />
            <Route path="/admin/approval" element={<ProtectedRoute><ApprovalPage /></ProtectedRoute>} />
            
            {/* Rute Pengguna */}
            <Route path="/status" element={<ProtectedRoute><StatusPage /></ProtectedRoute>} />
            <Route path="/captain/profile" element={<ProtectedRoute><CaptainProfile /></ProtectedRoute>} />
            
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