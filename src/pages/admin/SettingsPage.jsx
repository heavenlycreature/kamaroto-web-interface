// pages/admin/SettingsPage.jsx
// Halaman untuk mengelola pengaturan aplikasi.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import InfoCard from '../../components/profile/InfoCard'; // Kita gunakan InfoCard yang sudah ada

const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

// Komponen kecil untuk setiap baris pengaturan
const SettingRow = ({ label, description, value, onChange }) => (
    <div className="py-4 border-b border-slate-200 last:border-b-0">
        <div className="flex justify-between items-center mb-2">
            <div>
                <p className="font-semibold text-slate-700">{label}</p>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
            <div className="bg-orange-100 text-orange-700 font-bold text-lg px-4 py-1 rounded-lg">
                {value} Poin
            </div>
        </div>
        <input
            type="range"
            min="0"
            max="100"
            value={value || 0}
            onChange={onChange}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
    </div>
);

// [PERUBAHAN] Definisikan pengaturan default yang diharapkan oleh frontend
const DEFAULT_SETTINGS = [
    { 
        key: 'referral_reward_co', 
        value: '0', 
        description: 'Poin yang diberikan untuk setiap referral Captain Officer yang berhasil.' 
    },
    { 
        key: 'referral_reward_mitra', 
        value: '0', 
        description: 'Poin yang diberikan untuk setiap referral Mitra yang berhasil.' 
    },
];


const SettingsPage = () => {
    const [settings, setSettings] = useState({});
    const [initialSettings, setInitialSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
    
    const [adminData, setAdminData] = useState({ name: 'Admin', email: 'admin@kamaroto.com' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setAdminData({ name: storedUser.name || 'Admin', email: storedUser.email });
        }
        
        const fetchSettings = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/admin/settings', { headers: { 'Authorization': `Bearer ${token}` } });
                
                // [PERUBAHAN] Logika baru untuk menggabungkan data API dengan data default
                const apiSettings = response.data.data || [];
                const apiSettingsMap = new Map(apiSettings.map(s => [s.key, s]));

                const finalSettings = DEFAULT_SETTINGS.reduce((acc, defaultSetting) => {
                    const apiSetting = apiSettingsMap.get(defaultSetting.key);
                    acc[defaultSetting.key] = {
                        value: apiSetting ? apiSetting.value : defaultSetting.value,
                        description: apiSetting ? apiSetting.description : defaultSetting.description
                    };
                    return acc;
                }, {});

                setSettings(finalSettings);
                setInitialSettings(finalSettings); 
            } catch (err) {
                setError("Gagal memuat data pengaturan.");
                // Jika error, tetap tampilkan UI dengan nilai default
                const defaultSettingsObject = DEFAULT_SETTINGS.reduce((acc, setting) => {
                    acc[setting.key] = { value: setting.value, description: setting.description };
                    return acc;
                }, {});
                setSettings(defaultSettingsObject);
                setInitialSettings(defaultSettingsObject);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSettingChange = (key, newValue) => {
        setSettings(prev => ({
            ...prev,
            [key]: { ...prev[key], value: newValue }
        }));
        setSaveMessage({ type: '', text: '' });
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        setSaveMessage({ type: '', text: '' });
        
        const payload = Object.keys(settings).map(key => ({
            key: key,
            value: String(settings[key].value)
        }));

        try {
            const token = localStorage.getItem('token');
            await api.put('/admin/settings', payload, { headers: { 'Authorization': `Bearer ${token}` } });
            setSaveMessage({ type: 'success', text: 'Pengaturan berhasil diperbarui.' });
            setInitialSettings(settings);
        } catch (err) {
            setSaveMessage({ type: 'error', text: 'Gagal memperbarui pengaturan.' });
        } finally {
            setIsSaving(false);
        }
    };
    
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);

    return (
        <div className="bg-slate-100 min-h-screen">
            <div className="md:flex md:min-h-screen">
                <AdminSidebar adminName={adminData.name} adminEmail={adminData.email} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                
                <div className="flex-1 flex flex-col">
                    <header className="bg-white/80 backdrop-blur-md p-4 flex items-center justify-between md:hidden sticky top-0 z-20 shadow-sm">
                        <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600"><MenuIcon /></button>
                        <Link to="/" className="text-xl font-bold text-orange-500">KamarOTO</Link>
                    </header>

                    <main className="flex-1 p-6 md:p-10">
                        <div className="max-w-4xl mx-auto">
                            <header className="mb-8">
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Pengaturan</h1>
                                <p className="text-slate-500 mt-1">Kelola pengaturan global untuk aplikasi.</p>
                            </header>

                            {loading && <p className="text-center text-slate-500">Memuat...</p>}
                            {error && <p className="text-center text-red-500">{error}</p>}
                            
                            {/* [PERUBAHAN] Tampilkan UI bahkan jika loading selesai tapi ada error, dengan data default */}
                            {!loading && (
                                <InfoCard title="Pengaturan Poin Referral" description="Atur jumlah poin reward untuk setiap referral yang berhasil.">
                                    <div className="divide-y divide-slate-200">
                                        {Object.keys(settings).length > 0 ? (
                                            Object.keys(settings).map(key => (
                                                <SettingRow
                                                    key={key}
                                                    label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    description={settings[key]?.description || ''}
                                                    value={settings[key]?.value || '0'}
                                                    onChange={(e) => handleSettingChange(key, e.target.value)}
                                                />
                                            ))
                                        ) : (
                                            <p className="p-4 text-slate-500">Tidak ada pengaturan yang tersedia.</p>
                                        )}
                                    </div>
                                </InfoCard>
                            )}

                            {saveMessage.text && (
                                <div className={`mt-4 p-3 rounded-lg text-center text-sm ${saveMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {saveMessage.text}
                                </div>
                            )}

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={handleSaveChanges}
                                    disabled={!hasChanges || isSaving}
                                    className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
