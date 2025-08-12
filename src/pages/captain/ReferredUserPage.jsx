// pages/captain/ReferredUsersPage.jsx
// Halaman untuk menampilkan statistik dan daftar pengguna yang direferensikan.

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';

// Impor komponen UI
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/common/StatCard';

const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

const ReferredUsersPage = () => {
    // State untuk data dan UI
    const [stats, setStats] = useState({ total_points: 0, successful_referrals: 0 });
    const [referredUsers, setReferredUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // State untuk fungsionalitas tabel
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error("Sesi tidak valid.");
                const authHeader = { headers: { 'Authorization': `Bearer ${token}` } };

                // Mengambil semua data secara paralel untuk efisiensi
                const [statsRes, usersRes, profileRes] = await Promise.all([
                    api.get('/captain/referrals/stats', authHeader),
                    api.get('/captain/referrals', authHeader),
                    api.get('/captain/profile', authHeader) // Untuk data sidebar
                ]);

                setStats(statsRes.data.data);
                setReferredUsers(usersRes.data.data);
                setCurrentUser({
                    name: profileRes.data.coProfile.name,
                    email: profileRes.data.email,
                    status: profileRes.data.status,
                    avatar: profileRes.data.coProfile.selfie_url 
                        ? `http://localhost:3000${profileRes.data.coProfile.selfie_url}` 
                        : "https://placehold.co/96x96/ffffff/ea580c?text=User"
                });

            } catch (err) {
                setError(err.response?.data?.message || "Gagal memuat data rekrutan.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Memoized filtering untuk performa
    const filteredData = useMemo(() => {
        return referredUsers
            .filter(user => {
                if (activeTab === 'all') return true;
                return user.role === activeTab;
            })
            .filter(user => 
                (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
            );
    }, [referredUsers, activeTab, searchTerm]);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    // Props untuk DataTable
    const tabs = [
        { key: 'all', label: 'Semua' },
        { key: 'co', label: 'Captain' },
        { key: 'mitra', label: 'Mitra' }
    ];
    const tableHeaders = ['Nama', 'Role', 'Tanggal Referal', 'Poin', 'Status Reward'];

    const renderUserRow = (user) => (
        <tr key={user.id} className="bg-white border-b hover:bg-slate-50">
            <td className="px-6 py-4 font-medium text-slate-900">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                        {user.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                        <div>{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 capitalize">{user.role}</td>
            <td className="px-6 py-4">{formatDate(user.referral_date)}</td>
            <td className="px-6 py-4 font-semibold">{user.reward_point}</td>
            <td className="px-6 py-4">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    user.reward_status === 'Diberikan' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {user.reward_status}
                </span>
            </td>
        </tr>
    );

    // Link navigasi untuk sidebar
    const captainNavLinks = [
        { to: '/captain/profile', label: 'Profil Saya', icon: <img src="https://icongr.am/feather/user.svg?size=20&color=ffffff" alt="Profil"/> },
        { to: '/captain/recruits', label: 'Rekrutan Saya', icon: <img src="https://icongr.am/feather/users.svg?size=20&color=ffffff" alt="Rekrutan"/> },
    ];

    return (
        <div className="bg-slate-100 min-h-screen">
            <div className="md:flex md:min-h-screen">
                <ProfileSidebar user={currentUser} navLinks={captainNavLinks} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                
                <div className="flex-1 flex flex-col">
                    <header className="bg-white/80 backdrop-blur-md p-4 flex items-center justify-between md:hidden sticky top-0 z-20 shadow-sm">
                        <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600"><MenuIcon /></button>
                        <Link to="/" className="text-xl font-bold text-orange-500">KamarOTO</Link>
                    </header>

                    <main className="flex-1 p-6 md:p-10">
                        <div className="max-w-7xl mx-auto">
                            <header className="mb-8">
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Rekrutan Saya</h1>
                                <p className="text-slate-500 mt-1">Lihat statistik dan daftar pengguna yang berhasil Anda referensikan.</p>
                            </header>

                            {/* Bagian Statistik */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <StatCard 
                                    icon="https://icongr.am/feather/star.svg?size=24&color=currentColor"
                                    title="Total Poin Reward"
                                    value={loading ? '...' : stats.total_points}
                                    colorClass="orange"
                                />
                                <StatCard 
                                    icon="https://icongr.am/feather/user-check.svg?size=24&color=currentColor"
                                    title="Rekrutan Sukses"
                                    value={loading ? '...' : stats.successful_referrals}
                                    colorClass="green"
                                />
                            </div>

                            {/* Bagian Tabel Data */}
                            <DataTable
                                tabs={tabs}
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                searchTerm={searchTerm}
                                onSearchChange={(e) => setSearchTerm(e.target.value)}
                                tableHeaders={tableHeaders}
                                data={filteredData}
                                loading={loading}
                                error={error}
                                renderRow={renderUserRow}
                            />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ReferredUsersPage;
