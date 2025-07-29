// pages/auth/Login.jsx
// Halaman formulir untuk login pengguna.

import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/kamaroto1.png'; // Pastikan path logo ini benar

const Login = () => {

  // Komponen input kustom dengan ikon
  const InputField = ({ icon, label, id, type = 'text', placeholder, required = true }) => (
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
          placeholder={placeholder}
          required={required}
          className="block w-full pl-10 pr-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
        />
      </div>
    </div>
  );

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

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
            <img src={logo} alt="KamarOTO Logo" className="w-auto h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">
            Selamat Datang Kembali
            </h2>
            <p className="text-gray-500 mt-1">Silakan masuk ke akun Anda.</p>
        </div>
        
        <form className="space-y-6">
            <InputField 
                icon="https://icongr.am/feather/mail.svg?size=20&color=9ca3af" 
                label="Email" 
                id="email" 
                type="email" 
                placeholder="email@contoh.com" 
            />
            <div>
                <InputField 
                    icon="https://icongr.am/feather/lock.svg?size=20&color=9ca3af" 
                    label="Password" 
                    id="password" 
                    type="password" 
                    placeholder="Masukkan password Anda" 
                />
                <div className="text-right mt-2">
                    <Link to="/forgot-password" className="text-sm font-medium text-orange-600 hover:underline">
                        Lupa Password?
                    </Link>
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    className="w-full px-4 py-3 text-center font-semibold text-white bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
                >
                    LOGIN
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
