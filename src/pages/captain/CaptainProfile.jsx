// pages/captain/CaptainProfile.jsx
// Halaman profil pengguna dengan fungsionalitas lengkap, termasuk edit profil dan ubah password.

import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import api from '../../api/api';


// --- Komponen Ikon (SVG Inline) ---
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const MitraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>;

// --- Komponen Sidebar ---
const Sidebar = ({ userName, userEmail, userAvatar }) => (
    <aside className="w-72 bg-gray-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-gray-800">
             <Link to="/" className="text-2xl font-bold text-orange-500">KamarOTO</Link>
        </div>
        <div className="p-6 flex flex-col items-center border-b border-gray-800">
            <img src={userAvatar || 'https://placehold.co/128x128/e2e8f0/64748b?text=User'} alt="User Avatar" className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-700" />
            <h2 className="font-semibold text-lg text-center">{userName || 'Nama Pengguna'}</h2>
            <p className="text-sm text-gray-400">{userEmail || 'email@pengguna.com'}</p>
        </div>
        <nav className="flex-grow p-4">
            <NavLink to="/captain/profile" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <ProfileIcon />
                <span>Profil Saya</span>
            </NavLink>
            <NavLink to="/daftar-mitra" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 mt-2 rounded-lg transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <MitraIcon />
                <span>Daftar Mitra</span>
            </NavLink>
        </nav>
        <div className="p-4 border-t border-gray-800">
            <Link to="/logout" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-600 hover:text-white transition-colors">
                <LogoutIcon />
                <span>Logout</span>
            </Link>
        </div>
    </aside>
);

// --- Komponen Field Profil ---
const ProfileField = ({ label, value, isEditing, onChange, name, type = "text" }) => (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            {isEditing ? (
                <input
                    type={type} name={name} value={value} onChange={onChange}
                    className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
            ) : (
                <span className="font-semibold">{value || '-'}</span>
            )}
        </dd>
    </div>
);

