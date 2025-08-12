// components/profile/ProfileSidebar.jsx
// Sidebar dinamis yang menerima link navigasi sebagai props.

import React from 'react';
import { Link, NavLink } from 'react-router-dom';

// Ikon-ikon ini bisa Anda impor dari file terpusat jika mau
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;

const ProfileSidebar = ({ user, navLinks, isOpen, setIsOpen }) => {
    const statusStyles = {
        approved: { text: 'Approved', classes: 'bg-green-500 text-white' },
        pending: { text: 'Pending', classes: 'bg-yellow-500 text-white' },
        rejected: { text: 'Rejected', classes: 'bg-red-500 text-white' },
        active: { text: 'Approved', classes: 'bg-green-500 text-white' }
    };
    const statusInfo = statusStyles[user?.status] || { text: user?.status, classes: 'bg-gray-500 text-white' };

    return (
        <>
            <div 
                className={`fixed inset-0 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            ></div>

            <aside className={`fixed md:relative inset-y-0 left-0 w-64 bg-slate-800 text-white flex-shrink-0 flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:rounded-2xl md:shadow-lg md:m-4 md:h-[calc(100vh-2rem)]`}>
                <div className="p-6 flex flex-col items-center border-b border-slate-700">
                    <img src={user?.avatar || 'https://placehold.co/128x128/e2e8f0/64748b?text=User'} alt="User Avatar" className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-700" />
                    <h2 className="font-semibold text-lg text-center">{user?.name || 'Nama Pengguna'}</h2>
                    <p className="text-sm text-gray-400 mb-2">{user?.email || 'email@pengguna.com'}</p>
                    {user?.status && (
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${statusInfo.classes}`}>
                            {statusInfo.text}
                        </span>
                    )}
                </div>
                <nav className="flex-grow p-4 mb-4 space-y-2">
                    {navLinks && navLinks.map(link => (
                         <NavLink key={link.to} to={link.to} className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
                            {link.icon}
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-700">
                    <Link to="/logout" className="cursor-pointer flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-600 hover:text-white transition-colors">
                        <LogoutIcon />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>
        </>
    );
};

export default ProfileSidebar;
