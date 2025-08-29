// pages/mitra/StoreProfilePage.jsx
// Halaman manajemen toko Mitra dengan desain dan fungsionalitas profesional.

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import api from '../../api/api';

// --- Komponen Ikon ---
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const StoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0L22 13.41a1 1 0 0 0 0-1.41L12 2z"></path><path d="M7 7h.01"></path></svg>;
const PackageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4A2 2 0 0 1 2 16.77V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"></path><polyline points="2,8 12,13 22,8"></polyline><line x1="12" y1="22.76" x2="12" y2="13"></line></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6"></path><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const StarIcon = ({ isFilled }) => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isFilled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isFilled ? "text-yellow-400" : "text-slate-400"}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;

// --- Komponen untuk setiap Tab ---

const StoreInfoTab = ({ storeData, onUpdateSuccess }) => {
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [slug, setSlug] = useState('');
    const [openHours, setOpenHours] = useState({});

    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [bannerFile, setBannerFile] = useState(null);
    const [bannerPreview, setBannerPreview] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const logoInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    useEffect(() => {
        if (storeData) {
            setName(storeData.name || '');
            setAbout(storeData.about || '');
            setSlug(storeData.slug || '');
            setLogoPreview(storeData.logoUrl || "https://placehold.co/128x128/e2e8f0/64748b?text=Logo");
            setBannerPreview(storeData.bannerUrl || "https://placehold.co/600x250/e2e8f0/64748b?text=Banner");

            const initialHours = storeData.openHours || {};
            const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
            const fullHours = days.reduce((acc, day) => {
                acc[day] = initialHours[day] || { isOpen: true, open: '08:00', close: '17:00' };
                return acc;
            }, {});
            setOpenHours(fullHours);
        }
    }, [storeData]);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === 'logo') {
                setLogoFile(file);
                setLogoPreview(URL.createObjectURL(file));
            } else {
                setBannerFile(file);
                setBannerPreview(URL.createObjectURL(file));
            }
        }
    };

    const handleTimeChange = (day, timeType, value) => {
        setOpenHours(prev => ({
            ...prev,
            [day]: { ...prev[day], [timeType]: value }
        }));
    };

    const handleDayToggle = (day) => {
        setOpenHours(prev => ({
            ...prev,
            [day]: { ...prev[day], isOpen: !prev[day].isOpen }
        }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('business_name', name);
        formData.append('business_description', about); // Sesuaikan dengan field backend
        formData.append('business_slug', slug); // Sesuaikan dengan field backend
        formData.append('openHours', JSON.stringify(openHours));

        if (logoFile) formData.append('logo', logoFile); 
        if (bannerFile) formData.append('banner', bannerFile);

        try {
            const token = localStorage.getItem('token');
            const response = await api.put('/mitra/store/info', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage({ type: 'success', text: response.data.message });
            onUpdateSuccess(); // Panggil fungsi untuk refresh data di parent
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal menyimpan perubahan.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            {message.text && <div className={`p-3 rounded-lg text-center text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message.text}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1 space-y-2">
                    <label className="block text-sm font-medium text-slate-600">Logo Toko</label>
                    <input type="file" ref={logoInputRef} onChange={(e) => handleFileChange(e, 'logo')} className="hidden" accept="image/*" />
                    <div onClick={() => logoInputRef.current.click()} className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-200 ring-4 ring-white shadow">
                        <img src={logoPreview} alt="Profil Toko" className="w-full h-full object-cover rounded-full" />
                    </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-slate-600">Banner Toko</label>
                    <input type="file" ref={bannerInputRef} onChange={(e) => handleFileChange(e, 'banner')} className="hidden" accept="image/*" />
                    <div onClick={() => bannerInputRef.current.click()} className="w-full h-48 bg-slate-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-200 ring-4 ring-white shadow">
                        <img src={bannerPreview} alt="Banner Toko" className="w-full h-full object-cover rounded-xl" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="storeName" className="block text-sm font-medium text-slate-600">Nama Toko</label>
                    <input type="text" id="storeName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm" />
                </div>
                <div>
                    <label htmlFor="storeSlug" className="block text-sm font-medium text-slate-600">URL Toko Kustom</label>
                    <div className="flex items-center mt-1">
                        <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-slate-500 text-sm">kamaroto.com/toko/</span>
                        <input type="text" id="storeSlug" value={slug} onChange={(e) => setSlug(e.target.value)} className="block w-full px-4 py-2 border border-slate-300 rounded-r-lg shadow-sm" />
                    </div>
                </div>
            </div>
            <div>
                <label htmlFor="aboutStore" className="block text-sm font-medium text-slate-600">Tentang Toko</label>
                <textarea id="aboutStore" value={about} onChange={(e) => setAbout(e.target.value)} rows="5" className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm"></textarea>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Jam Operasional</h3>
                <div className="space-y-3">
                    {Object.keys(openHours).map(day => (
                        <div key={day} className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                            <span className="font-medium text-slate-700">{day}</span>
                            <input type="time" value={openHours[day].open} onChange={(e) => handleTimeChange(day, 'open', e.target.value)} disabled={!openHours[day].isOpen} className="px-3 py-1.5 border border-slate-300 rounded-lg shadow-sm w-full disabled:bg-slate-100" />
                            <input type="time" value={openHours[day].close} onChange={(e) => handleTimeChange(day, 'close', e.target.value)} disabled={!openHours[day].isOpen} className="px-3 py-1.5 border border-slate-300 rounded-lg shadow-sm w-full disabled:bg-slate-100" />
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" checked={!openHours[day].isOpen} onChange={() => handleDayToggle(day)} className="h-4 w-4 rounded text-orange-600 border-gray-300" />
                                <span>Libur</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
                <button onClick={handleSaveChanges} disabled={isSaving} className="cursor-pointer px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors disabled:bg-slate-400">
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>
        </div>
    );
};

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

                            <div className="mb-6 border-b border-slate-200">
                                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                    <button onClick={() => setActiveTab('store')} className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'store' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                                        <StoreIcon /> Profil Toko
                                    </button>
                                    <button onClick={() => setActiveTab('items')} className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'items' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                                        <PackageIcon /> Barang & Jasa
                                    </button>
                                    <button onClick={() => setActiveTab('history')} className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'history' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                                        <HistoryIcon /> Riwayat Transaksi
                                    </button>
                                </nav>
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
