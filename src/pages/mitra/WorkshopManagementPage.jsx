// pages/mitra/WorkshopManagementPage.jsx
// Halaman manajemen bengkel untuk Mitra dengan fungsionalitas penuh.

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import api from '../../api/api';
import MechanicModal from '../../components/mitra/MechanicModal'; // <-- Impor modal baru
import StoreInfoTab from '../../components/mitra/StoreInfoTab';

// --- Komponen Ikon ---
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const StoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0L22 13.41a1 1 0 0 0 0-1.41L12 2z"></path><path d="M7 7h.01"></path></svg>;

// --- Komponen Tab ---
const DashboardOverview = ({ stats, schedule, mechanics, loading }) => {
    const statusInfo = {
        AVAILABLE: { text: "Available", color: "bg-green-500" },
        ON_LEAVE: { text: "On Leave", color: "bg-red-500" },
        // Tambahkan status lain dari backend jika ada (misal: BUSY, ON_BREAK)
        BUSY: { text: "Busy", color: "bg-blue-500" },
        ON_BREAK: { text: "On Break", color: "bg-yellow-500" },
        INACTIVE: { text: "Inactive", color: "bg-slate-500" },
    };
    
    if (loading) {
        return <p className="text-center py-10 text-slate-500">Memuat ringkasan dashboard...</p>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stat => (
                    <div key={stat.title} className="bg-white p-6 rounded-xl shadow-md">
                        <p className="text-sm text-slate-500">{stat.title}</p>
                        <div className="flex items-baseline space-x-2 mt-2">
                            <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                            {stat.change && <p className={`text-sm font-semibold ${stat.changeColor}`}>{stat.change}</p>}
                        </div>
                        {stat.isProgress && (
                            <div className="w-full bg-slate-200 rounded-full h-2.5 mt-3">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${stat.progress}%` }}></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="font-semibold text-slate-800 mb-4">Jadwal Hari Ini</h3>
                    <div className="space-y-3">
                        {schedule.length > 0 ? schedule.map(item => (
                            <div key={item.time} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                                <span className="font-medium text-slate-700">{item.time}</span>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${item.color}`}>{item.status}</span>
                            </div>
                        )) : <p className="text-center text-slate-400 py-8">Tidak ada jadwal hari ini.</p>}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="font-semibold text-slate-800 mb-4">Status Mekanik</h3>
                    <div className="space-y-4">
                        {mechanics.length > 0 ? mechanics.map(mech => (
                            <div key={mech.id} className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${statusInfo[mech.status]?.color || 'bg-gray-400'}`}></div>
                                    <span className="text-slate-700">{mech.name}</span>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${statusInfo[mech.status]?.color || 'bg-gray-400'}`}>{statusInfo[mech.status]?.text || mech.status}</span>
                            </div>
                        )) : <p className="text-center text-slate-400 py-8">Belum ada data mekanik.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SlotCapacity = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const today = new Date();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Manajemen Slot & Kapasitas</h2>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300">Bulk Update</button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600">
                        <PlusIcon /> Tambah Slot Waktu
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white p-5 rounded-xl shadow-md">
                    <h3 className="font-semibold text-slate-800 mb-4">Pilih Tanggal</h3>
                    <div className="text-center font-semibold mb-2">{selectedDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-2">
                        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {[...Array(31).keys()].map(i => (
                            <button key={i} className={`w-9 h-9 rounded-full hover:bg-orange-100 ${i + 1 === today.getDate() ? 'bg-orange-500 text-white' : ''}`}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-md">
                    <h3 className="font-semibold text-slate-800 mb-4">Jadwal untuk {selectedDate.toLocaleDateString('id-ID')}</h3>
                    <div className="h-64 flex items-center justify-center text-slate-400 border-2 border-dashed rounded-lg">
                        <p>Pilih tanggal untuk melihat atau menambah slot.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MechanicsManagement = ({ mechanics, onAdd, onEdit, onDelete, loading, error }) => {
    const statusInfo = {
        AVAILABLE: { text: "Available", color: "text-green-500", bg: "bg-green-500" },
        ON_LEAVE: { text: "On Leave", color: "text-red-500", bg: "bg-red-500" },
        INACTIVE: { text: "Inactive", color: "text-slate-500", bg: "bg-slate-500" },
    };

    if (loading) return <p className="text-center py-10 text-slate-500">Memuat data mekanik...</p>;
    if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Manajemen Mekanik</h2>
                <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors">
                    <PlusIcon /> Tambah Mekanik
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mechanics.map(mech => (
                    <div key={mech.id} className="bg-white p-5 rounded-xl shadow-md">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-4">
                                <img src={mech.photoUrl ? `http://localhost:3000${mech.photoUrl}` : `https://placehold.co/64x64/e2e8f0/64748b?text=${mech.name.charAt(0)}`} alt={mech.name} className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold text-slate-800">{mech.name}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <div className={`w-2.5 h-2.5 rounded-full ${statusInfo[mech.status]?.bg || 'bg-gray-400'}`}></div>
                                        <p className={`text-sm font-semibold ${statusInfo[mech.status]?.color || 'text-gray-500'}`}>{statusInfo[mech.status]?.text || mech.status}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-1">
                                <button onClick={() => onEdit(mech)} className="text-slate-400 hover:text-blue-600 p-1">Edit</button>
                                <button onClick={() => onDelete(mech.id)} className="text-slate-400 hover:text-red-600 p-1">Hapus</button>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="text-sm font-semibold text-slate-600">Keahlian</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {mech.skillset ? mech.skillset.split(',').map(skill => (
                                    <span key={skill} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md">{skill.trim()}</span>
                                )) : <p className="text-xs text-slate-400 italic">Belum ada keahlian.</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WorkshopManagementPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [mechanics, setMechanics] = useState([]);
    const [mechanicsLoading, setMechanicsLoading] = useState(true);
    const [mechanicsError, setMechanicsError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMechanic, setSelectedMechanic] = useState(null);

    const [dashboardStats, setDashboardStats] = useState([]);
    const [dashboardSchedule, setDashboardSchedule] = useState([]);
    const [dashboardLoading, setDashboardLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Sesi tidak valid.");
            const response = await api.get('/mitra/profile', { headers: { 'Authorization': `Bearer ${token}` } });
            setProfileData(response.data);
        } catch (err) {
            console.error("Gagal memuat profil:", err);
        } finally {
            setLoading(false); // Set loading false setelah fetch pertama selesai
        }
    };
    useEffect(() => { fetchProfile(); }, []);

    useEffect(() => {
        if (activeTab === 'mechanics') {
            fetchMechanics();
        }
        if (activeTab === 'dashboard') {
            fetchDashboardData();
        }
    }, [activeTab]);

    const fetchMechanics = async () => {
        setMechanicsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/mitra/mechanics', { headers: { 'Authorization': `Bearer ${token}` } });
            setMechanics(response.data.data || []);
        } catch (err) {
            setMechanicsError('Gagal memuat data mekanik.');
        } finally {
            setMechanicsLoading(false);
        }
    };

    const fetchDashboardData = async () => {
        setDashboardLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Asumsi ada endpoint untuk stats, jika belum ada, bisa digabung dengan fetchMechanics
            // const statsResponse = await api.get('/mitra/workshop/stats', { headers: { 'Authorization': `Bearer ${token}` } });
            // setDashboardStats(statsResponse.data.data);

            // Untuk sekarang, kita akan re-use data mekanik yang sudah ada
            if (mechanics.length === 0) {
                await fetchMechanics();
            }
            
            // Placeholder untuk stats dan schedule
            setDashboardStats([
                { title: "Total Mekanik", value: mechanics.length, change: "", changeColor: "" },
                { title: "Tersedia Hari Ini", value: mechanics.filter(m => m.status === 'AVAILABLE').length },
                { title: "Pekerjaan Terjadwal", value: "0" }, // Data ini perlu dari API
                { title: "Penggunaan Kapasitas", value: "0%", isProgress: true, progress: 0 }, // Data ini perlu dari API
            ]);
            setDashboardSchedule([]); // Data ini perlu dari API

        } catch (err) {
            console.error("Gagal memuat data dashboard", err);
        } finally {
            setDashboardLoading(false);
        }
    };

    const handleAddMechanic = () => {
        setSelectedMechanic(null);
        setIsModalOpen(true);
    };

    const handleEditMechanic = (mechanic) => {
        setSelectedMechanic(mechanic);
        setIsModalOpen(true);
    };

    const handleDeleteMechanic = async (mechanicId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus mekanik ini?')) {
            try {
                const token = localStorage.getItem('token');
                await api.delete(`/mitra/mechanics/${mechanicId}`, { headers: { 'Authorization': `Bearer ${token}` } });
                fetchMechanics();
            } catch (err) {
                alert('Gagal menghapus mekanik.');
            }
        }
    };

    const handleSaveMechanic = async (formData, mechanicId) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' };
            if (mechanicId) {
                await api.put(`/mitra/mechanics/${mechanicId}`, formData, { headers });
            } else {
                await api.post('/mitra/mechanics', formData, { headers });
            }
            setIsModalOpen(false);
            fetchMechanics();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menyimpan data.');
        }
    };

    const mitraNavLinks = useMemo(() => {
        const baseLinks = [
            { to: '/mitra/profile', label: 'Profil Saya', icon: <img src="https://icongr.am/feather/user.svg?size=20&color=currentColor" alt="Profil" /> }
        ];
        const businessType = profileData?.mitraProfile?.business_type;
        if (['jual_beli_kendaraan', 'jual_beli_sparepart'].includes(businessType)) {
            baseLinks.push({ to: '/mitra/store', label: 'Toko Saya', icon: <img src="https://icongr.am/feather/shopping-bag.svg?size=20&color=currentColor" alt="Toko" /> });
        } else if (['bengkel', 'cuci_kendaraan', 'sewa_kendaraan'].includes(businessType)) {
            baseLinks.push({ to: '/mitra/workshop', label: 'Manajemen Bengkel', icon: <img src="https://icongr.am/feather/tool.svg?size=20&color=currentColor" alt="Bengkel" /> });
        }
        return baseLinks;
    }, [profileData]);

    const storeData = useMemo(() => {
        if (!profileData) return null;
        return {
            name: profileData.mitraProfile?.business_name,
            about: profileData.mitraProfile?.business_description,
            slug: profileData.mitraProfile?.business_slug,
            openHours: profileData.mitraProfile?.openHours,
            logoUrl: profileData.mitraProfile?.business_logo_url ? `http://localhost:3000${profileData.mitraProfile.business_logo_url}` : "https://placehold.co/128x128/e2e8f0/64748b?text=Logo",
            bannerUrl: profileData.mitraProfile?.business_banner_url ? `http://localhost:3000${profileData.mitraProfile.business_banner_url}` : "https://placehold.co/600x250/e2e8f0/64748b?text=Banner"
        };
    }, [profileData]);

    const renderContent = () => {
        switch (activeTab) {
            case 'store':
                return <StoreInfoTab storeData={storeData} onUpdateSuccess={fetchProfile} />;
            case 'mechanics': 
                return <MechanicsManagement 
                    mechanics={mechanics} 
                    onAdd={handleAddMechanic} onEdit={handleEditMechanic} onDelete={handleDeleteMechanic}
                    loading={mechanicsLoading} error={mechanicsError}
                />;
            case 'slots': return <SlotCapacity />;
            case 'dashboard':
            default: 
                return <DashboardOverview 
                    stats={dashboardStats}
                    schedule={dashboardSchedule}
                    mechanics={mechanics}
                    loading={dashboardLoading || mechanicsLoading}
                />;
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <>
            <MechanicModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveMechanic}
                mechanic={selectedMechanic}
            />
            <div className="bg-slate-100 min-h-screen">
                <div className="md:flex md:min-h-screen">
                    <ProfileSidebar
                        user={{
                            avatar: profileData?.mitraProfile?.business_logo_url ? `http://localhost:3000${profileData.mitraProfile.business_logo_url}` : null,
                            name: profileData?.mitraProfile?.business_name || 'Mitra Usaha',
                            email: profileData?.email || '...',
                            status: profileData?.status
                        }}
                        navLinks={mitraNavLinks}
                        isOpen={isSidebarOpen}
                        setIsOpen={setIsSidebarOpen}
                    />
                    <div className="flex-1 flex flex-col">
                        <header className="bg-white/80 backdrop-blur-md p-4 flex items-center justify-between md:hidden sticky top-0 z-20 shadow-sm">
                            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600"><MenuIcon /></button>
                            <Link to="/" className="text-xl font-bold text-orange-500">KamarOTO</Link>
                        </header>
                        <main className="flex-1 p-6 md:p-10">
                            <div className="max-w-7xl mx-auto">
                                <header className="mb-8">
                                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Workshop Management</h1>
                                    <p className="text-slate-500 mt-1">Kelola mekanik dan kapasitas bengkel Anda.</p>
                                </header>
                                <div className="mb-6">
                                    <div className="bg-slate-200 p-1.5 rounded-xl inline-flex space-x-1">
                                        <button onClick={() => setActiveTab('store')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${activeTab === 'store' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}>Personalisasi Toko</button>
                                        <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${activeTab === 'dashboard' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}>Dashboard Overview</button>
                                        <button onClick={() => setActiveTab('mechanics')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${activeTab === 'mechanics' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}>Mechanics Management</button>
                                        <button onClick={() => setActiveTab('slots')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${activeTab === 'slots' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}>Slot & Capacity</button>
                                    </div>
                                </div>
                                {renderContent()}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WorkshopManagementPage;
