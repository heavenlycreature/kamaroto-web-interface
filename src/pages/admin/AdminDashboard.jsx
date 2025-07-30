// pages/admin/AdminDashboard.jsx
// Halaman dashboard utama untuk admin, sekarang mengambil data statistik langsung dari backend.

import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
axios.defaults.baseURL = "http://localhost:3000"; // Pastikan ini sesuai dengan URL backend Anda
import AdminSidebar from '../../components/admin/AdminSidebar'; // Impor sidebar

// --- Komponen Ikon (SVG Inline) ---
const MembersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const MitraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>;
const ApprovalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><polyline points="12 6 12 12 16 14"></polyline></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

// --- Komponen Kartu Statistik ---
const StatCard = ({ title, value, icon, gradient, linkTo }) => (
    <Link to={linkTo} className={`block p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1.5 transition-all duration-300 ${gradient}`}>
        <div className="flex justify-between items-center">
            <div className="flex flex-col">
                <p className="text-base font-medium opacity-90">{title}</p>
                <p className="text-5xl font-bold mt-1">{value}</p>
            </div>
            <div className="p-4 bg-white bg-opacity-20 rounded-full">
                {icon}
            </div>
        </div>
    </Link>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({ approvedCaptains: 0, approvedMitras: 0, pendingUsers: 0 });
    const [loading, setLoading] = useState(true);
    const [adminData, setAdminData] = useState({ name: '', email: '' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {

        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            // Asumsi backend akan mengirim 'name' saat login di masa depan.
            // Jika tidak, Anda bisa melakukan fetch terpisah untuk mendapatkan nama.
            setAdminData({
                name: storedUser.name || 'Admin', // Fallback ke 'Admin' jika nama tidak ada
                email: storedUser.email
            });
        }

        const fetchStats = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };

                // Definisikan endpoint Anda sesuai dengan adminRoutes.js
                const endpoints = {
                    captains: '/admin/co/verified',
                    mitras: '/admin/mitra/registered',
                    pendingCo: '/admin/co/pending',
                    // Asumsi Anda akan membuat endpoint ini untuk mitra pending
                    pendingMitra: '/admin/mitra/pending' 
                };

                // Ambil semua data secara paralel
                const [captainsRes, mitrasRes, pendingCoRes, pendingMitraRes] = await Promise.all([
                    axios.get(endpoints.captains, { headers }),
                    axios.get(endpoints.mitras, { headers }),
                    axios.get(endpoints.pendingCo, { headers }),
                    axios.get(endpoints.pendingMitra, { headers }).catch(() => ({ data: { total: 0 } })) // Fallback jika endpoint belum ada
                ]);
                
                // Jumlahkan total user yang menunggu persetujuan
                const totalPending = (pendingCoRes.data.total || 0) + (pendingMitraRes.data.total || 0);

                // Perbarui state dengan total dari setiap response
                setStats({
                    approvedCaptains: captainsRes.data.total || 0,
                    approvedMitras: mitrasRes.data.total || 0,
                    pendingUsers: totalPending,
                });

            } catch (error) {
                console.error("Gagal memuat statistik:", error.response?.data?.message || error.message);
                // Opsional: tampilkan pesan error di UI
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="bg-slate-100 min-h-screen">
            <div className="md:flex md:min-h-screen">
                <AdminSidebar adminName={adminData.name} adminEmail={adminData.email} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                
                <div className="flex-1 flex flex-col">
                    <header className="bg-white/80 backdrop-blur-md p-4 flex items-center justify-between md:hidden sticky top-0 z-20 shadow-sm">
                        <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600"><MenuIcon /></button>
                        <Link to="/" className="text-xl font-bold text-orange-500">KamarOTO</Link>
                    </header>

                    <main className="flex-1 p-6 md:p-10">
                        <div className="max-w-7xl mx-auto">
                            <header className="mb-10">
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Dashboard Overview</h1>
                                <p className="text-slate-500 mt-1">Selamat datang kembali, {adminData.name}!</p>
                            </header>

                            <section>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <StatCard 
                                        title="Captain Officer"
                                        value={loading ? '...' : stats.approvedCaptains}
                                        icon={<MembersIcon />}
                                        gradient="bg-gradient-to-br from-green-500 to-green-600"
                                        linkTo="/admin/keanggotaan/captains"
                                    />
                                     <StatCard 
                                        title="Mitra"
                                        value={loading ? '...' : stats.approvedMitras}
                                        icon={<MitraIcon />}
                                        gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                                        linkTo="/admin/keanggotaan/mitras"
                                    />
                                     <StatCard 
                                        title="Menunggu Persetujuan"
                                        value={loading ? '...' : stats.pendingUsers}
                                        icon={<ApprovalIcon />}
                                        gradient="bg-gradient-to-br from-red-500 to-red-600"
                                        linkTo="/admin/persetujuan"
                                    />
                                </div>
                            </section>

                            <section className="mt-12">
                                <div className="bg-white p-6 rounded-2xl shadow-lg">
                                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Grafik Pendaftaran</h2>
                                    <div className="h-80 flex items-center justify-center text-slate-400">
                                        <p>Placeholder untuk grafik pendaftaran.</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
