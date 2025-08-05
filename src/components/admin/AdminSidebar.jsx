// components/admin/AdminSidebar.jsx
// Komponen sidebar yang bisa digunakan kembali untuk semua halaman admin.

import React from 'react';
import { Link, NavLink } from 'react-router-dom';

// Kumpulan Ikon
const OverviewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const MembersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const ApprovalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><polyline points="12 6 12 12 16 14"></polyline></svg>;
const TransactionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const PersonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

const AdminSidebar = ({ adminName, adminEmail, isOpen, setIsOpen }) => (
    <>
        <div 
            className={`fixed inset-0 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsOpen(false)}
        ></div>
        
        <aside className={`fixed md:relative inset-y-0 left-0 w-64 bg-slate-800 text-white flex-shrink-0 flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:rounded-2xl md:shadow-lg md:m-4 md:h-[calc(100vh-2rem)]`}>
            <div className="p-6 flex flex-col items-center border-b border-slate-700">
                <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center mb-4">
                    <PersonIcon />
                </div>
                <h2 className="font-semibold text-lg text-center">{adminName}</h2>
                <p className="text-sm text-slate-400">{adminEmail}</p>
            </div>
            <nav className="flex-grow p-4">
                <NavLink to="/admin/dashboard" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}><OverviewIcon /><span>Overview</span></NavLink>
                <NavLink to="/admin/membership" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 mt-2 rounded-lg transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}><MembersIcon /><span>Keanggotaan</span></NavLink>
                <NavLink to="/admin/approval" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 mt-2 rounded-lg transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}><ApprovalIcon /><span>Persetujuan</span></NavLink>
                <NavLink to="/admin/pengaturan" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 mt-2 rounded-lg transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}><TransactionIcon /><span>Pengaturan</span></NavLink>
            </nav>
            <div className="p-4 border-t border-slate-700">
                <Link to="/logout" className="cursor-pointer flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-600 hover:text-white transition-colors"><LogoutIcon /><span>Logout</span></Link>
            </div>
        </aside>
    </>
);

export default AdminSidebar;