// --- Komponen Modal Ubah Password ---
const ChangePasswordModal = ({ isOpen, onClose, onSubmit }) => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('Password baru tidak cocok.');
            return;
        }
        setError('');
        onSubmit(passwords); // Kirim data password ke parent component
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Ubah Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="password" name="currentPassword" placeholder="Password Saat Ini" value={passwords.currentPassword} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                    <input type="password" name="newPassword" placeholder="Password Baru" value={passwords.newPassword} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                    <input type="password" name="confirmPassword" placeholder="Konfirmasi Password Baru" value={passwords.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-md">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const CaptainProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [originalUserData, setOriginalUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState({
        province: '', city: '', district: '', subdistrict: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error("Sesi tidak valid. Silakan login kembali.");

                const response = await api.get('/captain/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const profile = response.data.coProfile;
                const birthDate = new Date(profile.birth_date);
                
                const formattedData = {
                    namaLengkap: profile.name,
                    tempatLahir: profile.birth_place || "",
                    tgl: String(birthDate.getDate()).padStart(2, '0'),
                    bln: String(birthDate.getMonth() + 1).padStart(2, '0'),
                    thn: String(birthDate.getFullYear()),
                    jenisKelamin: profile.gender,
                    alamatDetail: profile.address_detail,
                    nomorHp: response.data.phone,
                    nomorKtp: profile.nik || "",
                    email: response.data.email,
                    avatar: profile.selfie_url || "https://placehold.co/128x128/e2e8f0/64748b?text=User"
                };
                
                const addressData = {
                    province: profile.address_province,
                    city: profile.address_city,
                    district: profile.address_subdistrict,
                    subdistrict: profile.address_village,
                };

                setUserData(formattedData);
                setSelectedAddress(addressData);
                setOriginalUserData({ ...formattedData, address: addressData });
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Gagal memuat data profil.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);
    
    useEffect(() => { api.get('/address').then(res => setProvinces(res.data)) }, []);
    useEffect(() => { if (selectedAddress.province) api.get(`/address?province=${selectedAddress.province}`).then(res => setCities(res.data)) }, [selectedAddress.province]);
    useEffect(() => { if (selectedAddress.city) api.get(`/address?province=${selectedAddress.province}&city=${selectedAddress.city}`).then(res => setDistricts(res.data)) }, [selectedAddress.city]);
    useEffect(() => { if (selectedAddress.district) api.get(`/address?province=${selectedAddress.province}&city=${selectedAddress.city}&district=${selectedAddress.district}`).then(res => setSubdistricts(res.data)) }, [selectedAddress.district]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        const newState = { ...selectedAddress, [name]: value };
        if (name === 'province') { newState.city = ''; newState.district = ''; newState.subdistrict = ''; setCities([]); setDistricts([]); setSubdistricts([]); }
        else if (name === 'city') { newState.district = ''; newState.subdistrict = ''; setDistricts([]); setSubdistricts([]); }
        else if (name === 'district') { newState.subdistrict = ''; setSubdistricts([]); }
        setSelectedAddress(newState);
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        setSaveMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Sesi Anda telah berakhir.");

            const payload = {
                name: userData.namaLengkap,
                phone: userData.nomorHp,
                birth_date: `${userData.thn}-${userData.bln.padStart(2, '0')}-${userData.tgl.padStart(2, '0')}`,
                gender: userData.jenisKelamin,
                address_province: selectedAddress.province,
                address_city: selectedAddress.city,
                address_subdistrict: selectedAddress.district,
                address_village: selectedAddress.subdistrict,
                address_detail: userData.alamatDetail,
            };

            await api.put('/captain/profile/edit', payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const updatedOriginalData = { ...userData, address: selectedAddress };
            setOriginalUserData(updatedOriginalData);
            setIsEditing(false);
            setSaveMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Gagal menyimpan perubahan.";
            setSaveMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (passwords) => {
        setLoading(true);
        setSaveMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            // Asumsi endpoint untuk ubah password adalah /api/profile/change-password
            await api.post('/api/profile/change-password', passwords, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
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
        setUserData({ ...originalUserData });
        setSelectedAddress(originalUserData.address);
        setIsEditing(false);
        setSaveMessage({ type: '', text: '' });
    };

    if (loading && !userData) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

    const fullAddress = `${userData?.alamatDetail}, ${selectedAddress?.subdistrict}, ${selectedAddress?.district}, ${selectedAddress?.city}, ${selectedAddress?.province}`;

    return (
        <>
            <ChangePasswordModal 
                isOpen={isPasswordModalOpen} 
                onClose={() => setIsPasswordModalOpen(false)}
                onSubmit={handlePasswordChange}
            />
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar userName={userData?.namaLengkap} userEmail={userData?.email} userAvatar={userData?.avatar} />
                
                <main className="flex-1 p-8 md:p-12">
                    <div className="max-w-5xl mx-auto">
                        <header className="flex items-center justify-between mb-10">
                            <h1 className="text-4xl font-bold text-gray-900">Pengaturan Akun</h1>
                        </header>
                        
                        {saveMessage.text && (
                            <div className={`mb-6 p-4 rounded-lg text-center ${saveMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {saveMessage.text}
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">Informasi Pribadi</h2>
                                    <p className="text-sm text-gray-500">Perbarui data diri Anda di sini.</p>
                                </div>
                                {!isEditing && (
                                    <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 px-4 py-2 bg-orange-100 cursor-pointer text-orange-700 font-semibold rounded-lg hover:bg-orange-200 transition-colors text-sm">
                                        <EditIcon />
                                        <span>Edit</span>
                                    </button>
                                )}
                            </div>
                            <div className="px-6 py-5">
                                <dl className="divide-y divide-gray-200">
                                    <ProfileField label="Nama Lengkap" name="namaLengkap" value={userData.namaLengkap} isEditing={isEditing} onChange={handleInputChange} />
                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                        <dt className="text-sm font-medium text-gray-500">Tempat & Tanggal Lahir</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {isEditing ? (
                                                <div className="grid grid-cols-4 gap-2">
                                                    <input type="text" name="tempatLahir" value={userData.tempatLahir} onChange={handleInputChange} placeholder="Tempat" className="col-span-2 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
                                                    <input type="text" name="tgl" value={userData.tgl} onChange={handleInputChange} placeholder="Tgl" className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
                                                    <input type="text" name="bln" value={userData.bln} onChange={handleInputChange} placeholder="Bln" className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
                                                    <input type="text" name="thn" value={userData.thn} onChange={handleInputChange} placeholder="Thn" className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
                                                </div>
                                            ) : (
                                                <span className="font-semibold">{`${userData.tempatLahir}, ${userData.tgl}/${userData.bln}/${userData.thn}`}</span>
                                            )}
                                        </dd>
                                    </div>
                                    <ProfileField label="Jenis Kelamin" name="jenisKelamin" value={userData.jenisKelamin} isEditing={isEditing} onChange={handleInputChange} />
                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                        <dt className="text-sm font-medium text-gray-500">Alamat Domisili</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {isEditing ? (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <select name="province" value={selectedAddress.province} onChange={handleAddressChange} className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"><option value="">Pilih Provinsi</option>{provinces.map(p=><option key={p.province} value={p.province}>{p.province}</option>)}</select>
                                                        <select name="city" value={selectedAddress.city} onChange={handleAddressChange} disabled={!selectedAddress.province} className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-200"><option value="">Pilih Kota/Kab.</option>{cities.map(c=><option key={c.city} value={c.city}>{c.city}</option>)}</select>
                                                        <select name="district" value={selectedAddress.district} onChange={handleAddressChange} disabled={!selectedAddress.city} className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-200"><option value="">Pilih Kecamatan</option>{districts.map(d=><option key={d.district} value={d.district}>{d.district}</option>)}</select>
                                                        <select name="subdistrict" value={selectedAddress.subdistrict} onChange={handleAddressChange} disabled={!selectedAddress.district} className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-200"><option value="">Pilih Kelurahan</option>{subdistricts.map(s=><option key={s.subdistrict} value={s.subdistrict}>{s.subdistrict}</option>)}</select>
                                                    </div>
                                                    <textarea name="alamatDetail" value={userData.alamatDetail} onChange={handleInputChange} placeholder="Detail alamat: Nama Jalan, RT/RW, dll" className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" rows="3"></textarea>
                                                </div>
                                            ) : (
                                                <span className="font-semibold">{fullAddress}</span>
                                            )}
                                        </dd>
                                    </div>
                                    <ProfileField label="Nomor HP" name="nomorHp" value={userData.nomorHp} isEditing={isEditing} onChange={handleInputChange} />
                                    <ProfileField label="Nomor KTP" name="nomorKtp" value={userData.nomorKtp} isEditing={isEditing} onChange={handleInputChange} />
                                </dl>
                            </div>
                            {isEditing && (
                                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                                    <button onClick={handleCancelEdit} className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg cursor-pointer hover:bg-gray-300 transition-colors">Batal</button>
                                    <button onClick={handleSaveChanges} disabled={loading} className="px-5 py-2 bg-orange-500 text-white cursor-pointer font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors disabled:bg-gray-400">
                                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-8">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">Keamanan Akun</h2>
                                <p className="text-sm text-gray-500">Ubah password Anda secara berkala untuk menjaga keamanan.</p>
                            </div>
                            <div className="px-6 py-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <ProfileField label="Email" name="email" value={userData.email} isEditing={false} />
                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                        <dt className="text-sm font-medium text-gray-500">Password</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            <button onClick={() => setIsPasswordModalOpen(true)} className="font-semibold text-orange-600 hover:underline">Ubah Password</button>
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default CaptainProfile;
