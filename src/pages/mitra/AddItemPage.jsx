// pages/mitra/AddItemPage.jsx
// Halaman dinamis untuk menambah item berdasarkan jenis usaha.

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';

// --- Komponen Ikon ---
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

// --- Komponen Form Spesifik untuk Kendaraan ---
const VehicleForm = ({ vehicleDetail, handleDetailChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label htmlFor="brand" className="block text-sm font-medium text-slate-600">Merek</label>
            <input type="text" name="brand" id="brand" value={vehicleDetail.brand} onChange={handleDetailChange} placeholder="Contoh: Toyota" required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg" />
        </div>
        <div>
            <label htmlFor="plateNumber" className="block text-sm font-medium text-slate-600">Nomor Polisi</label>
            <input type="text" name="plateNumber" id="plateNumber" value={vehicleDetail.plateNumber} onChange={handleDetailChange} placeholder="Contoh: B 1234 XYZ" required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg" />
        </div>
        <div>
            <label htmlFor="year" className="block text-sm font-medium text-slate-600">Tahun</label>
            <input type="number" name="year" id="year" value={vehicleDetail.year} onChange={handleDetailChange} placeholder="Contoh: 2019" required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg" />
        </div>
        <div>
            <label htmlFor="odometer" className="block text-sm font-medium text-slate-600">Jarak Tempuh (km)</label>
            <input type="number" name="odometer" id="odometer" value={vehicleDetail.odometer} onChange={handleDetailChange} placeholder="Contoh: 45000" required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg" />
        </div>
        <div>
            <label htmlFor="color" className="block text-sm font-medium text-slate-600">Warna</label>
            <input type="text" name="color" id="color" value={vehicleDetail.color} onChange={handleDetailChange} placeholder="Contoh: Putih" required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg" />
        </div>
        <div>
            <label htmlFor="transmission" className="block text-sm font-medium text-slate-600">Transmisi</label>
            <select name="transmission" id="transmission" value={vehicleDetail.transmission} onChange={handleDetailChange} required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg">
                <option>Automatic</option>
                <option>Manual</option>
            </select>
        </div>
    </div>
);

const AddItemPage = () => {
    const navigate = useNavigate();
    const [businessType, setBusinessType] = useState('');
    const [loadingProfile, setLoadingProfile] = useState(true); // [PERBAIKAN] State untuk loading profil

    // State untuk data umum
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState(1);
    const [status, setStatus] = useState('ACTIVE');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [mediaPreviews, setMediaPreviews] = useState([]);

    // State untuk data spesifik kendaraan
    const [vehicleDetail, setVehicleDetail] = useState({
        plateNumber: '', brand: '', year: '', odometer: '', color: '', transmission: 'Automatic'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMitraProfile = async () => {
            setLoadingProfile(true); // [PERBAIKAN] Mulai loading
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/mitra/profile', { headers: { 'Authorization': `Bearer ${token}` } });
                setBusinessType(response.data?.mitraProfile?.business_type || '');
            } catch (err) {
                console.error("Gagal mengambil profil mitra:", err);
                setError("Tidak dapat memuat jenis usaha Anda.");
            } finally {
                setLoadingProfile(false); // [PERBAIKAN] Selesai loading
            }
        };
        fetchMitraProfile();
    }, []);

    const handleDetailChange = (e) => {
        const { name, value } = e.target;
        setVehicleDetail(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setMediaFiles(prev => [...prev, ...files]);
            const previews = files.map(file => URL.createObjectURL(file));
            setMediaPreviews(prev => [...prev, ...previews]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();

        formData.append('type', 'VEHICLE');
        formData.append('title', title);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('status', status);
        formData.append('description', description);

        const fullVehicleDetail = { ...vehicleDetail, condition: "Sangat Baik" };
        formData.append('vehicleDetail', JSON.stringify(fullVehicleDetail));

        mediaFiles.forEach(file => {
            formData.append('mediaFiles', file);
        });

        try {
            const token = localStorage.getItem('token');
            await api.post('/mitra/products', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert("Produk berhasil dibuat!");
            navigate('/mitra/store');
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal membuat produk.');
        } finally {
            setLoading(false);
        }
    };

    const renderDynamicForm = () => {
        // [PERBAIKAN] Tambahkan pengecekan loading di sini
        if (loadingProfile) {
            return <p className="text-slate-500 text-center">Memuat form...</p>;
        }

        switch (businessType) {
            case 'jual_beli_kendaraan':
                return <VehicleForm vehicleDetail={vehicleDetail} handleDetailChange={handleDetailChange} />;
            default:
                return <p className="text-slate-500 text-center">Form untuk jenis usaha ini belum tersedia.</p>;
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen">
            <div className="max-w-4xl mx-auto py-10 px-4">
                <header className="mb-8">
                    <button onClick={() => navigate('/mitra/store')} className="flex items-center text-slate-500 hover:text-slate-800 font-semibold mb-4">
                        <BackIcon />
                        <span className="ml-1">Kembali ke Toko Saya</span>
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Tambah Kendaraan Baru</h1>
                    <p className="text-slate-500 mt-1">Isi detail kendaraan yang ingin Anda jual.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-semibold text-slate-800 border-b pb-4 mb-6">Informasi Iklan</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-slate-600">Judul Iklan</label>
                                <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="Contoh: Toyota Avanza Veloz 2019 Bekas" />
                            </div>
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-slate-600">Harga</label>
                                <input type="number" name="price" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="Masukkan harga dalam Rupiah" />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-slate-600">Deskripsi</label>
                                <textarea name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="5" className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-semibold text-slate-800 border-b pb-4 mb-6">Detail Kendaraan</h2>
                        {renderDynamicForm()}
                    </div>

                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-semibold text-slate-800 border-b pb-4 mb-6">Galeri Foto</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {mediaPreviews.map((preview, index) => (
                                <div key={index} className="relative aspect-square group">
                                    <img src={preview} alt={`preview ${index}`} className="w-full h-full object-cover rounded-lg" />
                                </div>
                            ))}
                            <label className="aspect-square flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                                <PlusIcon />
                                <span className="text-xs text-slate-500 mt-1">Tambah Foto</span>
                                <input type="file" multiple onChange={handleImageUpload} className="hidden" accept="image/*" />
                            </label>
                        </div>
                    </div>

                    {error && <p className="text-center text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}

                    <div className="flex justify-end pt-6 border-t">
                        <button type="submit" disabled={loading || loadingProfile} className="px-8 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-lg hover:bg-orange-600 transition-colors disabled:bg-slate-400">
                            {loading ? 'Menyimpan...' : 'Simpan & Terbitkan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItemPage;
