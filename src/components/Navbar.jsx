// components/Navbar.jsx
// Navbar ini sekarang dinamis, menampilkan menu berbeda berdasarkan status login.

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/kamaroto1.png';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Cek status login saat komponen dimuat
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (token && user) {
            setIsLoggedIn(true);
            setUserRole(user.role);
        }
    }, []);

    // Logika untuk menutup dropdown saat klik di luar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleLogout = () => {
        // Hapus data dari localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserRole(null);
        setIsDropdownOpen(false);
        navigate('/login'); // Arahkan ke halaman login
        window.location.reload(); // Reload untuk memastikan semua state bersih
    };

    const activeLinkStyle = { color: '#ea580c', fontWeight: '600' };

    // Tentukan path profil berdasarkan role
    let profilePath;
    
    // switch (userRole) {
    //     case 'admin':
    //         profilePath = '/admin/dashboard';
    //         break;
    //     case 'co':
    //         profilePath = '/captain/profile'; 
    //         break;
    //     case 'mitra':
    //         profilePath = '/mitra/profile'; 
    //         break;
    //     default:
    //         profilePath = '/'; // Default path jika tidak ada role yang sesuai
    //         break;
    // }

    if (userRole === 'mitra') {
        profilePath = '/mitra/profile';
    } else if (userRole === 'co') {
        profilePath = '/captain/profile';
    }
    else {
        profilePath = '/admin/dashboard';
    }

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/">
                    <img src={logo} alt="KamarOTO Logo" className="h-10 w-auto" />
                </Link>
                <nav className="hidden md:flex items-center space-x-8">
                    <NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-orange-600 transition-colors duration-300">Home</NavLink>
                    <NavLink to="/about" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-orange-600 transition-colors duration-300">About Us</NavLink>
                </nav>
                
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <img src="https://icongr.am/feather/user.svg?size=24&color=6b7280" alt="User Icon" className="w-6 h-6" />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                            {isLoggedIn ? (
                                <>
                                    <Link to={profilePath} onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Profil Saya
                                    </Link>
                                    <button onClick={handleLogout} className="cursor-pointer w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Login
                                    </Link>
                                    <Link to="/register" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
