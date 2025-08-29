// pages/mitra/StoreProfilePage.jsx
// Halaman manajemen toko Mitra dengan desain dan fungsionalitas profesional.

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import StoreInfoTab from '../../components/mitra/StoreInfoTab';
import api from '../../api/api';

// --- Komponen Ikon ---
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const StoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0L22 13.41a1 1 0 0 0 0-1.41L12 2z"></path><path d="M7 7h.01"></path></svg>;
const PackageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4A2 2 0 0 1 2 16.77V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"></path><polyline points="2,8 12,13 22,8"></polyline><line x1="12" y1="22.76" x2="12" y2="13"></line></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6"></path><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

const TransactionHistoryTab = () => {
    const transactions = [
        { id: 'TRX001', date: '28 Agu 2025', customer: 'Budi Santoso', total: 'Rp 850.000', status: 'Selesai' },
        { id: 'TRX002', date: '27 Agu 2025', customer: 'Citra Lestari', total: 'Rp 550.000', status: 'Diproses' },
        { id: 'TRX003', date: '25 Agu 2025', customer: 'Agus Wijaya', total: 'Rp 1.200.000', status: 'Selesai' },
        { id: 'TRX004', date: '24 Agu 2025', customer: 'Dewi Anggraini', total: 'Rp 350.000', status: 'Dibatalkan' },
    ];
    const statusColors = {
        'Selesai': 'bg-green-100 text-green-800',
        'Diproses': 'bg-yellow-100 text-yellow-800',
        'Dibatalkan': 'bg-red-100 text-red-800',
    };
    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <select className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option>Filter Status</option>
                        <option>Selesai</option>
                        <option>Diproses</option>
                        <option>Dibatalkan</option>
                    </select>
                    <input type="date" className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <button className="cursor-pointer px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors">Ekspor Data</button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Order ID</th>
                                <th scope="col" className="px-6 py-3">Tanggal</th>
                                <th scope="col" className="px-6 py-3">Pelanggan</th>
                                <th scope="col" className="px-6 py-3">Total</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => (
                                <tr key={tx.id} className="bg-white border-b hover:bg-slate-50 cursor-pointer">
                                    <td className="px-6 py-4 font-medium text-slate-900">{tx.id}</td>
                                    <td className="px-6 py-4">{tx.date}</td>
                                    <td className="px-6 py-4">{tx.customer}</td>
                                    <td className="px-6 py-4 font-semibold">{tx.total}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[tx.status]}`}>{tx.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


const ItemCard = ({ item, onDelete }) => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = (e) => {
        e.stopPropagation();
        if (item.media && item.media.length > 1) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % item.media.length);
        }
    };

    const prevImage = (e) => {
        e.stopPropagation();
        if (item.media && item.media.length > 1) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + item.media.length) % item.media.length);
        }
    };

    const renderCardDetails = () => {
        if (item.type === 'VEHICLE' && item.vehicleDetail) {
            return (
                <div className="flex justify-between text-sm text-slate-500 mt-2 border-t pt-2">
                    <span>{item.vehicleDetail.brand} {item.vehicleDetail.year}</span>
                    <span>{item.vehicleDetail.odometer?.toLocaleString('id-ID') || 'N/A'} km</span>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col group">
            <div className="relative w-full h-48">
                <img
                    src={item.media && item.media.length > 0 ? `http://localhost:3000${item.media[currentImageIndex].url}` : 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image'}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {item.media && item.media.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">&lt;</button>
                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">&gt;</button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
                            {item.media.map((_, index) => (
                                <div key={index} className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}></div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-bold text-slate-800 text-lg">{item.title}</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2 flex-grow">{item.description}</p>

                <div className="mt-3">
                    {renderCardDetails()}
                </div>
                <p className="text-2xl font-extrabold text-orange-600 mt-3">Rp {parseFloat(item.price).toLocaleString('id-ID')}</p>
            </div>
            <div className="p-4 bg-slate-50 flex justify-end space-x-2">
                <button 
                    onClick={() => navigate(`/mitra/store/product/${item.id}`)}
                    className="px-4 py-1.5 text-sm font-semibold text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
                >
                    Edit
                </button>
                <button
                onClick={() => onDelete(item.id)}  
                className="px-4 py-1.5 text-sm font-semibold text-red-600 bg-red-100 rounded-md hover:bg-red-200">Hapus</button>
            </div>
        </div>
    );
};

const StoreItemsTab = ({ businessType }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/mitra/products', { headers: { 'Authorization': `Bearer ${token}` } });
                // [PERBAIKAN] Langsung gunakan data dari API, hapus data placeholder
                console.log("Data produk yang diterima dari API:", response.data.data);
                setProducts(response.data.data || []);
            } catch (err) {
                setError('Gagal memuat produk. Silakan coba lagi nanti.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
    
    const handleDeleteProduct = async (productId) => {
        // 1. Minta konfirmasi dari pengguna (PENTING untuk UX)
        if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.")) {
            return; // Batalkan jika pengguna menekan "Cancel"
        }

        try {
            const token = localStorage.getItem('token');
            // 2. Panggil endpoint API untuk menghapus
            await api.delete(`/mitra/products/${productId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // 3. Jika berhasil, perbarui state products di frontend
            // Ini akan membuat item langsung hilang dari UI tanpa refresh
            setProducts(currentProducts => 
                currentProducts.filter(product => product.id !== productId)
            );

            // Beri notifikasi sukses (opsional)
            alert('Produk berhasil dihapus.');

        } catch (err) {
            console.error("Error saat menghapus produk:", err);
            // Tampilkan error ke pengguna
            setError('Gagal menghapus produk. Silakan coba lagi.');
        }
    };

    const getAddItemButtonText = () => {
        switch (businessType) {
            case 'jual_beli_kendaraan': return 'Tambah Kendaraan';
            default: return 'Tambah Item';
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <input type="text" placeholder="Cari Barang & Jasa" className="w-full md:max-w-xs pl-4 pr-4 py-2 border border-slate-300 rounded-lg" />
                <button onClick={() => navigate('/mitra/store/product/new')} className="flex items-center gap-2 w-full md:w-auto justify-center px-5 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600">
                    <PlusIcon/> {getAddItemButtonText()}
                </button>
            </div>

            <div className="mt-6 border-t pt-6">
                {loading ? (
                    <p className="text-center py-10 text-slate-500">Memuat produk...</p>
                ) : error ? (
                    <p className="text-center py-10 text-red-500">{error}</p>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(item => <ItemCard key={item.id} item={item} onDelete={handleDeleteProduct} />)}
                    </div>
                ) : (
                    <p className="text-center py-10 text-slate-500">Belum ada barang.</p>
                )}
            </div>
        </div>
    );
};

const StoreProfilePage = () => {
    const [activeTab, setActiveTab] = useState('store');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Sesi tidak valid.");
            const response = await api.get('/mitra/profile', { headers: { 'Authorization': `Bearer ${token}` } });
            setProfileData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Gagal memuat data toko.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const renderContent = () => {
        if (loading) return <p className="text-center text-slate-500">Memuat data toko...</p>;
        if (error) return <p className="text-center text-red-500">{error}</p>;
        if (!profileData) return null;

        const storeData = {
            name: profileData.mitraProfile?.business_name,
            about: profileData.mitraProfile?.business_description,
            slug: profileData.mitraProfile?.business_slug,
            openHours: profileData.mitraProfile?.openHours,
            logoUrl: profileData.mitraProfile?.business_logo_url ? `http://localhost:3000${profileData.mitraProfile.business_logo_url}` : "https://placehold.co/128x128/e2e8f0/64748b?text=Logo",
            bannerUrl: profileData.mitraProfile?.business_banner_url ? `http://localhost:3000${profileData.mitraProfile.business_banner_url}` : "https://placehold.co/600x250/e2e8f0/64748b?text=Banner"
        };

        switch (activeTab) {
            case 'items':
                return <StoreItemsTab businessType={profileData.mitraProfile?.business_type} />;
            case 'history':
                return <TransactionHistoryTab />;
            case 'store':
            default:
                return <StoreInfoTab storeData={storeData} onUpdateSuccess={fetchProfile} />;
        }
    };

    const mitraNavLinks = [
        { to: '/mitra/profile', label: 'Profil Saya', icon: <img src="https://icongr.am/feather/user.svg?size=20&color=currentColor" alt="Profil" /> },
        { to: '/mitra/store', label: 'Toko Saya', icon: <img src="https://icongr.am/feather/shopping-bag.svg?size=20&color=currentColor" alt="Toko" /> },
    ];

    return (
        <div className="bg-slate-100 min-h-screen">
            <div className="md:flex md:min-h-screen">
                <ProfileSidebar
                    user={{
                        avatar: profileData?.mitraProfile?.business_logo_url ? `http://localhost:3000${profileData.mitraProfile.business_logo_url}` : 'https://placehold.co/128x128/e2e8f0/64748b?text=Logo',
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
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Toko Saya</h1>
                                <p className="text-slate-500 mt-1">Personalisasi tampilan toko dan kelola produk serta transaksi Anda.</p>
                            </header>

                            <div className="mb-6">
                                <div className="bg-slate-200 p-1.5 rounded-xl inline-flex space-x-1">
                                    <button onClick={() => setActiveTab('store')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${activeTab === 'store' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}>Personalisasi Toko</button>
                                    <button onClick={() => setActiveTab('items')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${activeTab === 'items' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}>Barang</button>
                                    <button onClick={() => setActiveTab('history')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${activeTab === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}>Transaksi</button>
                                </div>
                            </div>

                            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                                {renderContent()}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default StoreProfilePage;
