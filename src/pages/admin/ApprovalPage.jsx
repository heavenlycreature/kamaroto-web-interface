// pages/admin/ApprovalPage.jsx
// Halaman ini telah diperbarui untuk memperbaiki endpoint API approve/reject.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import MemberDetailView from '../../components/admin/MemberDetailView';
import ConfirmationModal from '../../components/ConfirmationModal';
import RejectionModal from '../../components/RejectionModal';

const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

const ApprovalPage = () => {
    const [view, setView] = useState('list');
    const [activeTab, setActiveTab] = useState('captain');
    const [pendingMembers, setPendingMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adminData, setAdminData] = useState({ name: 'Admin', email: 'admin@kamaroto.com' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmation, setConfirmation] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, intent: 'danger' });
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) setAdminData({ name: storedUser.name || 'Admin', email: storedUser.email });
        if (view === 'list') {
            fetchPendingMembers();
        }
    }, [activeTab, view]);

    const fetchPendingMembers = async () => {
        setLoading(true);
        setError(null);
        setPendingMembers([]);
        const endpoint = activeTab === 'captain' ? '/admin/co/pending' : '/admin/mitra/pending';
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(endpoint, { headers: { 'Authorization': `Bearer ${token}` } });
            if (Array.isArray(response.data.data)) {
                setPendingMembers(response.data.data);
            } else {
                throw new Error("Format data tidak valid.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Gagal memuat data persetujuan.");
        } finally {
            setLoading(false);
        }
    };
    
    // --- PERBAIKAN: Fungsi Aksi digabungkan dan diperbaiki ---
    const handleAction = (userId, action) => { // action: 'approve' atau 'reject'
        const actionText = action === 'approve' ? 'menyetujui' : 'menolak';
        const memberToAction = pendingMembers.find(m => m.id === userId) || selectedMember;
        setSelectedMember(memberToAction);

        if (action === 'approve') {
            setConfirmation({
                isOpen: true,
                title: 'Konfirmasi Persetujuan',
                message: `Apakah Anda yakin ingin ${actionText} anggota ini?`,
                onConfirm: () => performAction(userId, action),
                intent: 'success'
            });
        } else if (action === 'reject') {
            setIsRejectionModalOpen(true);
        }
    };

    const performAction = async (userId, action, details = {}) => {
        const userType = activeTab === 'captain' ? 'co' : 'mitra';
        const actionEndpoint = action === 'approve' ? 'approved' : 'rejected'; // Gunakan 'approved'/'rejected' sesuai route
        const actionText = action === 'approve' ? 'menyetujui' : 'menolak';
        const endpoint = `/admin/${userType}/${actionEndpoint}/${userId}`;

        try {
            const token = localStorage.getItem('token');
            await api.put(endpoint, details, { headers: { 'Authorization': `Bearer ${token}` } });
            alert(`Pengguna berhasil di-${actionText}.`);
            fetchPendingMembers();
            handleBackToList();
        } catch (err) {
            console.error(`${actionText} Error:`, err.response || err);
            alert(`Gagal ${actionText} pengguna: ${err.response?.data?.message || err.message}`);
        } finally {
            closeConfirmation();
            setIsRejectionModalOpen(false);
        }
    };

    const handleRejectSubmit = (reason, allowResubmit) => {
        performAction(selectedMember.id, 'reject', {
            rejection_reason: reason,
            resubmit_allowed: allowResubmit
        });
    };

    const closeConfirmation = () => setConfirmation({ ...confirmation, isOpen: false });
    const handleDetailClick = (member) => { setSelectedMember(member); setView('detail'); };
    const handleBackToList = () => { setSelectedMember(null); setView('list'); };

    const filteredMembers = pendingMembers.filter(member => 
        (member.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (member.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <ConfirmationModal {...confirmation} onClose={closeConfirmation} confirmText="Approve" />
            <RejectionModal isOpen={isRejectionModalOpen} onClose={() => setIsRejectionModalOpen(false)} onSubmit={handleRejectSubmit} />
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
                                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Persetujuan Anggota</h1>
                                    <p className="text-slate-500 mt-1">Review dan setujui pendaftaran baru.</p>
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
                                                    <input type="text" placeholder="Cari nama atau email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
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
                                                                    <th scope="col" className="px-6 py-3">Nama Lengkap</th>
                                                                    <th scope="col" className="px-6 py-3">No HP / WA</th>
                                                                    <th scope="col" className="px-6 py-3 text-center">Review Formulir</th>
                                                                    <th scope="col" className="px-6 py-3 text-center">Persetujuan</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {filteredMembers.map(member => (
                                                                    <tr key={member.id} className="bg-white border-b hover:bg-slate-50">
                                                                        <td className="px-6 py-4 font-medium text-slate-900">
                                                                            <div>{member.name}</div>
                                                                            <div className="text-xs text-slate-500">{member.email}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4">{member.phone}</td>
                                                                        <td className="px-6 py-4 text-center">
                                                                            <button onClick={() => handleDetailClick(member)} className="cursor-pointer font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors">Review</button>
                                                                        </td>
                                                                        <td className="px-6 py-4 text-center space-x-2">
                                                                            <button onClick={() => handleAction(member.id, 'approve')} className="cursor-pointer font-semibold text-green-600 px-3 py-1.5 rounded-lg bg-green-100 hover:bg-green-200 transition-colors">Approve</button>
                                                                            <button onClick={() => handleAction(member.id, 'reject')} className="cursor-pointer font-semibold text-red-600 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 transition-colors">Reject</button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    {filteredMembers.length === 0 && <p className="p-6 text-center text-slate-500">Tidak ada pendaftaran yang menunggu persetujuan.</p>}
                                                </>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <MemberDetailView 
                                        member={selectedMember} 
                                        type={activeTab} 
                                        onBack={handleBackToList}
                                        onApprove={() => handleAction(selectedMember.id, 'approve')}
                                        onReject={() => handleAction(selectedMember.id, 'reject')}
                                        showApprovalActions={true}
                                    />
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ApprovalPage;
