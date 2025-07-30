import React from 'react';
import { Navigate } from 'react-router-dom';

const GuestRoute = ({ children }) => {
    // Cek apakah ada token di localStorage
    const isLoggedIn = !!localStorage.getItem('token');

    // Jika user sudah login, alihkan ke halaman utama ('/')
    if (isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    // Jika belum login, tampilkan halaman yang seharusnya (misalnya, halaman login/register)
    return children;
};

export default GuestRoute;