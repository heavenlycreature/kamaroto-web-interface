import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

// --- Komponen Ikon ---
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

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

const ProductFormPage = () => {
    const navigate = useNavigate();
    const { productId } = useParams(); // null kalau /new

    const isEditMode = Boolean(productId);

    // State umum
    const [formData, setFormData] = useState({ title: "", description: "", price: "", stock: 1, status: "ACTIVE" });
    const [vehicleDetail, setVehicleDetail] = useState({ brand: "", model: "", year: "", odometer: "" });
    const [mediaItems, setMediaItems] = useState([]);
    const [initialData, setInitialData] = useState(null);

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // --- Fetch data kalau edit mode ---
    useEffect(() => {
        if (!isEditMode) return;
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await api.get(`/mitra/products/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
                const product = response.data.data;

                setInitialData(product);
                setFormData({
                    title: product.title,
                    description: product.description || "",
                    price: parseFloat(product.price),
                    stock: product.stock,
                    status: product.status,
                });
                if (product.vehicleDetail) setVehicleDetail(product.vehicleDetail);
                if (product.media) {
                    setMediaItems(product.media.map(m => ({
                        id: m.id,
                        url: `http://localhost:3000${m.url}`,
                        originalUrl: m.url,
                        file: null,
                    })));
                }
            } catch (err) {
                setError("Gagal memuat data produk.");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [isEditMode, productId]);

    // --- Handlers ---
    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleDetailChange = e => {
        const { name, value } = e.target;
        setVehicleDetail(prev => ({ ...prev, [name]: value }));
    };
    const handleImageUpload = e => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).map(file => ({
                id: `new_${Date.now()}_${file.name}`,
                url: URL.createObjectURL(file),
                originalUrl: null,
                file: file,
            }));
            setMediaItems(prev => [...prev, ...filesArray]);
        }
    };
    const removeImage = id => {
        setMediaItems(prev => prev.filter(item => item.id !== id));
    };

    // --- Submit Add/Edit ---
    const handleSubmit = async e => {
        e.preventDefault();
        setSaving(true);
        setError("");

        const dataToSend = new FormData();

        if (isEditMode) {
            // hanya kirim field yg berubah
            if (formData.title !== initialData.title) dataToSend.append("title", formData.title);
            if (formData.description !== initialData.description) dataToSend.append("description", formData.description);
            if (parseFloat(formData.price) !== parseFloat(initialData.price)) dataToSend.append("price", formData.price);
            if (parseInt(formData.stock) !== initialData.stock) dataToSend.append("stock", formData.stock);
            if (formData.status !== initialData.status) dataToSend.append("status", formData.status);
            if (JSON.stringify(vehicleDetail) !== JSON.stringify(initialData.vehicleDetail)) {
                dataToSend.append("vehicleDetail", JSON.stringify(vehicleDetail));
            }

            const newFiles = mediaItems.filter(i => i.file);
            const existing = mediaItems.filter(i => !i.file).map(i => i.originalUrl);
            dataToSend.append("existingMediaUrls", JSON.stringify(existing));
            newFiles.forEach(i => dataToSend.append("mediaFiles", i.file));

            try {
                const token = localStorage.getItem("token");
                await api.put(`/mitra/products/${productId}`, dataToSend, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });
                alert("Produk berhasil diperbarui!");
                navigate("/mitra/store");
            } catch (err) {
                setError(err.response?.data?.message || "Gagal update produk.");
            } finally {
                setSaving(false);
            }
        } else {
            // mode tambah
            dataToSend.append("title", formData.title);
            dataToSend.append("price", parseFloat(formData.price));
            dataToSend.append("stock", parseInt(formData.stock));
            dataToSend.append("status", formData.status);
            dataToSend.append("description", formData.description);
            dataToSend.append("vehicleDetail", JSON.stringify(vehicleDetail));
            mediaItems.forEach(f => f.file && dataToSend.append("mediaFiles", f.file));

            try {
                const token = localStorage.getItem("token");
                await api.post("/mitra/products", dataToSend, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });
                alert("Produk berhasil dibuat!");
                navigate("/mitra/store");
            } catch (err) {
                setError(err.response?.data?.message || "Gagal membuat produk.");
            } finally {
                setSaving(false);
            }
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Memuat data produk...</div>;

    return (
        <div className="bg-slate-100 min-h-screen">
            <div className="max-w-4xl mx-auto py-10 px-4">
                <header className="mb-8">
                    <button onClick={() => navigate("/mitra/store")} className="flex items-center text-slate-500 hover:text-slate-800 font-semibold mb-4">
                        <BackIcon />
                        <span className="ml-1">Kembali ke Toko Saya</span>
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                        {isEditMode ? "Edit Produk" : "Tambah Produk Baru"}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {isEditMode ? "Perbarui detail produk Anda." : "Isi detail produk yang ingin Anda jual."}
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Info Umum */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-semibold border-b pb-4 mb-6">Informasi Produk</h2>
                        <div className="space-y-4">
                            <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Judul" className="w-full border p-2 rounded" />
                            <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Harga" className="w-full border p-2 rounded" />
                            <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Stok" className="w-full border p-2 rounded" />
                            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Deskripsi" className="w-full border p-2 rounded" />
                        </div>
                    </div>

                    {/* Detail Kendaraan */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-semibold border-b pb-4 mb-6">Detail Kendaraan</h2>
                        <VehicleForm vehicleDetail={vehicleDetail} handleDetailChange={handleDetailChange} />
                    </div>

                    {/* Galeri Foto */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-semibold border-b pb-4 mb-6">Galeri Foto</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {mediaItems.map(img => (
                                <div key={img.id} className="relative">
                                    <img src={img.url} className="w-full h-full object-cover rounded" />
                                    <button type="button" onClick={() => removeImage(img.id)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded">X</button>
                                </div>
                            ))}
                            <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed cursor-pointer">
                                <PlusIcon />
                                <span>Tambah Foto</span>
                                <input type="file" multiple onChange={handleImageUpload} className="hidden" accept="image/*" />
                            </label>
                        </div>
                    </div>

                    {error && <p className="text-red-500">{error}</p>}

                    <div className="flex justify-end">
                        <button type="submit" disabled={saving} className="px-6 py-3 bg-orange-500 text-white rounded">
                            {saving ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Simpan & Terbitkan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormPage;
