// pages/mitra/MitraProfile.jsx
// Versi final dengan update pada input Status PIC, Platform Medsos, dan Badan Usaha.

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useFormHandlers } from '../../hooks/useFormHandlers';
import { useAddressDropdown } from '../../hooks/useAddressDropdown';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import ProfileField from '../../components/profile/ProfileField';
import InfoCard from '../../components/profile/InfoCard';
import ChangePasswordModal from '../../components/profile/ChangePasswordModal';
import RejectedStatusView from '../../components/profile/RejectedStatusView';
import { InputField, SelectField } from '../../components/form/FormElements';

// --- Komponen Ikon ---
const MenuIcon = () => <svg xmlns="http://www.w.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

const businessTypeMap = {
    'jual_beli_kendaraan': 'Jual Beli Kendaraan',
    'bengkel': 'Jasa Bengkel',
    'cuci_kendaraan': 'Jasa Cuci Kendaraan',
    'jual_beli_sparepart': 'Jual Beli Sparepart',
    'sewa_kendaraan': 'Jasa Sewa Kendaraan',
    'insurance_consultant': 'Insurance Consultant',
    'pembiayaan': 'Fasilitas Pembiayaan',
    'biro_jasa': 'Biro Jasa dan Sekolah Mengemudi',
};

const reverseBusinessTypeMap = Object.fromEntries(
    Object.entries(businessTypeMap).map(([key, value]) => [value, key])
);
const MitraProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const { formData, setFormData, handleInputChange } = useFormHandlers({
        email: "", status: "", avatar: "",
        pic_name: "", pic_phone: "", pic_email: "", pic_status: "",
        owner_name: "", owner_phone: "", owner_email: "", owner_ktp: "",
        business_type: "", business_entity: "", business_name: "",
        business_duration: "", social_media_platform: "", social_media_account: "",
        owner_address_detail: "", business_address_detail: "",
        rejection_reason: "", resubmit_allowed: false,
    });

    const initialAddress = {
        provinceCode: '', provinceName: '', regencyCode: '', regencyName: '',
        districtCode: '', districtName: '', villageCode: '', villageName: '', postalCode: '',
    };

    const [selectedOwnerAddress, setSelectedOwnerAddress] = useState(initialAddress);
    const { addressOptions: ownerAddressOptions, handleAddressChange: handleOwnerAddressChange } = useAddressDropdown(selectedOwnerAddress, setSelectedOwnerAddress);

    const [selectedBusinessAddress, setSelectedBusinessAddress] = useState(initialAddress);
    const { addressOptions: businessAddressOptions, handleAddressChange: handleBusinessAddressChange } = useAddressDropdown(selectedBusinessAddress, setSelectedBusinessAddress);

    const mitraNavLinks = useMemo(() => {
    const baseLinks = [
        { 
            to: '/mitra/profile', 
            label: 'Profil Saya', 
            icon: <img src="https://icongr.am/feather/user.svg?size=20&color=currentColor" alt="Profil"/> 
        }
    ];

    const businessTypeKey = reverseBusinessTypeMap[formData.business_type];

    if (['jual_beli_kendaraan', 'jual_beli_sparepart'].includes(businessTypeKey)) {
        baseLinks.push({ 
            to: '/mitra/store',
            label: 'Toko Saya',
            icon: <img src="https://icongr.am/feather/shopping-bag.svg?size=20&color=currentColor" alt="Toko"/>
        });
    } else if (['bengkel', 'cuci_kendaraan', 'sewa_kendaraan'].includes(businessTypeKey)) {
        baseLinks.push({ 
            to: '/mitra/workshop',
            label: 'Manajemen Bengkel',
            icon: <img src="https://icongr.am/feather/tool.svg?size=20&color=currentColor" alt="Bengkel"/>
        });
    }
        
    return baseLinks;
}, [formData.business_type]);

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

                const initialFormData = {
                    email: user.email, status: user.status,
                    avatar: mitraProfile.business_logo_url ? `http://localhost:3000${mitraProfile.business_logo_url}` : "https://placehold.co/96x96/ffffff/ea580c?text=Mitra",
                    pic_name: mitraProfile.pic_name || "", pic_phone: mitraProfile.pic_phone || "", pic_email: mitraProfile.pic_email || "", pic_status: mitraProfile.pic_status || "",
                    owner_name: mitraProfile.owner_name || "", owner_phone: mitraProfile.owner_phone || "", owner_email: mitraProfile.owner_email || "", owner_ktp: mitraProfile.owner_ktp || "",
                    business_type: businessTypeMap[mitraProfile.business_type] || mitraProfile.business_type || "", business_entity: mitraProfile.business_entity || "", business_name: mitraProfile.business_name || "",
                    business_duration: mitraProfile.business_duration || "", social_media_platform: mitraProfile.social_media_platform || "", social_media_account: mitraProfile.social_media_account || "",
                    owner_address_detail: mitraProfile.owner_address_detail || "",
                    business_address_detail: mitraProfile.business_address_detail || "",
                    rejection_reason: user.rejection_reason,
                    resubmit_allowed: user.resubmit_allowed,
                };
                setFormData(initialFormData);

                const ownerAddr = {
                    provinceCode: mitraProfile.owner_address_province_code || '', provinceName: mitraProfile.owner_address_province_name || '',
                    regencyCode: mitraProfile.owner_address_regency_code || '', regencyName: mitraProfile.owner_address_regency_name || '',
                    districtCode: mitraProfile.owner_address_district_code || '', districtName: mitraProfile.owner_address_district_name || '',
                    villageCode: mitraProfile.owner_address_village_code || '', villageName: mitraProfile.owner_address_village_name || '',
                    postalCode: mitraProfile.owner_address_postal_code || '',
                };
                setSelectedOwnerAddress(ownerAddr);

                const businessAddr = {
                    provinceCode: mitraProfile.business_address_province_code || '', provinceName: mitraProfile.business_address_province_name || '',
                    regencyCode: mitraProfile.business_address_regency_code || '', regencyName: mitraProfile.business_address_regency_name || '',
                    districtCode: mitraProfile.business_address_district_code || '', districtName: mitraProfile.business_address_district_name || '',
                    villageCode: mitraProfile.business_address_village_code || '', villageName: mitraProfile.business_address_village_name || '',
                    postalCode: mitraProfile.business_address_postal_code || '',
                };
                setSelectedBusinessAddress(businessAddr);

                setOriginalData({ formData: initialFormData, ownerAddress: ownerAddr, businessAddress: businessAddr });
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [setFormData]);

    // --- Action Handlers ---
    const handleSaveChanges = async (isResubmit = false) => {
        setLoading(true);
        setSaveMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Sesi Anda telah berakhir.");

            // [PENYESUAIAN] Buat payload dengan struktur data baru
            const payload = {
                ...formData,
                ...selectedOwnerAddress,
                ...selectedBusinessAddress,
            };

            if (payload.business_type) {
                payload.business_type = reverseBusinessTypeMap[payload.business_type] || payload.business_type;
            }

            delete payload.email; delete payload.status; delete payload.avatar;
            delete payload.rejection_reason; delete payload.resubmit_allowed;

            const endpoint = isResubmit ? '/resubmit' : '/mitra/profile/edit';
            await api.put(endpoint, payload, { headers: { 'Authorization': `Bearer ${token}` } });

            setOriginalData({ formData, ownerAddress: selectedOwnerAddress, businessAddress: selectedBusinessAddress });
            setIsEditing(false);
            const successMessage = isResubmit ? 'Data berhasil dikirim ulang! Akun Anda akan ditinjau kembali.' : 'Profil berhasil diperbarui!';
            setSaveMessage({ type: 'success', text: successMessage });
            if (isResubmit) setTimeout(() => navigate('/status'), 2000);

        } catch (err) {
            setSaveMessage({ type: 'error', text: err.response?.data?.message || "Gagal menyimpan perubahan." });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setFormData(originalData.formData);
        setSelectedOwnerAddress(originalData.ownerAddress);
        setSelectedBusinessAddress(originalData.businessAddress);
        setIsEditing(false);
        setSaveMessage({ type: '', text: '' });
    };

    const getFullAddress = (addressState, detail) => {
        const parts = [detail, addressState.villageName, addressState.districtName, addressState.regencyName, addressState.provinceName, addressState.postalCode];
        return parts.filter(part => part).join(', ') || '-';
    };

    const handlePasswordChange = async (passwords) => {
        setLoading(true);
        setSaveMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            await api.post('/api/profile/change-password', passwords, { headers: { 'Authorization': `Bearer ${token}` } });
            setSaveMessage({ type: 'success', text: 'Password berhasil diubah.' });
            setIsPasswordModalOpen(false);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Gagal mengubah password.";
            setSaveMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

    // [LOGIKA BARU] Tampilkan halaman rejected jika statusnya rejected
    if (formData.status === 'rejected' && !isEditing) {
        return <RejectedStatusView user={{ ...formData, name: formData.business_name }} onEditClick={() => setIsEditing(true)} />;
    }

    const selectClassName = "block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-200";

    const EditModeFooter = (
        <>
            <button onClick={handleCancelEdit} className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Batal</button>
            <button onClick={() => handleSaveChanges(formData.status === 'rejected')} disabled={loading} className="px-5 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 disabled:bg-gray-400">
                {loading ? 'Menyimpan...' : (formData.status === 'rejected' ? 'Kirim Ulang' : 'Simpan Perubahan')}
            </button>
        </>
    );

    const AddressFields = ({ addressState, addressOptions, onAddressChange, onDetailChange, detailValue, detailName }) => (
        <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField name="province" value={JSON.stringify({ code: addressState.provinceCode, name: addressState.provinceName })} onChange={onAddressChange}>
                    <option value={JSON.stringify({ code: '', name: '' })}>Pilih Provinsi</option>
                    {addressOptions.provinces.map(p => <option key={p.id} value={JSON.stringify({ code: p.id, name: p.value })}>{p.value}</option>)}
                </SelectField>
                <SelectField name="regency" value={JSON.stringify({ code: addressState.regencyCode, name: addressState.regencyName })} onChange={onAddressChange} disabled={!addressState.provinceCode}>
                    <option value={JSON.stringify({ code: '', name: '' })}>Pilih Kota/Kabupaten</option>
                    {addressOptions.regencies.map(r => <option key={r.id} value={JSON.stringify({ code: r.id, name: r.display })}>{r.display}</option>)}
                </SelectField>
                <SelectField name="district" value={JSON.stringify({ code: addressState.districtCode, name: addressState.districtName })} onChange={onAddressChange} disabled={!addressState.regencyCode}>
                    <option value={JSON.stringify({ code: '', name: '' })}>Pilih Kecamatan</option>
                    {addressOptions.districts.map(d => <option key={d.id} value={JSON.stringify({ code: d.id, name: d.value })}>{d.value}</option>)}
                </SelectField>
                <SelectField name="village" value={JSON.stringify({ code: addressState.villageCode, name: addressState.villageName })} onChange={onAddressChange} disabled={!addressState.districtCode}>
                    <option value={JSON.stringify({ code: '', name: '' })}>Pilih Desa</option>
                    {addressOptions.villages.map(v => <option key={v.id} value={JSON.stringify({ code: v.id, name: v.value })}>{v.value}</option>)}
                </SelectField>
                <SelectField name="postalCode" value={JSON.stringify({ code: addressState.postalCode, name: addressState.postalCode })} onChange={onAddressChange} disabled={!addressState.districtCode || addressOptions.zipcodes.length === 0}>
                    <option value={JSON.stringify({ code: '', name: '' })}>Pilih Kode Pos</option>
                    {addressOptions.zipcodes.map(z => <option key={z.id} value={JSON.stringify({ code: z.value, name: z.value })}>{z.value}</option>)}
                </SelectField>
            </div>
            <textarea
                name={detailName}
                value={detailValue}
                onChange={onDetailChange}
                rows="3"
                className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm"
                placeholder="Detail Alamat (Nama Jalan, No. Rumah, RT/RW)"
            />
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
                                        <ProfileField label="Jenis Usaha">
                                            {isEditing ? (
                                                <select
                                                    name="business_type"
                                                    value={formData.business_type}
                                                    onChange={handleInputChange}
                                                    className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                                >
                                                    <option value="" disabled>Pilih Jenis Usaha</option>
                                                    {Object.values(businessTypeMap).map(value => (
                                                        <option key={value} value={value}>{value}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="font-semibold">{formData.business_type || '-'}</span>
                                            )}
                                        </ProfileField>

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

                                        <ProfileField label="Alamat Bisnis">{isEditing ? <AddressFields addressState={selectedBusinessAddress} addressOptions={businessAddressOptions} onAddressChange={handleBusinessAddressChange} onDetailChange={handleInputChange} detailValue={formData.business_address_detail} detailName="business_address_detail" /> : <span className="font-semibold">{getFullAddress(selectedBusinessAddress, formData.business_address_detail)}</span>}</ProfileField>
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
                                        <ProfileField label="Alamat Pemilik">{isEditing ? <AddressFields addressState={selectedOwnerAddress} addressOptions={ownerAddressOptions} onAddressChange={handleOwnerAddressChange} onDetailChange={handleInputChange} detailValue={formData.owner_address_detail} detailName="owner_address_detail" /> : <span className="font-semibold">{getFullAddress(selectedOwnerAddress, formData.owner_address_detail)}</span>}</ProfileField>
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