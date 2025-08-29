// src/components/mitra/StoreInfoTab.jsx
// Komponen dinamis untuk menampilkan dan mengedit informasi toko.

import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/api';

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
        formData.append('business_description', about);
        formData.append('business_slug', slug);
        formData.append('openHours', JSON.stringify(openHours));

        if (logoFile) formData.append('business_logo', logoFile);
        if (bannerFile) formData.append('business_banner', bannerFile);

        try {
            const token = localStorage.getItem('token');
            const response = await api.put('/mitra/store/info', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage({ type: 'success', text: response.data.message });
            if(onUpdateSuccess) onUpdateSuccess();
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
                            <input type="time" value={openHours[day].open} onChange={(e) => handleTimeChange(day, 'open', e.target.value)} disabled={!openHours[day].isOpen} className="px-3 py-1.5 border border-slate-300 rounded-lg shadow-sm w-full disabled:bg-slate-100"/>
                            <input type="time" value={openHours[day].close} onChange={(e) => handleTimeChange(day, 'close', e.target.value)} disabled={!openHours[day].isOpen} className="px-3 py-1.5 border border-slate-300 rounded-lg shadow-sm w-full disabled:bg-slate-100"/>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" checked={!openHours[day].isOpen} onChange={() => handleDayToggle(day)} className="h-4 w-4 rounded text-orange-600 border-gray-300"/>
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

export default StoreInfoTab;
