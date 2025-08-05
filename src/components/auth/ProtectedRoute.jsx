import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../App';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, authLoading, user } = useAuth();
    const location = useLocation();

     if (authLoading) {
        return <div className="flex items-center justify-center min-h-screen">Memverifikasi sesi...</div>;
    }

    // 2. Jika sudah selesai loading dan TIDAK login, paksa ke halaman login
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // 3. Jika SUDAH login, kita periksa status untuk otorisasi
    const userStatus = user?.status;
    const currentPath = location.pathname;

    const resubmitRoutes = ['/status', '/captain/resubmit', '/mitra/resubmit'];

    // KASUS 1: Pengguna 'rejected' atau 'pending'
    if (userStatus === 'rejected' || userStatus === 'pending') {
        // Jika mereka mencoba mengakses halaman selain halaman status/resubmit,
        // paksa mereka kembali ke halaman status.
        if (!resubmitRoutes.includes(currentPath)) {
            return <Navigate to="/status" replace />;
        }
    }
    
    // KASUS 2: Pengguna 'approved' atau 'active'
    if (userStatus === 'approved' || userStatus === 'active') {
        // Jika pengguna yang sudah aktif mencoba mengakses halaman status/resubmit,
        // arahkan mereka ke halaman utama agar tidak bingung.
        if (resubmitRoutes.includes(currentPath)) {
            return <Navigate to="/" replace />;
        }
    }

    // 4. Jika semua pemeriksaan lolos, tampilkan halaman yang diminta
    return children;
};

export default ProtectedRoute;