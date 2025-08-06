// src/pages/auth/VerifyPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/api'; // Pastikan path ini benar

const VerifyPage = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('Sedang memverifikasi email Anda...');
    const [isSuccess, setIsSuccess] = useState(false);
    const verificationAttempted = useRef(false);

    useEffect(() => {
         if (verificationAttempted.current) {
            return;
        }
        verificationAttempted.current = true;
        const token = searchParams.get('token');
        if (token) {
            api.get(`/verify-email?token=${token}`)
                .then(response => {
                    setMessage(response.data.message);
                    setIsSuccess(true);
            
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                })
                .catch(error => {
                    setMessage(error.response?.data?.message || 'Verifikasi gagal. Silakan coba lagi.');
                    setIsSuccess(false);
                });
        } else {
            setMessage('Token verifikasi tidak ditemukan di URL.');
            setIsSuccess(false);
        }
    }, [searchParams]);

    return (
        <div className="flex items-center justify-center min-h-[70vh] text-center p-6">
            <div>
                <h1 className="text-3xl font-bold mb-4">Status Verifikasi Email</h1>
                <p className={`text-lg p-4 rounded-md ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message}
                </p>
                {isSuccess && (
                    <Link to="/login" className="mt-6 inline-block px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600">
                        Lanjutkan ke Halaman Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default VerifyPage;