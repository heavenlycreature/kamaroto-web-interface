import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Cek apakah ada token ATAU data pengguna di localStorage
    const hasToken = !!localStorage.getItem('token');
    const hasUser = !!localStorage.getItem('user');
    const storedUser = localStorage.getItem('user');
    let user = null;

    // 2. Handle user rejected
    if (user?.status === 'rejected') {
        const allowedRoutes = ['/status', '/captain/resubmit'];
        if (!allowedRoutes.some(route => window.location.pathname.startsWith(route))) {
        return <Navigate to="/status" replace />;
        }
    }

    try {
        user = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem('user'); // Hapus data corrupt
    }

 

    // Izinkan akses jika ada token (untuk pengguna aktif) ATAU jika hanya ada data user (untuk pengguna rejected/pending di halaman status)
    if (hasToken || user) return children;


    // Jika tidak ada keduanya, alihkan ke halaman login
    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;