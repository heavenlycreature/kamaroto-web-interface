import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/kamaroto1.png';

const CheckEmailPage = () => {
    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-50 overflow-hidden">
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <img src={logo} alt="KamarOTO Background Logo" className="w-2/3 h-auto opacity-5" />
            </div>

            <div className="relative z-10 w-full max-w-lg p-8 text-center bg-white rounded-2xl shadow-xl">
                <div className="flex justify-center mb-4">
                    <svg className="w-16 h-16 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Pendaftaran Berhasil!</h2>
                <p className="text-gray-600 mt-4">
                    Satu langkah lagi. Kami telah mengirimkan link verifikasi ke alamat email Anda.
                </p>
                <p className="mt-2 font-semibold text-gray-800 bg-yellow-50 p-3 rounded-md">
                    Mohon periksa kotak masuk dan folder spam/junk untuk melanjutkan.
                </p>
                
                <div className="mt-6">
                    <Link 
                        to="/" 
                        className="text-sm text-orange-600 hover:underline"
                    >
                        Kembali ke Halaman Utama
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CheckEmailPage;