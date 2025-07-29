// components/Navbar.jsx
// Diperbarui untuk menambahkan dropdown menu pada ikon user.

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/images/kamaroto1.png';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  // useEffect untuk menambahkan event listener saat dropdown terbuka
  useEffect(() => {
    // Fungsi untuk menutup dropdown jika diklik di luar
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Tambahkan event listener hanya jika dropdown terbuka
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup: hapus event listener saat komponen unmount atau dropdown tertutup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
  
  // Gaya untuk NavLink yang aktif
  const activeLinkStyle = {
    color: '#ea580c', // oranye-600
    fontWeight: '600',
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/">
          <img src={logo} alt="KamarOTO Logo" className="h-10 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink 
            to="/" 
            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
            className="text-gray-600 hover:text-orange-600 transition-colors duration-300"
          >
            Home
          </NavLink>
          <NavLink 
            to="/about" 
            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
            className="text-gray-600 hover:text-orange-600 transition-colors duration-300"
          >
            About Us
          </NavLink>
        </nav>
        
        {/* Kontainer untuk ikon user dan dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <img src="https://icongr.am/feather/user.svg?size=24&color=6b7280" alt="User Icon" className="w-6 h-6" />
          </button>

          {/* Dropdown Menu, ditampilkan secara kondisional */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
              <Link
                to="/login"
                onClick={() => setIsDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
