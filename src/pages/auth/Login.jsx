import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import logo from '../../assets/images/kamaroto1.png';
import { useAuth } from '../../App';

// Komponen InputField bisa dipindahkan ke file terpisah jika digunakan di banyak tempat
const InputField = ({ icon, label, id, type = 'text', placeholder, required = true, value, onChange }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <img src={icon} alt="input icon" className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="block w-full pl-10 pr-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
        />
      </div>
    </div>
);

const Login = () => {
    const { user, isLoggedIn, login } = useAuth(); // <-- Gunakan hook untuk mendapatkan fungsi login
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setMessage({ type: '', text: '' });

            // Panggil fungsi login terpusat dari context
            const result = await login(formData.email, formData.password);

            setLoading(false);

            if (!result.success) {
                const errorData = result.error;
                const userStatus = errorData?.user?.status;

                if (userStatus === 'rejected' || userStatus === 'pending') {
                    // Simpan data user (tanpa token) dan arahkan ke status
                    localStorage.removeItem('token');
                    localStorage.setItem('user', JSON.stringify(errorData.user));
                    navigate('/status');
                } else {
                    // Untuk error lain (password salah, dll.)
                    setMessage({ type: 'error', text: errorData.message || 'Terjadi kesalahan.' });
                }
            }
        };
        useEffect(() => {
            if (isLoggedIn && user) {
                const status = user.status;
                const role = user.role;

                if (status === 'pending' || status === 'rejected') {
                    navigate('/status');
                } else if (role === 'admin') {
                    navigate('/admin/dashboard');
                } else if (role === 'co') {
                    navigate('/captain/profile');
                } else if (role === 'mitra') {
                    navigate('/mitra/profile');
                } else {
                    navigate('/');
                }
            }
        }, [isLoggedIn, user, navigate]);

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-50 overflow-hidden">
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <img src={logo} alt="KamarOTO Background Logo" className="w-2/3 h-auto opacity-5" />
            </div>

            <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
                <div className="text-center">
                    <img src={logo} alt="KamarOTO Logo" className="w-auto h-12 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">Selamat Datang Kembali</h2>
                    <p className="text-gray-500 mt-1">Silakan masuk ke akun Anda.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField 
                        icon="https://icongr.am/feather/mail.svg?size=20&color=9ca3af" 
                        label="Email" 
                        id="email" 
                        type="email" 
                        placeholder="email@contoh.com"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <div>
                        <InputField 
                            icon="https://icongr.am/feather/lock.svg?size=20&color=9ca3af" 
                            label="Password" 
                            id="password" 
                            type="password" 
                            placeholder="Masukkan password Anda"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        <div className="text-right mt-2">
                            <Link to="/forgot-password" className="text-sm font-medium text-orange-600 hover:underline">
                                Lupa Password?
                            </Link>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`p-3 rounded-lg text-center text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message.text}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-3 text-center font-semibold text-white bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition-transform transform hover:scale-105 disabled:bg-gray-400"
                        >
                            {loading ? 'Memproses...' : 'LOGIN'}
                        </button>
                    </div>
                </form>

                <p className="text-sm text-center text-gray-500">
                    Belum punya akun?{' '}
                    <Link to="/register" className="font-medium text-orange-600 hover:underline">
                        Daftar disini
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
