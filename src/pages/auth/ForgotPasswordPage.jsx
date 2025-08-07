import React, { useState } from 'react';
import api from '../../api/api';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/kamaroto1.png';
import { InputField } from '../../components/form/FormElements';

// ... (gunakan komponen InputField Anda)

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/forgot-password', { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
         <div className="relative flex items-center justify-center min-h-screen bg-gray-50 overflow-hidden">
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <img src={logo} alt="KamarOTO Background Logo" className="w-2/3 h-auto opacity-5" />
            </div>

            <div className="relative z-10 w-full max-w-lg p-8 text-center bg-white rounded-2xl shadow-xl">
                <div className="flex justify-center mb-4">
                    {/* Ikon Kunci */}
                    <svg className="w-16 h-16 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.623 5.913M15 7a2 2 0 00-2-2M3 13.182V11a6 6 0 017.623-5.913m-4.623 5.913a2 2 0 012-2" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Lupa Password Anda?</h2>
                
                {/* Tampilkan pesan setelah submit, atau tampilkan form jika belum */}
                {message.text ? (
                    <div className="mt-4">
                        <p className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                            {message.text}
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 mt-4">
                            Jangan khawatir. Masukkan alamat email Anda yang terdaftar dan kami akan mengirimkan link untuk mereset password Anda.
                        </p>
                        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                            <InputField 
                                icon="https://icongr.am/feather/mail.svg?size=20&color=9ca3af"
                                label="Email Terdaftar"
                                id="email"
                                type="email"
                                placeholder="email@contoh.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 text-center font-semibold text-white bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 disabled:bg-gray-400"
                            >
                                {loading ? 'Mengirim...' : 'Kirim Link Reset'}
                            </button>
                        </form>
                    </>
                )}

                <div className="mt-6">
                    <Link to="/login" className="text-sm text-gray-500 hover:underline">
                        Kembali ke Halaman Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;