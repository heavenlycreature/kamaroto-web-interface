import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logoDesktop from '../assets/images/kamaroto1.png'; // Logo untuk desktop
import { useAuth } from '../App';

// Custom Hook untuk deteksi klik di luar elemen
const useClickOutside = (handler) => {
    let domNode = useRef();
    useEffect(() => {
        const maybeHandler = (event) => {
            if (domNode.current && !domNode.current.contains(event.target)) {
                handler();
            }
        };
        document.addEventListener('mousedown', maybeHandler);
        return () => {
            document.removeEventListener('mousedown', maybeHandler);
        };
    });
    return domNode;
};

// Komponen Ikon Panah Bawah
const ChevronDownIcon = () => <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>;

const Navbar = () => {
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [isMoreDropdownOpen, setMoreDropdownOpen] = useState(false);

    let profileDropdownRef = useClickOutside(() => setProfileDropdownOpen(false));
    let moreDropdownRef = useClickOutside(() => setMoreDropdownOpen(false));

    const handleLogout = () => {
        logout();
        setProfileDropdownOpen(false);
        navigate('/login');
    };

    const activeLinkStyle = { color: '#ea580c', fontWeight: '600' };
    const userRole = user?.role;

    let profilePath = '/';
    if (userRole === 'mitra') profilePath = '/mitra/profile';
    else if (userRole === 'co') profilePath = '/captain/profile';
    else if (userRole === 'admin') profilePath = '/admin/dashboard';

    const navLinkClass = "hover:text-orange-600 transition-colors duration-300";
    const dropdownLinkClass = "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100";
    
    // Fungsi untuk menutup kedua dropdown saat link di-klik
    const closeAllDropdowns = () => {
        setProfileDropdownOpen(false);
        setMoreDropdownOpen(false);
    };

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
            <div className="container mx-auto px-15 py-3 flex items-center justify-between">
                <Link to="/" className="shrink-0">
                    {/* PERUBAHAN 1: LOGO RESPONSIVE */}
                    {/* Logo Desktop (muncul di layar md ke atas) */}
                    <img src={logoDesktop} alt="KamarOTO Logo" className="h-10 w-auto hidden md:block" />
                    {/* Logo Mobile (muncul di layar kecil, tersembunyi di md ke atas) */}
                    <img src="/images/head_icon.png" alt="KamarOTO Ikon" className="h-9 w-auto block md:hidden" />
                </Link>

                <div className="flex items-center text-sm text-gray-600">
                    {/* Navigasi untuk MOBILE */}
                    <nav className="flex items-center gap-x-5 md:hidden">
                        <NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className={navLinkClass}>Beranda</NavLink>
                        
                        <div className="relative" ref={moreDropdownRef}>
                            <button onClick={() => setMoreDropdownOpen(!isMoreDropdownOpen)} className="flex items-center text-gray-600 hover:text-orange-600">
                                Lainnya <ChevronDownIcon />
                            </button>
                            {isMoreDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                                    {/* PERUBAHAN 2: "TENTANG KAMI" PINDAH KE SINI */}
                                    <NavLink to="/about" onClick={closeAllDropdowns} className={({isActive}) => `${dropdownLinkClass} ${isActive ? 'text-orange-600 font-semibold' : ''}`}>Tentang Kami</NavLink>
                                    <NavLink to="/gabung" onClick={closeAllDropdowns} className={({isActive}) => `${dropdownLinkClass} ${isActive ? 'text-orange-600 font-semibold' : ''}`}>Gabung</NavLink>
                                    <span className={`${dropdownLinkClass} text-gray-400 cursor-not-allowed`}>Pemberitahuan</span>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Navigasi untuk DESKTOP */}
                    <nav className="hidden md:flex items-center gap-x-6">
                        <NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className={navLinkClass}>Beranda</NavLink>
                        <NavLink to="/about" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className={navLinkClass}>Tentang Kami</NavLink>
                        <NavLink to="/gabung" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className={navLinkClass}>Gabung</NavLink>
                        <span className="text-gray-400 cursor-not-allowed">Pemberitahuan</span>
                    </nav>

                    {/* Ikon Profil */}
                    <div className="relative ml-6" ref={profileDropdownRef}>
                        <button onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)} className="cursor-pointer">
                            <img src="https://icongr.am/feather/user.svg?size=24&color=6b7280" alt="User Icon" className="w-6 h-6"/>
                        </button>
                        {isProfileDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                                {isLoggedIn ? (
                                    <>
                                        <Link to={profilePath} onClick={closeAllDropdowns} className={dropdownLinkClass}>Profil Saya</Link>
                                        <button onClick={handleLogout} className={dropdownLinkClass}>Logout</button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={closeAllDropdowns} className={dropdownLinkClass}>Login</Link>
                                        <Link to="/register" onClick={closeAllDropdowns} className={dropdownLinkClass}>Daftar</Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;