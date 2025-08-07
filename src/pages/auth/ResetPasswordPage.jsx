import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/api';
import logo from '../../assets/images/kamaroto1.png';
import { InputField } from '../../components/form/FormElements';
// ... (gunakan komponen InputField dan PasswordRequirement Anda)

const PasswordRequirement = ({ isValid, text }) => (
    <p className={`text-sm ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
        {isValid ? '✓' : '•'} {text}
    </p>
);

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false, hasUpper: false, hasNumber: false, hasSymbol: false,
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setMessage({ type: 'error', text: 'Token tidak ditemukan.' });
        }
    }, [searchParams]);

    const validatePassword = (pass) => {
        setPasswordValidation({
            minLength: pass.length >= 8,
            hasUpper: /[A-Z]/.test(pass),
            hasNumber: /[0-9]/.test(pass),
            hasSymbol: /[^A-Za-z0-9]/.test(pass),
        });
    };

     const handlePasswordChange = (e) => {
        const { value } = e.target;
        setPassword(value);
        validatePassword(value);
        if (confirmPassword && value !== confirmPassword) {
            setPasswordError('Konfirmasi password tidak cocok.');
        } else {
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const { value } = e.target;
        setConfirmPassword(value);
        if (password && value !== password) {
            setPasswordError('Konfirmasi password tidak cocok.');
        } else {
            setPasswordError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Password tidak cocok.' });
            return;
        }
        if (Object.values(passwordValidation).some(v => !v)) {
            setMessage({ type: 'error', text: 'Password belum memenuhi semua persyaratan.' });
            return;
        }
        setLoading(true);
        try {
            const response = await api.post('/reset-password', { token, password });
            setMessage({ type: 'success', text: response.data.message });
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || "Gagal." });
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
                    {/* Ikon Gembok */}
                    <svg className="w-16 h-16 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Buat Password Baru</h2>
                
                {message.type === 'success' ? (
                     <p className="mt-4 p-4 rounded-md bg-green-50 text-green-800">{message.text}</p>
                ) : (
                    <>
                        <p className="text-gray-600 mt-4">Masukkan password baru Anda di bawah ini.</p>
                        <form onSubmit={handleSubmit} className="mt-6 space-y-6 text-left">
                            <div>
                                <InputField 
                                    icon="https://icongr.am/feather/lock.svg?size=20&color=9ca3af"
                                    label="Password Baru"
                                    id="password"
                                    type="password"
                                    placeholder="Masukkan password baru"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                <div className="grid grid-cols-2 gap-x-4 mt-2 pl-2">
                                    <PasswordRequirement isValid={passwordValidation.minLength} text="Min. 8 karakter" />
                                    <PasswordRequirement isValid={passwordValidation.hasUpper} text="1 Huruf Kapital" />
                                    <PasswordRequirement isValid={passwordValidation.hasNumber} text="1 Angka" />
                                    <PasswordRequirement isValid={passwordValidation.hasSymbol} text="1 Simbol" />
                                </div>
                            </div>
                             <div>
                                <InputField 
                                    icon="https://icongr.am/feather/lock.svg?size=20&color=9ca3af"
                                    label="Konfirmasi Password Baru"
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Ulangi password baru"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    hasError={!!passwordError}
                                />
                                {passwordError && <p className="text-red-500 text-xs mt-1 ml-1">{passwordError}</p>}
                            </div>
                            
                            {message.text && message.type === 'error' && (
                                <div className="p-3 rounded-lg text-center text-sm bg-red-100 text-red-800">
                                    {message.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !token}
                                className="w-full px-6 py-3 text-center font-semibold text-white bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 disabled:bg-gray-400"
                            >
                                {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
                            </button>
                        </form>
                    </>
                )}
                
                {message.type === 'success' && (
                    <div className="mt-6">
                        <Link to="/login" className="text-sm text-gray-500 hover:underline">
                            Lanjutkan ke Halaman Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;