import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../App';

const GuestRoute = ({ children }) => {
    // Cek apakah ada token di localStorage
    const {isLoggedIn, authLoading} = useAuth()

     if (authLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    // Jika user sudah login, alihkan ke halaman utama ('/')
    if (isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    // Jika belum login, tampilkan halaman yang seharusnya (misalnya, halaman login/register)
    return children;
};

export default GuestRoute;