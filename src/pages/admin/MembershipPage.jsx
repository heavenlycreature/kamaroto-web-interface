// pages/admin/MembershipPage.jsx
// Halaman untuk mengelola data keanggotaan, sekarang menggunakan komponen DataTable.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import MemberDetailView from '../../components/admin/MemberDetailView';
import DataTable from '../../components/common/DataTable'; // <-- 1. Impor komponen baru

// --- Komponen Ikon ---
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

const MembershipPage = () => {
    // Semua state dan logika tetap di sini (komponen induk)
    const [view, setView] = useState('list');
    const [activeTab, setActiveTab] = useState('captain');
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [adminData, setAdminData] = useState({ name: 'Admin', email: 'admin@kamaroto.com' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setAdminData({ name: storedUser.name || 'Admin', email: storedUser.email });
        }
        if (view === 'list') {
            fetchMembers();
        }
    }, [activeTab, view]);

    const fetchMembers = async () => {
        setLoading(true);
        setError(null);
        setMembers([]);
        const endpoint = activeTab === 'captain' ? '/admin/co/verified' : '/admin/mitra/registered';
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(endpoint, { headers: { 'Authorization': `Bearer ${token}` } });
            if (Array.isArray(response.data.data)) {
                setMembers(response.data.data);
            } else {
                throw new Error("Format data tidak valid.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Gagal memuat data keanggotaan.");
        } finally {
            setLoading(false);
        }
    };

    const filteredMembers = members.filter(member =>
        (member.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (member.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    const handleDetailClick = (member) => {
        setSelectedMember(member);
        setView('detail');
    };

    const handleBackToList = () => {
        setSelectedMember(null);
        setView('list');
    };

    // --- 2. Siapkan props dinamis untuk DataTable ---
    const tabs = [
        { key: 'captain', label: 'Captain Officer' },
        { key: 'mitra', label: 'Mitra' }
    ];

    const tableHeaders = [
        `Nama ${activeTab === 'captain' ? 'Captain' : 'Mitra'}`,
        'Jenis',
        'Tanggal Bergabung',
        'Aksi'
    ];

    // --- 3. Buat fungsi `renderRow` untuk "menyuntikkan" JSX ke dalam DataTable ---
    const renderMemberRow = (member) => (
        <tr key={member.id} className="bg-white border-b hover:bg-slate-50">
            <td className="px-6 py-4 font-medium text-slate-900">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                        {member.name?.charAt(0) || '?'}
                    </div>
                    <div>
                        <div>{member.name}</div>
                        <div className="text-xs text-slate-500">{member.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">{activeTab === 'captain' ? 'Captain Officer' : member.mitraProfile?.business_type || 'N/A'}</td>
            <td className="px-6 py-4">
                {member.referrer ? (
                    <div>
                        <div className="font-medium text-slate-800">{member.referrer.name}</div>
                        <div className="text-xs text-slate-500">{member.referrer.email}</div>
                    </div>
                ) : (
                    <span className="text-slate-400">-</span>
                )}
            </td>
            <td className="px-6 py-4">{formatDate(member.created_at)}</td>
            <td className="px-6 py-4 text-center space-x-2">
                <button onClick={() => handleDetailClick(member)} className="cursor-pointer font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors">Detail</button>
                <button className="cursor-pointer font-semibold text-red-600 hover:text-red-800 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 transition-colors">Hapus</button>
            </td>
        </tr>
    );

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
                            <header className="mb-8">
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Manajemen Keanggotaan</h1>
                                <p className="text-slate-500 mt-1">Lihat dan kelola data Captain Officer dan Mitra.</p>
                            </header>
                            {view === 'list' ? (
                                // --- 4. Ganti semua JSX yang kompleks dengan satu panggilan komponen DataTable ---
                                <DataTable
                                    tabs={tabs}
                                    activeTab={activeTab}
                                    onTabChange={setActiveTab}
                                    searchTerm={searchTerm}
                                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                                    tableHeaders={tableHeaders}
                                    data={filteredMembers}
                                    loading={loading}
                                    error={error}
                                    renderRow={renderMemberRow}
                                    paginationContent="Halaman 1 dari 10" // Anda bisa membuatnya dinamis nanti
                                />
                            ) : (
                                <MemberDetailView
                                    member={selectedMember}
                                    type={activeTab}
                                    onBack={handleBackToList}
                                    showApprovalActions={false}
                                />
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MembershipPage;