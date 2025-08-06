// pages/mitra/MitraProfile.jsx
// Versi final dengan update pada input Status PIC, Platform Medsos, dan Badan Usaha.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useFormHandlers } from '../../hooks/useFormHandlers';
import { useAddressDropdown } from '../../hooks/useAddressDropdown';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import ProfileField from '../../components/profile/ProfileField';
import InfoCard from '../../components/profile/InfoCard';
import ChangePasswordModal from '../../components/profile/ChangePasswordModal';
import RejectedStatusView from '../../components/profile/RejectedStatusView';
// [PERUBAHAN] Asumsi path ke komponen InputField Anda, sesuaikan jika perlu.
import { InputField } from '../../components/form/FormElements';

// --- Komponen Ikon ---
const MenuIcon = () => <svg xmlns="http://www.w.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

const mitraNavLinks = [
    { to: '/mitra/profile', label: 'Profil Saya', icon: <img src="https://icongr.am/feather/user.svg?size=20&color=currentColor" alt="Profil" /> },
];

const MitraProfile = () => {
    // --- State Management ---
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const { formData, setFormData, handleInputChange } = useFormHandlers({
        email: "", phone: "", status: "", avatar: "",
        email_is_verified: false, 
        pic_name: "", pic_phone: "", pic_email: "", pic_status: "",
        owner_name: "", owner_phone: "", owner_email: "", owner_ktp: "",
        business_type: "", business_entity: "", business_name: "",
        business_duration: "", social_media_platform: "", social_media_account: ""
    });

    const [ownerAddress, setOwnerAddress] = useState({ province: '', city: '', district: '', subdistrict: '', detail: '' });
    const { addressOptions: ownerAddressOptions, handleAddressChange: handleOwnerAddressChange } = useAddressDropdown(ownerAddress, setOwnerAddress);

    const [businessAddress, setBusinessAddress] = useState({ province: '', city: '', district: '', subdistrict: '', detail: '' });
    const { addressOptions: businessAddressOptions, handleAddressChange: handleBusinessAddressChange } = useAddressDropdown(businessAddress, setBusinessAddress);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.status === 'rejected' || user?.status === 'pending') {
            navigate('/status'); // Redirect paksa jika mencoba akses langsung
        }
    }, [navigate]);
    // --- Data Fetching ---
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error("Sesi tidak valid.");
                const response = await api.get('/mitra/profile', { headers: { 'Authorization': `Bearer ${token}` } });
                const user = response.data;
                const mitraProfile = user.mitraProfile;
                if (!mitraProfile) throw new Error("Data profil mitra tidak ditemukan.");
                if (user.status === 'rejected') { navigate('/status'); return; }

                const initialFormData = {
                    email: user.email, phone: user.phone, status: user.status,
                    email_is_verified: user.email_is_verified || false,
                    avatar: "https://placehold.co/96x96/ffffff/ea580c?text=Mitra",
                    pic_name: mitraProfile.pic_name || "", pic_phone: mitraProfile.pic_phone || "", pic_email: mitraProfile.pic_email || "", pic_status: mitraProfile.pic_status || "",
                    owner_name: mitraProfile.owner_name || "", owner_phone: mitraProfile.owner_phone || "", owner_email: mitraProfile.owner_email || "", owner_ktp: mitraProfile.owner_ktp || "",
                    business_type: mitraProfile.business_type || "", business_entity: mitraProfile.business_entity || "", business_name: mitraProfile.business_name || "",
                    business_duration: mitraProfile.business_duration || "", social_media_platform: mitraProfile.social_media_platform || "", social_media_account: mitraProfile.social_media_account || ""
                };
                setFormData(initialFormData);

                const ownerAddr = {
                    province: mitraProfile.owner_address_province || "", city: mitraProfile.owner_address_city || "",
                    district: mitraProfile.owner_address_subdistrict || "", subdistrict: mitraProfile.owner_address_village || "",
                    detail: mitraProfile.owner_address_detail || ""
                };
                setOwnerAddress(ownerAddr);

                const businessAddr = {
                    province: mitraProfile.business_address_province || "", city: mitraProfile.business_address_city || "",
                    district: mitraProfile.business_address_subdistrict || "", subdistrict: mitraProfile.business_address_village || "",
                    detail: mitraProfile.business_address_detail || ""
                };
                setBusinessAddress(businessAddr);

                setOriginalData({ formData: initialFormData, ownerAddress: ownerAddr, businessAddress: businessAddr });
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate, setFormData]);

    // --- Action Handlers ---
    const handleSaveChanges = async () => {
        setLoading(true);
        setSaveMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Sesi Anda telah berakhir.");

            const payload = {
                ...formData,
                owner_address_province: ownerAddress.province, owner_address_city: ownerAddress.city,
                owner_address_subdistrict: ownerAddress.district, owner_address_village: ownerAddress.subdistrict,
                owner_address_detail: ownerAddress.detail,
                business_address_province: businessAddress.province, business_address_city: businessAddress.city,
                business_address_subdistrict: businessAddress.district, business_address_village: businessAddress.subdistrict,
                business_address_detail: businessAddress.detail,
            };
            delete payload.email; delete payload.phone; delete payload.status; delete payload.avatar;

            await api.put('/mitra/profile/edit', payload, { headers: { 'Authorization': `Bearer ${token}` } });
            setOriginalData({ formData, ownerAddress, businessAddress });
            setIsEditing(false);
            setSaveMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
        } catch (err) {
            setSaveMessage({ type: 'error', text: err.response?.data?.message || "Gagal menyimpan perubahan." });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setFormData(originalData.formData);
        setOwnerAddress(originalData.ownerAddress);
        setBusinessAddress(originalData.businessAddress);
        setIsEditing(false);
        setSaveMessage({ type: '', text: '' });
    };

    const getFullAddress = (addressState) => {
        const parts = [addressState.detail, addressState.subdistrict, addressState.district, addressState.city, addressState.province];
        return parts.filter(part => part).join(', ') || '-';
    };

    const handlePasswordChange = async (passwords) => { /* ... (Tidak ada perubahan) ... */ };
    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
    if (formData.status === 'rejected' && !isEditing) {
        return <RejectedStatusView user={{ ...formData, name: formData.business_name }} onEditClick={() => setIsEditing(true)} />;
    }

    const EditModeFooter = (<> <button onClick={handleCancelEdit} className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Batal</button> <button onClick={handleSaveChanges} disabled={loading} className="px-5 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 disabled:bg-gray-400"> {loading ? 'Menyimpan...' : 'Simpan Perubahan'} </button> </>);
    const selectClassName = "block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-200";
    const textareaClassName = "block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500";

    const AddressFields = ({ addressState, addressOptions, handleChange }) => (
        <div className="space-y-3">
            <textarea name="detail" value={addressState.detail} onChange={handleChange} rows="3" className={textareaClassName} placeholder="Detail Alamat (Nama Jalan, No. Rumah, RT/RW)" />
            <select name="province" value={addressState.province} onChange={handleChange} className={selectClassName}>
                <option value="" disabled>Pilih Provinsi</option>
                {addressOptions.provinces.map(p => <option key={p.province} value={p.province}>{p.province}</option>)}
            </select>
            <select name="city" value={addressState.city} onChange={handleChange} disabled={!addressState.province} className={selectClassName}>
                <option value="" disabled>Pilih Kota/Kabupaten</option>
                {addressOptions.cities.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
            </select>
            <select name="district" value={addressState.district} onChange={handleChange} disabled={!addressState.city} className={selectClassName}>
                <option value="" disabled>Pilih Kecamatan</option>
                {addressOptions.districts.map(d => <option key={d.district} value={d.district}>{d.district}</option>)}
            </select>
            <select name="subdistrict" value={addressState.subdistrict} onChange={handleChange} disabled={!addressState.district} className={selectClassName}>
                <option value="" disabled>Pilih Kelurahan/Desa</option>
                {addressOptions.subdistricts.map(s => <option key={s.subdistrict} value={s.subdistrict}>{s.subdistrict}</option>)}
            </select>
        </div>
    );

    return (
        <>
            <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} onSubmit={handlePasswordChange} />
            <div className="bg-slate-100 min-h-screen">
                <div className="md:flex md:min-h-screen">
                    <ProfileSidebar user={{ ...formData, name: formData.business_name }} navLinks={mitraNavLinks} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                    <div className="flex-1 flex flex-col">
                        <header className="bg-white/80 backdrop-blur-md p-4 flex items-center justify-between md:hidden sticky top-0 z-20 shadow-sm">
                            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600"><MenuIcon /></button>
                            <h1 className="text-xl font-bold text-orange-500">Profil Saya</h1>
                            <div className="w-6"></div>
                        </header>
                        <main className="flex-1 p-8 md:p-12">
                            <div className="max-w-5xl mx-auto space-y-8">
                                <header className="hidden md:flex items-center justify-between">
                                    <h1 className="text-4xl font-bold text-gray-900">Pengaturan Akun Mitra</h1>
                                </header>
                                {saveMessage.text && (<div className={`p-4 rounded-lg text-center ${saveMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{saveMessage.text}</div>)}

                                <InfoCard title="Informasi Bisnis" description="Detail mengenai usaha Anda." isEditing={isEditing} onEdit={() => setIsEditing(true)}>
                                    <dl className="divide-y divide-gray-200">
                                        <ProfileField label="Jenis Usaha" name="business_type" value={formData.business_type} isEditing={isEditing} onChange={handleInputChange} />

                                        {/* [PERUBAHAN] Menggunakan kode yang Anda berikan untuk Badan Usaha & Nama Usaha */}
                                        <ProfileField label="Badan Usaha">
                                            {isEditing ? (
                                                <div>
                                                    <div className="flex items-center space-x-6 mb-4">
                                                        <label className="flex items-center space-x-2 cursor-pointer">
                                                            <input type="radio" name="business_entity" value="perorangan" checked={formData.business_entity === 'perorangan'} onChange={handleInputChange} className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                                                            <span>Perorangan</span>
                                                        </label>
                                                        <label className="flex items-center space-x-2 cursor-pointer">
                                                            <input type="radio" name="business_entity" value="berbadan_usaha" checked={formData.business_entity === 'berbadan_usaha'} onChange={handleInputChange} className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                                                            <span>Berbadan Usaha</span>
                                                        </label>
                                                    </div>
                                                    {formData.business_entity === 'berbadan_usaha' && (
                                                        <InputField icon="https://icongr.am/feather/home.svg?size=20&color=9ca3af" label="Nama Badan Usaha" id="business_name" name="business_name" value={formData.business_name} onChange={handleInputChange} placeholder="Contoh: PT. Maju Jaya" required={true} />
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="font-semibold">
                                                    {formData.business_entity === 'berbadan_usaha'
                                                        ? `Berbadan Usaha (${formData.business_name || 'Nama Belum Diisi'})`
                                                        : (formData.business_entity === 'perorangan' ? 'Perorangan' : '-')
                                                    }
                                                </span>
                                            )}
                                        </ProfileField>

                                        <ProfileField label="Alamat Bisnis">{isEditing ? <AddressFields addressState={businessAddress} addressOptions={businessAddressOptions} handleChange={handleBusinessAddressChange} /> : <span className="font-semibold">{getFullAddress(businessAddress)}</span>}</ProfileField>
                                        <ProfileField label="Lama Usaha" name="business_duration" value={formData.business_duration} isEditing={isEditing} onChange={handleInputChange} />

                                        {/* [PERUBAHAN] Platform Medsos menjadi dropdown */}
                                        <ProfileField label="Platform Medsos">
                                            {isEditing ? (
                                                <select name="social_media_platform" value={formData.social_media_platform} onChange={handleInputChange} className={selectClassName}>
                                                    <option value="" disabled>Pilih Platform</option>
                                                    <option value="Instagram">Instagram</option>
                                                    <option value="Facebook">Facebook</option>
                                                    <option value="Website">Website</option>
                                                    <option value="Lainnya">Lainnya</option>
                                                </select>
                                            ) : (
                                                <span className="font-semibold">{formData.social_media_platform || '-'}</span>
                                            )}
                                        </ProfileField>
                                        <ProfileField label="Akun Medsos" name="social_media_account" value={formData.social_media_account} isEditing={isEditing} onChange={handleInputChange} />
                                    </dl>
                                </InfoCard>

                                <InfoCard title="Informasi Pemilik" description="Data diri pemilik usaha." isEditing={isEditing} onEdit={() => setIsEditing(true)}>
                                    <dl className="divide-y divide-gray-200">
                                        <ProfileField label="Nama Pemilik" name="owner_name" value={formData.owner_name} isEditing={isEditing} onChange={handleInputChange} />
                                        <ProfileField label="No. HP Pemilik" name="owner_phone" value={formData.owner_phone} isEditing={isEditing} onChange={handleInputChange} />
                                        <ProfileField label="Email Pemilik" name="owner_email" value={formData.owner_email} isEditing={isEditing} onChange={handleInputChange} />
                                        <ProfileField label="No. KTP Pemilik" name="owner_ktp" value={formData.owner_ktp} isEditing={isEditing} onChange={handleInputChange} />
                                        <ProfileField label="Alamat Pemilik">{isEditing ? <AddressFields addressState={ownerAddress} addressOptions={ownerAddressOptions} handleChange={handleOwnerAddressChange} /> : <span className="font-semibold">{getFullAddress(ownerAddress)}</span>}</ProfileField>
                                    </dl>
                                </InfoCard>

                                <InfoCard title="Informasi PIC (Person in Charge)" description="Data narahubung yang bisa dihubungi." isEditing={isEditing} onEdit={() => setIsEditing(true)}>
                                    <dl className="divide-y divide-gray-200">
                                        <ProfileField label="Nama PIC" name="pic_name" value={formData.pic_name} isEditing={isEditing} onChange={handleInputChange} />
                                        <ProfileField label="No. HP PIC" name="pic_phone" value={formData.pic_phone} isEditing={isEditing} onChange={handleInputChange} />
                                        <ProfileField label="Email PIC" name="pic_email" value={formData.pic_email} isEditing={isEditing} onChange={handleInputChange} />

                                        {/* [PERUBAHAN] Status PIC menjadi radio */}
                                        <ProfileField label="Status PIC">
                                            {isEditing ? (
                                                <div className="flex items-center space-x-6">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input type="radio" name="pic_status" value="Pemilik" checked={formData.pic_status === 'Pemilik'} onChange={handleInputChange} className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                                                        <span>Pemilik</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input type="radio" name="pic_status" value="Pengelola" checked={formData.pic_status === 'Pengelola'} onChange={handleInputChange} className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                                                        <span>Pengelola</span>
                                                    </label>
                                                </div>
                                            ) : (
                                                <span className="font-semibold">{formData.pic_status || '-'}</span>
                                            )}
                                        </ProfileField>
                                    </dl>
                                </InfoCard>

                                <InfoCard title="Keamanan Akun" description="Ubah password Anda secara berkala.">
                                    <dl className="divide-y divide-gray-200">
                                        <ProfileField label="Email Akun" value={formData.email} isEditing={false} />
                                        <ProfileField 
                                            label="Status Verifikasi Email" 
                                            value={formData.email_is_verified ? 'Ya' : 'Tidak'} 
                                            isEditing={false} 
                                        />
                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                            <dt className="text-sm font-medium text-gray-500">Password</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                <button onClick={() => setIsPasswordModalOpen(true)} className="font-semibold text-orange-600 hover:underline">Ubah Password</button>
                                            </dd>
                                        </div>
                                    </dl>
                                </InfoCard>

                                {isEditing && (
                                    <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-2xl shadow-lg">
                                        {EditModeFooter}
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MitraProfile;