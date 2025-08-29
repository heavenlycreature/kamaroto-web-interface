import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

// --- Komponen Ikon ---
const BackIcon = () => (
  <img
    src="https://icongr.am/feather/arrow-left.svg?size=20&color=4b5563"
    alt="Back"
    className="inline-block"
  />
);

// Ganti PlusIcon
const PlusIcon = () => (
  <img
    src="https://icongr.am/feather/plus.svg?size=20&color=4b5563"
    alt="Plus"
    className="inline-block"
  />
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
            <label htmlFor="odometer" className="block text-sm font-medium text-slate-600">Jarak Tempuh/Odometer (km)</label>
            <input type="number" name="odometer" id="odometer" value={vehicleDetail.odometer} onChange={handleDetailChange} placeholder="Contoh: 45000" required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg" />
        </div>
        <div>
            <label htmlFor="transmission" className="block text-sm font-medium text-slate-600">Transmisi</label>
            <select name="transmission" id="transmission" value={vehicleDetail.transmission} onChange={handleDetailChange} required className="cursor-pointer mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg">
                <option>Automatic</option>
                <option>Manual</option>
            </select>
        </div>
        <div>
            <label htmlFor="fuel" className="block text-sm font-medium text-slate-600">Bahan Bakar</label>
            <select name="fuel" id="fuel" value={vehicleDetail.fuel} onChange={handleDetailChange} required className="cursor-pointer mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg">
                <option>Bensin</option>
                <option>Listrik</option>
            </select>
        </div>
        <div>
            <label htmlFor="condition" className="block text-sm font-medium text-slate-600">Kondisi</label>
            <select name="condition" id="condition" value={vehicleDetail.condition} onChange={handleDetailChange} required className="cursor-pointer mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg">
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
    const [productType, setProductType] = useState(null);
    const [mitraBusinessType, setMitraBusinessType] = useState('');
    const [initialData, setInitialData] = useState(null);

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [modalState, setModalState] = useState({ isOpen: false, type: '', title: '', message: '' });
    const [error, setError] = useState("");

    // --- Fetch data kalau edit mode ---
    useEffect(() => {
        // Mapping dari jenis usaha Mitra ke tipe produk yang diizinkan
        const businessTypeToProductType = {
            'jual_beli_kendaraan': 'VEHICLE',
            'jual_beli_sparepart': 'SPAREPART',
            // Tambahkan mapping lain di sini jika ada
        };

        const loadInitialData = async () => {
            try {
                const token = localStorage.getItem("token");
                
                // 1. Ambil profil mitra untuk mengetahui jenis usahanya
                const profileResponse = await api.get('/mitra/profile', { headers: { Authorization: `Bearer ${token}` } });
                const businessType = profileResponse.data?.mitraProfile?.business_type;
                setMitraBusinessType(businessType);

                const determinedType = businessTypeToProductType[businessType];
                if (!determinedType) {
                    throw new Error("Jenis usaha Anda tidak mendukung penambahan produk ini.");
                }

                if (isEditMode) {
                    const productResponse = await api.get(`/mitra/products/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
                    const product = productResponse.data.data;
                    
                    if (product.type !== determinedType) {
                        throw new Error("Anda tidak berhak mengedit produk dengan jenis ini.");
                    }

                    setProductType(product.type);
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

                } else {
                    setProductType(determinedType);
                }

            } catch (err) {
                setError(err.message || "Gagal memuat data.");
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [isEditMode, productId]);
    

    // --- Handlers ---

    const formatNumber = (value) => {
        if (!value) return "";
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
    };

    const parseNumber = (value) => {
        return value.replace(/,/g, "");
    };

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

        if (!productType) {
            setError("Tipe produk tidak dapat ditentukan. Pastikan jenis usaha Anda benar.");
            return;
        }

        const dataToSend = new FormData();
        
        // Data umum yang selalu ada
        dataToSend.append("type", productType);
        dataToSend.append("title", formData.title);
        dataToSend.append("price", parseFloat(formData.price));
        dataToSend.append("stock", parseInt(formData.stock));
        dataToSend.append("status", formData.status);
        dataToSend.append("description", formData.description);

        // Data spesifik yang kondisional
        if (productType === 'VEHICLE') {
            dataToSend.append("vehicleDetail", JSON.stringify(vehicleDetail));
        }

        // Logika media
        const newFiles = mediaItems.filter(item => item.file);
        newFiles.forEach(item => dataToSend.append("mediaFiles", item.file));

        if (isEditMode) {
            // Untuk mode edit, kirim juga media lama dan urutannya
            const existingUrls = mediaItems.filter(item => !item.file).map(item => item.originalUrl);
            dataToSend.append("existingMediaUrls", JSON.stringify(existingUrls));
            
            let newFileCounter = 0;
            const mediaOrder = mediaItems.map(item => {
                if (item.file) return `NEW_FILE_${newFileCounter++}`;
                return item.originalUrl;
            });
            dataToSend.append("mediaOrder", JSON.stringify(mediaOrder));
        }

        try {
            const token = localStorage.getItem("token");
            let response;
            if (isEditMode) {
                response = await api.put(`/mitra/products/${productId}`, dataToSend, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
                });
                setModalState({
                isOpen: true,
                type: "success",
                title: "Berhasil",
                message: "Produk berhasil diperbarui!",
                });
            } else {
                response = await api.post("/mitra/products", dataToSend, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
                });
                setModalState({
                isOpen: true,
                type: "success",
                title: "Berhasil",
                message: "Produk berhasil dibuat!",
                });
            }
            } catch (err) {
            setModalState({
                isOpen: true,
                type: "error",
                title: "Gagal",
                message: err.response?.data?.message || `Gagal ${isEditMode ? "memperbarui" : "membuat"} produk.`,
            });
            } finally {
            setSaving(false);
            }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Memuat data produk...</div>;

    const pageTitle = isEditMode 
        ? "Edit Produk" 
        : `Tambah ${productType === 'VEHICLE' ? 'Kendaraan' : 'Sparepart'} Baru`;
    
    const pageDescription = isEditMode 
        ? "Perbarui detail produk Anda."
        : `Isi detail ${productType === 'VEHICLE' ? 'kendaraan' : 'sparepart'} yang ingin Anda jual.`;


    return (
        <div className="bg-slate-100 min-h-screen">
            <div className="max-w-4xl mx-auto py-10 px-4">
                <header className="mb-8">
                    <button onClick={() => navigate("/mitra/store")} className="flex items-center text-slate-500 hover:text-slate-800 font-semibold mb-4">
                        <BackIcon />
                        <span className="ml-1">Kembali ke Toko Saya</span>
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">{pageTitle}</h1>
                    <p className="text-slate-500 mt-1">{pageDescription}</p>
                </header>
                {error ? (
                    <p className="text-red-500 bg-red-100 p-4 rounded-lg text-center">{error}</p>
                ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                    {modalState.isOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300">
                            <div
                            className={`bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full relative transform transition-all duration-300 scale-100 opacity-100`}
                            >
                            {/* Ikon Status */}
                            <div className="flex justify-center mb-4">
                                {modalState.type === "success" && (
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">
                                    ✔
                                </div>
                                )}
                                {modalState.type === "error" && (
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-2xl">
                                    ✖
                                </div>
                                )}
                                {modalState.type === "info" && (
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-2xl">
                                    ℹ
                                </div>
                                )}
                            </div>

                            {/* Title + Message */}
                            <h3 className="text-xl font-semibold text-slate-800 text-center">
                                {modalState.title}
                            </h3>
                            <p className="text-slate-600 text-center mt-2">{modalState.message}</p>

                            {/* Tombol */}
                            <div className="flex justify-center mt-6">
                                <button
                                onClick={() => {
                                    setModalState({ isOpen: false, type: "", title: "", message: "" });
                                    if (modalState.type === "success") {
                                    navigate("/mitra/store");
                                    }
                                }}
                                className={`px-5 py-2 rounded-xl font-medium transition ${
                                    modalState.type === "success"
                                    ? "bg-green-500 hover:bg-green-600 text-white"
                                    : modalState.type === "error"
                                    ? "bg-red-500 hover:bg-red-600 text-white"
                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                                }`}
                                >
                                OK
                                </button>
                            </div>
                            </div>
                        </div>
                    )}

                    {/* Info Umum */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-semibold text-slate-800 border-b pb-4 mb-6">Informasi Produk</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-slate-600">Judul Iklan</label>
                                <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Judul" className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-slate-600">Harga</label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formatNumber(formData.price)}
                                        onChange={(e) => {
                                        const rawValue = parseNumber(e.target.value);
                                        if (!isNaN(rawValue)) {
                                            setFormData(prev => ({ ...prev, price: rawValue }));
                                        }
                                        }}
                                        placeholder="Harga"
                                        className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="stock" className="block text-sm font-medium text-slate-600">Stok</label>
                                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Stok" className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg" />
                                </div>
                            </div>                            
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-slate-600">Deskripsi</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Deskripsi" rows="5" className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Detail Kendaraan */}
                   {productType === 'VEHICLE' && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h2 className="text-xl font-semibold border-b pb-4 mb-6">Detail Kendaraan</h2>
                            <VehicleForm vehicleDetail={vehicleDetail} handleDetailChange={handleDetailChange} />
                        </div>
                    )}

                    {/* Galeri Foto */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-semibold border-b pb-4 mb-6">Galeri Foto</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {mediaItems.map(img => (
                                <div key={img.id} className="relative">
                                    <img src={img.url} className="w-full h-full object-cover rounded" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(img.id)}
                                        className="cursor-pointer absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                    >
                                        <img
                                        src="https://icongr.am/feather/x.svg?size=16&color=ffffff"
                                        alt="Remove"
                                        className="w-4 h-4"
                                        />
                                    </button>
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
                )}
            </div>
        </div>
    );
};

export default ProductFormPage;
