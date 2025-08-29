import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';

// --- Komponen Ikon ---
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

// --- Komponen UI Tambahan ---
const ToggleSwitch = ({ label, enabled, setEnabled }) => (
    <div className="flex items-center justify-between">
        <span className="font-medium text-slate-700">{label}</span>
        <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`${enabled ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2`}
        >
            <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
        </button>
    </div>
);

const VehicleForm = ({ vehicleDetail, handleDetailChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label htmlFor="brand" className="block text-sm font-medium text-slate-600">Merek</label>
            <input type="text" name="brand" id="brand" value={vehicleDetail.brand} onChange={handleDetailChange} placeholder="Contoh: Toyota" required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg" />
        </div>
        <div>
            <label htmlFor="model" className="block text-sm font-medium text-slate-600">Model</label>
            <input type="text" name="model" id="model" value={vehicleDetail.model} onChange={handleDetailChange} placeholder="Contoh: Avanza" required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg" />
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
            <label htmlFor="transmission" className="block text-sm font-medium text-slate-600">Transmisi</label>
            <select name="transmission" id="transmission" value={vehicleDetail.transmission} onChange={handleDetailChange} required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg">
                <option>Automatic</option>
                <option>Manual</option>
            </select>
        </div>
        <div>
            <label htmlFor="fuel" className="block text-sm font-medium text-slate-600">Bahan Bakar</label>
            <select name="fuel" id="fuel" value={vehicleDetail.fuel} onChange={handleDetailChange} required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg">
                <option>Bensin</option>
                <option>Listrik</option>
            </select>
        </div>
        <div>
            <label htmlFor="condition" className="block text-sm font-medium text-slate-600">Kondisi</label>
            <select name="condition" id="condition" value={vehicleDetail.condition} onChange={handleDetailChange} required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg">
                <option>Sangat Baik</option>
                <option>Baik</option>
                <option>Cukup</option>
            </select>
        </div>
    </div>
);

const AddItemPage = () => {
    const navigate = useNavigate();
    const [businessType, setBusinessType] = useState('');
    const [loadingProfile, setLoadingProfile] = useState(true);

    // State untuk data umum
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [displayPrice, setDisplayPrice] = useState('');
    const [stock, setStock] = useState(1);
    const [status, setStatus] = useState('ACTIVE');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [mediaPreviews, setMediaPreviews] = useState([]);

    // State untuk data spesifik kendaraan
    const [vehicleDetail, setVehicleDetail] = useState({
        brand: '', model: '', year: '', odometer: '',
        transmission: 'Automatic', fuel: 'Bensin', condition: 'Sangat Baik'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMitraProfile = async () => {
            setLoadingProfile(true);
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/mitra/profile', { headers: { 'Authorization': `Bearer ${token}` } });
                setBusinessType(response.data?.mitraProfile?.business_type || '');
            } catch (err) {
                console.error("Gagal mengambil profil mitra:", err);
                setError("Tidak dapat memuat jenis usaha Anda.");
            } finally {
                setLoadingProfile(false);
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

    const handlePriceChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, ''); // Hapus semua karakter non-angka
        setPrice(rawValue); // Simpan nilai mentah tanpa koma

        if (rawValue) {
            setDisplayPrice(parseInt(rawValue, 10).toLocaleString('id-ID')); // Format dengan koma untuk tampilan
        } else {
            setDisplayPrice('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();

        // [PERBAIKAN] Konversi tipe data sebelum mengirim
        formData.append('type', 'VEHICLE');
        formData.append('title', title);
        formData.append('price', parseFloat(price)); // Kirim sebagai float/decimal
        formData.append('stock', parseInt(stock, 10)); // Kirim sebagai integer
        formData.append('status', status);
        formData.append('description', description);

        const fullVehicleDetail = {
            ...vehicleDetail,
            year: vehicleDetail.year,
            odometer: vehicleDetail.odometer,
            condition: vehicleDetail.condition
        };
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
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-slate-600">Harga</label>
                                    {/* [PERUBAHAN] Input harga sekarang menggunakan displayPrice dan handlePriceChange */}
                                    <input type="text" inputMode="numeric" name="price" id="price" value={displayPrice} onChange={handlePriceChange} required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="Rp" />
                                </div>
                                <div>
                                    <label htmlFor="stock" className="block text-sm font-medium text-slate-600">Stok</label>
                                    <input type="number" name="stock" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="Jumlah unit" />
                                </div>
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

                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-semibold text-slate-800 border-b pb-4 mb-6">Pengaturan Tambahan</h2>
                        <div className="space-y-4">
                            <ToggleSwitch
                                label="Produk Aktif (Tampil di Toko)"
                                enabled={status === 'ACTIVE'}
                                setEnabled={(isEnabled) => setStatus(isEnabled ? 'ACTIVE' : 'DRAFT')}
                            />
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
