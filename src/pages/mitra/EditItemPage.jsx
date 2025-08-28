import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';

// --- Komponen Ikon ---
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

// --- Komponen Form (disalin dari AddItemPage untuk konsistensi) ---
const VehicleForm = ({ vehicleDetail, handleDetailChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label htmlFor="brand" className="block text-sm font-medium text-slate-600">Merek</label>
            <input type="text" name="brand" id="brand" value={vehicleDetail.brand} onChange={handleDetailChange} placeholder="Contoh: Toyota" required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg"/>
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
    </div>
);

const EditItemPage = () => {
    const navigate = useNavigate();
    const { productId } = useParams(); // Mengambil ID produk dari URL

    // State untuk data form
    const [initialData, setInitialData] = useState(null); // Untuk membandingkan perubahan
    const [formData, setFormData] = useState({ title: '', description: '', price: '', stock: 1, status: 'ACTIVE' });
    const [vehicleDetail, setVehicleDetail] = useState({ brand: '', model: '', year: '', odometer: '' });
    
    // State untuk galeri media
    const [mediaItems, setMediaItems] = useState([]); // Gabungan file baru dan URL lama

    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get(`/mitra/products/${productId}`, { headers: { 'Authorization': `Bearer ${token}` } });
                const product = response.data.data;

                // Simpan data awal untuk perbandingan
                setInitialData(product);

                // Isi state form
                setFormData({
                    title: product.title,
                    description: product.description || '',
                    price: parseFloat(product.price),
                    stock: product.stock,
                    status: product.status,
                });
                if (product.vehicleDetail) {
                    setVehicleDetail(product.vehicleDetail);
                }
                if (product.media) {
                    // Format media untuk state galeri
                    const formattedMedia = product.media.map(m => ({
                        id: m.id,
                        url: `http://localhost:3000${m.url}`, // URL lengkap untuk preview
                        originalUrl: m.url, // URL relatif untuk dikirim kembali
                        file: null // Tandai sebagai file lama
                    }));
                    setMediaItems(formattedMedia);
                }
            } catch (err) {
                setError('Gagal memuat data produk.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleDetailChange = (e) => {
        const { name, value } = e.target;
        setVehicleDetail(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).map(file => ({
                id: `new_${Date.now()}_${file.name}`, // ID sementara untuk file baru
                url: URL.createObjectURL(file), // URL preview
                originalUrl: null,
                file: file // File object itu sendiri
            }));
            setMediaItems(prev => [...prev, ...filesArray]);
        }
    };

    const removeImage = (idToRemove) => {
        setMediaItems(prev => prev.filter(item => item.id !== idToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        const dataToUpdate = new FormData();

        // 1. Tambahkan field biasa HANYA jika berubah
        if (formData.title !== initialData.title) dataToUpdate.append('title', formData.title);
        if (parseFloat(formData.price) !== parseFloat(initialData.price)) dataToUpdate.append('price', formData.price);
        if (parseInt(formData.stock, 10) !== initialData.stock) dataToUpdate.append('stock', formData.stock);
        if (formData.status !== initialData.status) dataToUpdate.append('status', formData.status);
        if (formData.description !== initialData.description) dataToUpdate.append('description', formData.description);

        // 2. Tambahkan vehicleDetail (sebagai JSON) HANYA jika berubah
        if (JSON.stringify(vehicleDetail) !== JSON.stringify(initialData.vehicleDetail)) {
            dataToUpdate.append('vehicleDetail', JSON.stringify(vehicleDetail));
        }

        // 3. Siapkan data media
        const newFiles = mediaItems.filter(item => item.file !== null);
        const existingMediaUrls = mediaItems.filter(item => item.file === null).map(item => item.originalUrl);
        const mediaOrder = mediaItems.map((item, index) => 
            item.file ? `NEW_FILE_${newFiles.findIndex(f => f.id === item.id)}` : item.originalUrl
        );

        newFiles.forEach(item => {
            dataToUpdate.append('mediaFiles', item.file);
        });
        dataToUpdate.append('existingMediaUrls', JSON.stringify(existingMediaUrls));
        dataToUpdate.append('mediaOrder', JSON.stringify(mediaOrder));

        try {
            const token = localStorage.getItem('token');
            await api.put(`/products/${productId}`, dataToUpdate, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert("Produk berhasil diperbarui!");
            navigate('/mitra/store');
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memperbarui produk.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Memuat data produk...</div>;

    return (
        <div className="bg-slate-100 min-h-screen">
            <div className="max-w-4xl mx-auto py-10 px-4">
                <header className="mb-8">
                    <button onClick={() => navigate('/mitra/store')} className="flex items-center text-slate-500 hover:text-slate-800 font-semibold mb-4">
                        <BackIcon />
                        <span className="ml-1">Kembali ke Toko Saya</span>
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Edit Produk</h1>
                    <p className="text-slate-500 mt-1">Perbarui detail produk atau jasa Anda.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* ... (Form sections for Info Iklan, Detail Kendaraan, etc.) ... */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-semibold text-slate-800 border-b pb-4 mb-6">Galeri Foto</h2>
                        <p className="text-sm text-slate-500 mb-4">Gambar pertama akan menjadi foto utama. Anda bisa drag-and-drop untuk mengubah urutan (fitur mendatang).</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {mediaItems.map((image, index) => (
                                <div key={image.id} className="relative aspect-square group">
                                    <img src={image.url} alt={`preview ${index}`} className="w-full h-full object-cover rounded-lg"/>
                                    <button type="button" onClick={() => removeImage(image.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                            ))}
                            <label className="aspect-square flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                                <PlusIcon />
                                <span className="text-xs text-slate-500 mt-1">Tambah Foto</span>
                                <input type="file" multiple onChange={handleImageUpload} className="hidden" accept="image/*"/>
                            </label>
                        </div>
                    </div>

                    {error && <p className="text-center text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}

                    <div className="flex justify-end pt-6 border-t">
                        <button type="submit" disabled={isSaving || loading} className="px-8 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-lg hover:bg-orange-600 transition-colors disabled:bg-slate-400">
                            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditItemPage;