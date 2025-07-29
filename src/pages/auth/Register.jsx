// pages/Register.jsx
// Halaman untuk memilih jenis pendaftaran (Mitra atau Captain).

import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/kamaroto1.png';

const Register = () => {
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

      {/* Registration Card */}
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Daftar Sebagai
        </h2>
        
        <div className="space-y-4">
          <Link 
            to="/register/mitra" 
            className="block w-full px-4 py-3 text-center font-semibold text-white bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
          >
            MITRA
          </Link>
          <Link 
            to="/register/captain" 
            className="block w-full px-4 py-3 text-center font-semibold text-white bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
          >
            CAPTAIN
          </Link>
        </div>

        <p className="text-sm text-center text-gray-500">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-medium text-orange-600 hover:underline">
            Masuk disini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
