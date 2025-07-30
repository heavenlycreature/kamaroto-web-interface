// pages/admin/MembershipPage.jsx
// Halaman untuk mengelola data keanggotaan yang sudah disetujui.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import MemberDetailView from '../../components/admin/MemberDetailView';

// --- Komponen Ikon ---
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

const MembershipPage = () => {
    const [view, setView] = useState('list'); // 'list' atau 'detail'
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

        // Hanya fetch data jika dalam tampilan daftar
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
            const response = await api.get(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
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
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                                <>
                                    <div className="bg-white p-4 rounded-xl shadow-md mb-6">
                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                                <button onClick={() => setActiveTab('captain')} className={`cursor-pointer px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'captain' ? 'bg-orange-500 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}>Captain Officer</button>
                                                <button onClick={() => setActiveTab('mitra')} className={`cursor-pointer px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'mitra' ? 'bg-orange-500 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}>Mitra</button>
                                            </div>
                                            <div className="relative w-full sm:w-auto">
                                                <input 
                                                    type="text"
                                                    placeholder="Cari nama atau email..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                        {loading && <p className="p-6 text-center text-slate-500">Memuat data...</p>}
                                        {error && <p className="p-6 text-center text-red-500">{error}</p>}
                                        {!loading && !error && (
                                            <>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm text-left text-slate-500">
                                                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                                            <tr>
                                                                <th scope="col" className="px-6 py-3">Nama {activeTab === 'captain' ? 'Captain' : 'Mitra'}</th>
                                                                <th scope="col" className="px-6 py-3">Jenis</th>
                                                                <th scope="col" className="px-6 py-3">Tanggal Bergabung</th>
                                                                <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredMembers.map(member => (
                                                                <tr key={member.id} className="bg-white border-b hover:bg-slate-50">
                                                                    <td className="px-6 py-4 font-medium text-slate-900">
                                                                        <div className="flex items-center space-x-3">
                                                                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">{member.name.charAt(0)}</div>
                                                                            <div>
                                                                                <div>{member.name}</div>
                                                                                <div className="text-xs text-slate-500">{member.email}</div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4">{activeTab === 'captain' ? 'Captain Officer' : member.mitraProfile?.business_type || 'N/A'}</td>
                                                                    <td className="px-6 py-4">{formatDate(member.created_at)}</td>
                                                                    <td className="px-6 py-4 text-center space-x-2">
                                                                        <button onClick={() => handleDetailClick(member)} className="cursor-pointer  font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors">Detail</button>
                                                                        <button className="cursor-pointer font-semibold text-red-600 hover:text-red-800 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 transition-colors">Hapus</button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {filteredMembers.length === 0 && <p className="p-6 text-center text-slate-500">Tidak ada data ditemukan.</p>}
                                            </>
                                        )}
                                        <div className="p-4 border-t border-slate-200 text-sm text-slate-600">Halaman 1 dari 10</div>
                                    </div>
                                </>
                            ) : (
                                <MemberDetailView 
                                    member={selectedMember} 
                                    type={activeTab} 
                                    onBack={handleBackToList}
                                    showApprovalActions={false} // Pastikan tidak ada tombol approve/reject
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
