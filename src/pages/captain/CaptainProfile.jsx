// pages/captain/CaptainProfile.jsx
// Halaman profil yang sudah direfaktor menggunakan komponen dinamis.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useFormHandlers } from '../../hooks/useFormHandlers';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import ProfileField from '../../components/profile/ProfileField';
import InfoCard from '../../components/profile/InfoCard';
import ChangePasswordModal from '../../components/profile/ChangePasswordModal';
import RejectedStatusView from '../../components/profile/RejectedStatusView';
import { useAddressDropdown } from '../../hooks/useAddressDropdown';

// --- Komponen Ikon ---
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

const captainNavLinks = [
    {
        to: '/captain/profile',
        label: 'Profil Saya',
        // Menggunakan ikon 'user' dari set Feather
        icon: <img src="https://icongr.am/feather/user.svg?size=20&color=ffffff" alt="Profil" />,
    },
    {
        to: '/captain/mitra', // Ganti dengan path yang sesuai
        label: 'Daftar Mitra',
        // Menggunakan ikon 'user-check' dari set Feather
        icon: <img src="https://icongr.am/feather/user-check.svg?size=20&color=ffffff" alt="Mitra" />,
    },
];


const CaptainProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const [selectedAddress, setSelectedAddress] = useState({
        province: '',
        city: '',
        district: '',
        subdistrict: ''
    });

    const {
        formData, setFormData, birthDateParts, setBirthDateParts,
        handleInputChange, handleBirthDateChange,
    } = useFormHandlers({
        name: "", birth_place: "", gender: "", phone: "", nik: "", email: "",
        job: "", marital_status: "", education: "", avatar: "", status: "", referral_code: "",
    });
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.status === 'rejected' || user?.status === 'pending') {
            navigate('/status'); // Redirect paksa jika mencoba akses langsung
        }
    }, [navigate]);

    const { addressOptions, handleAddressChange } = useAddressDropdown(selectedAddress, setSelectedAddress);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error("Sesi tidak valid.");

                const response = await api.get('/captain/profile', { headers: { 'Authorization': `Bearer ${token}` } });

                const user = response.data;
                const profile = user.coProfile;
                console.log('====================================');
                console.log('DEBUGGING DATA DARI API');
                console.log('Seluruh object user yang diterima:', user);
                console.log('Hanya object coProfile:', profile);
                console.log('====================================');
                if (!profile) throw new Error("Data profil tidak ditemukan.");

                const birthDate = new Date(profile.birth_date);
                const formattedData = {
                    name: profile.name, email: user.email, phone: user.phone,
                    birth_place: profile.birth_place || "", gender: profile.gender,
                    job: profile.job, marital_status: profile.marital_status,
                    education: profile.education, nik: profile.nik || "",
                    status: user.status,
                    rejection_reason: user.rejection_reason,
                    resubmit_allowed: user.resubmit_allowed,
                    address_detail: profile.address_detail || "",
                    referral_code: profile.referral_code || "",
                    avatar: profile.selfie_url ? `http://localhost:3000${profile.selfie_url}` : "https://placehold.co/96x96/ffffff/ea580c?text=User"
                };
                const initialBirthDateParts = {
                    day: String(birthDate.getDate()).padStart(2, '0'),
                    month: String(birthDate.getMonth() + 1).padStart(2, '0'),
                    year: String(birthDate.getFullYear()),
                };

                const addressData = {
                    province: profile.address_province || '',
                    city: profile.address_city || '',
                    district: profile.address_subdistrict || '',
                    subdistrict: profile.address_village || '', // Ingat, subdistrict diisi dari address_village
                };

                setSelectedAddress(addressData);

                setFormData(formattedData);
                setBirthDateParts(initialBirthDateParts);
                setOriginalData({ ...formattedData, birthDateParts: initialBirthDateParts, address: addressData });
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [setFormData, setBirthDateParts]);

    const handleSaveChanges = async (isResubmit = false) => {
        setLoading(true);
        setSaveMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Sesi Anda telah berakhir.");

            const payload = {
                name: formData.name, phone: formData.phone, birth_place: formData.birth_place,
                birth_date: `${birthDateParts.year}-${birthDateParts.month}-${birthDateParts.day}`,
                gender: formData.gender, job: formData.job, marital_status: formData.marital_status,
                education: formData.education, nik: formData.nik,
                address_province: selectedAddress.province,
                address_city: selectedAddress.city,
                address_subdistrict: selectedAddress.district,
                address_village: selectedAddress.subdistrict,
                address_detail: formData.address_detail,
                referral_code: formData.referral_code,
            };

            const endpoint = isResubmit ? '/resubmit' : '/captain/profile/edit';
            await api.put(endpoint, payload, { headers: { 'Authorization': `Bearer ${token}` } });

            setOriginalData({ ...formData, birthDateParts, address: selectedAddress });
            setIsEditing(false);
            const successMessage = isResubmit ? 'Data berhasil dikirim ulang! Akun Anda akan ditinjau kembali.' : 'Profil berhasil diperbarui!';
            setSaveMessage({ type: 'success', text: successMessage });
            if (isResubmit) setTimeout(() => window.location.reload(), 2000);

        } catch (err) {
            const errorMessage = err.response?.data?.message || "Gagal menyimpan perubahan.";
            setSaveMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const getFullAddress = () => {
        const parts = [
            // [PERUBAHAN] Tambahkan detail alamat di baris paling atas
            formData.address_detail,
            selectedAddress.subdistrict,
            selectedAddress.district,
            selectedAddress.city,
            selectedAddress.province
        ];
        const address = parts.filter(part => part).join(', ');
        return address || '-';
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

    const handleCancelEdit = () => {
        setFormData({ ...originalData });
        setBirthDateParts(originalData.birthDateParts);
        setSelectedAddress(originalData.address);
        setIsEditing(false);
        setSaveMessage({ type: '', text: '' });
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

    if (formData.status === 'rejected' && !isEditing) {
        return <RejectedStatusView user={formData} onEditClick={() => setIsEditing(true)} />;
    }

    const EditModeFooter = (
        <>
            <button onClick={handleCancelEdit} className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg cursor-pointer hover:bg-gray-300 transition-colors">Batal</button>
            <button onClick={() => handleSaveChanges(formData.status === 'rejected')} disabled={loading} className="px-5 py-2 bg-orange-500 text-white cursor-pointer font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors disabled:bg-gray-400">
                {loading ? 'Menyimpan...' : (formData.status === 'rejected' ? 'Kirim Ulang' : 'Simpan Perubahan')}
            </button>
        </>
    );

    const selectClassName = "block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-200 disabled:cursor-not-allowed";


    return (
        <>
            <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} onSubmit={handlePasswordChange} />
            <div className="bg-slate-100 min-h-screen">
                <div className="md:flex md:min-h-screen">
                    <ProfileSidebar
                        user={formData}
                        navLinks={captainNavLinks}
                        isOpen={isSidebarOpen}
                        setIsOpen={setIsSidebarOpen}
                    />
                    <div className="flex-1 flex flex-col">
                        <header className="bg-white/80 backdrop-blur-md p-4 flex items-center justify-between md:hidden sticky top-0 z-20 shadow-sm">
                            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600"><MenuIcon /></button>
                            <h1 className="text-xl font-bold text-orange-500">Profil Saya</h1>
                            <div className="w-6"></div>
                        </header>
                        <main className="flex-1 p-8 md:p-12">
                            <div className="max-w-5xl mx-auto space-y-8">
                                <header className="hidden md:flex items-center justify-between">
                                    <h1 className="text-4xl font-bold text-gray-900">Profile Saya</h1>
                                </header>

                                {saveMessage.text && (
                                    <div className={`p-4 rounded-lg text-center ${saveMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {saveMessage.text}
                                    </div>
                                )}

                                <InfoCard title="Informasi Pribadi" description="Perbarui data diri Anda di sini." isEditing={isEditing} onEdit={formData.status !== 'pending' ? () => setIsEditing(true) : undefined} footer={EditModeFooter}>
                                    <dl className="divide-y divide-gray-200">
                                        <ProfileField label="Kode Referal" value={formData.referral_code?.toUpperCase()} />
                                        <ProfileField label="Nama Lengkap" name="name" value={formData.name} isEditing={isEditing} onChange={handleInputChange} />
                                        <ProfileField label="Tempat & Tanggal Lahir">
                                            {isEditing ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                                                    <input type="text" name="birth_place" value={formData.birth_place} onChange={handleInputChange} placeholder="Tempat Lahir" className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm" />
                                                    <input type="tel" name="day" value={birthDateParts.day} onChange={handleBirthDateChange} placeholder="Tgl" className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm" />
                                                    <input type="tel" name="month" value={birthDateParts.month} onChange={handleBirthDateChange} placeholder="Bln" className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm" />
                                                    <input type="tel" name="year" value={birthDateParts.year} onChange={handleBirthDateChange} placeholder="Thn" className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm" />
                                                </div>
                                            ) : (
                                                <span className="font-semibold">{`${formData.birth_place || '?'}, ${birthDateParts.day}/${birthDateParts.month}/${birthDateParts.year}`}</span>
                                            )}
                                        </ProfileField>
                                        <ProfileField label="Jenis Kelamin">
                                            {isEditing ? (
                                                <div className="flex items-center space-x-6">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input type="radio" name="gender" value="Pria" checked={formData.gender === 'Pria'} onChange={handleInputChange} className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                                                        <span>Pria</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input type="radio" name="gender" value="Wanita" checked={formData.gender === 'Wanita'} onChange={handleInputChange} className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                                                        <span>Wanita</span>
                                                    </label>
                                                </div>
                                            ) : (
                                                <span className="font-semibold">{formData.gender || '-'}</span>
                                            )}
                                        </ProfileField>
                                        <ProfileField label="Nomor HP" name="phone" value={formData.phone} isEditing={isEditing} onChange={handleInputChange} />
                                        <ProfileField label="NIK" name="nik" value={formData.nik} isEditing={isEditing} onChange={handleInputChange} />
                                        <ProfileField label="Alamat Lengkap">
                                            {isEditing ? (
                                                <div className="space-y-3">
                                                    <select name="province" value={selectedAddress.province} onChange={handleAddressChange} className={selectClassName}>
                                                        <option value="" disabled>Pilih Provinsi</option>
                                                        {addressOptions.provinces.map(p => <option key={p.province} value={p.province}>{p.province}</option>)}
                                                    </select>
                                                    <select name="city" value={selectedAddress.city} onChange={handleAddressChange} disabled={!selectedAddress.province} className={selectClassName}>
                                                        <option value="" disabled>Pilih Kota/Kabupaten</option>
                                                        {addressOptions.cities.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
                                                    </select>
                                                    <select name="district" value={selectedAddress.district} onChange={handleAddressChange} disabled={!selectedAddress.city} className={selectClassName}>
                                                        <option value="" disabled>Pilih Kecamatan</option>
                                                        {addressOptions.districts.map(d => <option key={d.district} value={d.district}>{d.district}</option>)}
                                                    </select>
                                                    <select name="subdistrict" value={selectedAddress.subdistrict} onChange={handleAddressChange} disabled={!selectedAddress.district} className={selectClassName}>
                                                        <option value="" disabled>Pilih Kelurahan/Desa</option>
                                                        {addressOptions.subdistricts.map(s => <option key={s.subdistrict} value={s.subdistrict}>{s.subdistrict}</option>)}
                                                    </select>
                                                    <textarea
                                                        name="address_detail"
                                                        value={formData.address_detail}
                                                        onChange={handleInputChange}
                                                        rows="3"
                                                        className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                                        placeholder="Contoh: Jl. Mawar No. 10, RT 01/RW 02"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="font-semibold">{getFullAddress()}</span>
                                            )}
                                        </ProfileField>
                                        <ProfileField label="Pekerjaan" name="job" value={formData.job} isEditing={isEditing} onChange={handleInputChange} />
                                        <ProfileField label="Status Pernikahan">
                                            {isEditing ? (
                                                <div className="flex items-center space-x-6">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="marital_status"
                                                            value="Belum Menikah"
                                                            checked={formData.marital_status === 'Belum Menikah'}
                                                            onChange={handleInputChange}
                                                            className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                                                        />
                                                        <span>Belum Menikah</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="marital_status"
                                                            value="Sudah Menikah"
                                                            checked={formData.marital_status === 'Sudah Menikah'}
                                                            onChange={handleInputChange}
                                                            className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                                                        />
                                                        <span>Sudah Menikah</span>
                                                    </label>
                                                </div>
                                            ) : (
                                                <span className="font-semibold">{formData.marital_status || '-'}</span>
                                            )}
                                        </ProfileField>
                                        <ProfileField label="Pendidikan Terakhir" name="education" value={formData.education} isEditing={isEditing} onChange={handleInputChange} />
                                    </dl>
                                </InfoCard>
                                <InfoCard title="Keamanan Akun" description="Ubah password Anda secara berkala.">
                                    <dl className="divide-y divide-gray-200">
                                        <ProfileField label="Email" value={formData.email} isEditing={false} />
                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                            <dt className="text-sm font-medium text-gray-500">Password</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                <button onClick={() => setIsPasswordModalOpen(true)} className="font-semibold text-orange-600 hover:underline">Ubah Password</button>
                                            </dd>
                                        </div>
                                    </dl>
                                </InfoCard>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CaptainProfile;
