// pages/StatusPage.jsx
// Halaman ini ditampilkan kepada pengguna yang status akunnya 'rejected'.

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/kamaroto1.png';

const StatusPage = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUserData(storedUser);
        } else {
            // Jika tidak ada data user, arahkan ke login
            navigate('/login');
        }
    }, [navigate]);

    const handleResubmit = () => {
        // Arahkan ke halaman pendaftaran yang sesuai dengan role
        if (userData.role === 'co') {
            navigate('/captain/resubmit', { state:  { userId: userData.id } });
        } else if (userData.role === 'mitra') {
            navigate('/mitra/resubmit', { state:  { userId: userData.id } });
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!userData) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-50 overflow-hidden">
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <img src={logo} alt="KamarOTO Background Logo" className="w-2/3 h-auto opacity-5" />
            </div>

            <div className="relative z-10 w-full max-w-lg p-8 text-center bg-white rounded-2xl shadow-xl">
                <div className="flex justify-center mb-4">
                    <svg className="w-16 h-16 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Pendaftaran Anda Ditolak</h2>
                <p className="text-gray-600 mt-4">Alasan Penolakan:</p>
                <p className="mt-2 font-semibold text-gray-800 bg-red-50 p-3 rounded-md">
                    {userData.rejection_reason || 'Tidak ada alasan spesifik yang diberikan.'}
                </p>
                
                {userData.resubmit_allowed && (
                    <div className="mt-6">
                        <p className="text-gray-600 mb-4">Anda diizinkan untuk memperbaiki dan mengirim ulang data Anda.</p>
                        <button
                            onClick={handleResubmit}
                            className="w-full sm:w-auto px-6 py-2 text-center font-semibold text-white bg-orange-500 rounded-lg shadow-md hover:bg-orange-600"
                        >
                            Daftar Ulang
                        </button>
                    </div>
                )}

                <div className="mt-6">
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-500 hover:underline"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
