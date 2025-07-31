// pages/PendingApprovalPage.jsx
// Halaman ini ditampilkan kepada pengguna yang status akunnya 'pending'.

import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/kamaroto1.png'; // Pastikan path logo ini benar

const PendingApprovalPage = () => {
    
    // Fungsi untuk logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Arahkan ke halaman login dan refresh
        window.location.href = '/login'; 
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-50 overflow-hidden">
            {/* Background Logo */}
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <img 
                    src={logo} 
                    alt="KamarOTO Background Logo" 
                    className="w-2/3 h-auto opacity-5"
                />
            </div>

            {/* Kartu Informasi */}
            <div className="relative z-10 w-full max-w-lg p-8 text-center bg-white rounded-2xl shadow-xl">
                <div className="flex justify-center mb-4">
                    <svg className="w-16 h-16 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                    Akun Anda Sedang Ditinjau
                </h2>
                <p className="text-gray-600 mt-2">
                    Terima kasih telah mendaftar. Tim kami sedang mereview informasi Anda. Anda akan menerima notifikasi melalui email jika akun Anda telah disetujui.
                </p>
                <div className="mt-6">
                    <button
                        onClick={handleLogout}
                        className="w-full sm:w-auto px-6 py-2 text-center font-semibold text-white bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PendingApprovalPage;
