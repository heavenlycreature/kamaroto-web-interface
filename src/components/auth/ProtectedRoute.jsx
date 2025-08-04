import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../App';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, user, authLoading } = useAuth();
    const location = useLocation();

    // 1. Tampilkan loading jika context sedang memverifikasi status login awal
    if (authLoading) {
        return <div className="flex items-center justify-center min-h-screen">Memverifikasi sesi...</div>;
    }

    // 2. Jika sudah selesai loading dan TIDAK login, alihkan ke halaman login
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // 3. Jika SUDAH login, cek statusnya
    const userStatus = user?.status;

    // Jika statusnya pending atau rejected, mereka hanya boleh mengakses halaman tertentu
    if (userStatus === 'pending' || userStatus === 'rejected') {
        const allowedRoutes = ['/status', '/captain/resubmit', '/mitra/resubmit'];
        // Jika mereka mencoba mengakses halaman LAIN selain yang diizinkan, paksa ke /status
        if (!allowedRoutes.includes(location.pathname)) {
            return <Navigate to="/status" replace />;
        }
    }
    
    // 4. Jika semua kondisi di atas aman, tampilkan halaman yang diminta
    return children;
};

export default ProtectedRoute;