import React from 'react';
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

function App() {
  return (
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
  );
}

export default App;