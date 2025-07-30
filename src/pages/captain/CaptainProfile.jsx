// pages/captain/CaptainProfile.jsx
// Halaman profil pengguna dengan sidebar yang telah dibuat responsif untuk mobile.

import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import api from '../../api/api';
import { useFormHandlers } from '../../hooks/useFormHandlers'; 

// --- Komponen Ikon (SVG Inline) ---
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const MitraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;


// --- Komponen Sidebar ---
const Sidebar = ({ userName, userEmail, userAvatar, userStatus, isOpen, setIsOpen }) => {
    // Logika untuk styling status
    const statusStyles = {
        approved: { text: 'Approved', classes: 'bg-green-500 text-white' },
        pending: { text: 'Pending', classes: 'bg-yellow-500 text-white' },
        rejected: { text: 'Rejected', classes: 'bg-red-500 text-white' },
        active: { text: 'Approved', classes: 'bg-green-500 text-white' } // Mengganti 'active' menjadi 'Approved' di UI
    };
    const statusInfo = statusStyles[userStatus] || { text: userStatus, classes: 'bg-gray-500 text-white' };

    return (
        <>
            <div 
                className={`fixed inset-0 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            ></div>

            <aside className={`fixed md:relative inset-y-0 left-0 w-64 bg-slate-800 text-white flex-shrink-0 flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:rounded-2xl md:shadow-lg md:m-4 md:h-[calc(100vh-2rem)]`}>
                <div className="p-6 flex flex-col items-center border-b border-slate-700">
                    <img src={userAvatar || 'https://placehold.co/128x128/e2e8f0/64748b?text=User'} alt="User Avatar" className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-700" />
                    <h2 className="font-semibold text-lg text-center">{userName || 'Nama Pengguna'}</h2>
                    <p className="text-sm text-gray-400 mb-2">{userEmail || 'email@pengguna.com'}</p>
                    {userStatus && (
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${statusInfo.classes}`}>
                            {statusInfo.text}
                        </span>
                    )}
                </div>
                <nav className="flex-grow p-4">
                    <NavLink to="/captain/profile" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
                        <ProfileIcon />
                        <span>Profil Saya</span>
                    </NavLink>
                    <NavLink to="/daftar-mitra" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 mt-2 rounded-lg transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
                        <MitraIcon />
                        <span>Daftar Mitra</span>
                    </NavLink>
                </nav>
                <div className="p-4 border-t border-slate-700">
                    <Link to="/logout" className="cursor-pointer flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-600 hover:text-white transition-colors">
                        <LogoutIcon />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>
        </>
    );
};

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
        onSubmit(passwords);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk sidebar mobile
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
    
    const {
        formData,
        setFormData,
        birthDateParts,
        setBirthDateParts,
        handleInputChange,
        handleBirthDateChange,
    } = useFormHandlers({
        name: "", birth_place: "", gender: "", phone: "", nik: "", email: "",
        job: "", marital_status: "", education: "", avatar: "", birth_date: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error("Sesi tidak valid. Silakan login kembali.");

                const response = await api.get('/captain/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const user = response.data;
                const profile = user.coProfile;

                if (!profile) {
                    throw new Error("Data profil Captain tidak ditemukan di dalam respons server.");
                }

                const birthDate = new Date(profile.birth_date);
                
                const formattedData = {
                    name: profile.name,
                    email: user.email,
                    phone: user.phone,
                    birth_place: profile.birth_place || "",
                    gender: profile.gender,
                    job: profile.job,
                    marital_status: profile.marital_status,
                    education: profile.education,
                    nik: profile.nik || "",
                    status: user.status,
                    avatar: profile.selfie_url ? `http://localhost:3000${profile.selfie_url}` : "https://placehold.co/96x96/ffffff/ea580c?text=User"
                };

                const initialBirthDateParts = {
                    day: String(birthDate.getDate()).padStart(2, '0'),
                    month: String(birthDate.getMonth() + 1).padStart(2, '0'),
                    year: String(birthDate.getFullYear()),
                };

                setFormData(formattedData);
                setBirthDateParts(initialBirthDateParts);
                setOriginalData({ ...formattedData, birthDateParts: initialBirthDateParts });
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Gagal memuat data profil.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [setFormData, setBirthDateParts]);

    const handleSaveChanges = async () => {
        setLoading(true);
        setSaveMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Sesi Anda telah berakhir.");

            const payload = {
                name: formData.name,
                phone: formData.phone,
                birth_place: formData.birth_place,
                birth_date: `${birthDateParts.year}-${birthDateParts.month}-${birthDateParts.day}`,
                gender: formData.gender,
                job: formData.job,
                marital_status: formData.marital_status,
                education: formData.education,
                nik: formData.nik,
            };

            await api.put('/captain/profile/edit', payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setOriginalData({ ...formData, birthDateParts });
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
        setFormData({ ...originalData });
        setBirthDateParts(originalData.birthDateParts);
        setIsEditing(false);
        setSaveMessage({ type: '', text: '' });
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

    return (
        <>
            <ChangePasswordModal 
                isOpen={isPasswordModalOpen} 
                onClose={() => setIsPasswordModalOpen(false)}
                onSubmit={handlePasswordChange}
            />
            <div className="bg-slate-100 min-h-screen">
                <div className="md:flex md:min-h-screen">
                    <Sidebar userName={formData.name} userEmail={formData.email} userAvatar={formData.avatar} userStatus={formData.status} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                    
                    <div className="flex-1 flex flex-col">
                        <header className="bg-white/80 backdrop-blur-md p-4 flex items-center justify-between md:hidden sticky top-0 z-20 shadow-sm">
                            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600"><MenuIcon /></button>
                            <h1 className="text-xl font-bold text-orange-500">Profil Saya</h1>
                            <div className="w-6"></div> {/* Spacer */}
                        </header>

                        <main className="flex-1 p-8 md:p-12">
                            <div className="max-w-5xl mx-auto">
                                <header className="hidden md:flex items-center justify-between mb-10">
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
                                            <ProfileField label="Nama Lengkap" name="name" value={formData.name} isEditing={isEditing} onChange={handleInputChange} />
                                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                                <dt className="text-sm font-medium text-gray-500">Tempat & Tanggal Lahir</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                    {isEditing ? (
                                                        <div className="grid grid-cols-4 gap-2">
                                                            <input type="text" name="birth_place" value={formData.birth_place} onChange={handleInputChange} placeholder="Tempat" className="col-span-2 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
                                                            <input type="tel" name="day" value={birthDateParts.day} onChange={handleBirthDateChange} placeholder="Tgl" className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
                                                            <input type="tel" name="month" value={birthDateParts.month} onChange={handleBirthDateChange} placeholder="Bln" className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
                                                            <input type="tel" name="year" value={birthDateParts.year} onChange={handleBirthDateChange} placeholder="Thn" className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
                                                        </div>
                                                    ) : (
                                                        <span className="font-semibold">{`${formData.birth_place}, ${birthDateParts.day}/${birthDateParts.month}/${birthDateParts.year}`}</span>
                                                    )}
                                                </dd>
                                            </div>
                                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                                <dt className="text-sm font-medium text-gray-500">Jenis Kelamin</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                    {isEditing ? (
                                                        <div className="flex items-center space-x-6">
                                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                                <input type="radio" name="gender" value="pria" checked={formData.gender === 'pria'} onChange={handleInputChange} className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                                                                <span>Laki-laki</span>
                                                            </label>
                                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                                <input type="radio" name="gender" value="perempuan" checked={formData.gender === 'perempuan'} onChange={handleInputChange} className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                                                                <span>Perempuan</span>
                                                            </label>
                                                        </div>
                                                    ) : (
                                                        <span className="font-semibold">{formData.gender || '-'}</span>
                                                    )}
                                                </dd>
                                            </div>
                                            <ProfileField label="Nomor HP" name="phone" value={formData.phone} isEditing={isEditing} onChange={handleInputChange} />
                                            <ProfileField label="Nomor KTP" name="nik" value={formData.nik} isEditing={isEditing} onChange={handleInputChange} />
                                            <ProfileField label="Email" name="email" value={formData.email} isEditing={false} />
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
                                            <ProfileField label="Email" name="email" value={formData.email} isEditing={false} />
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
                </div>
            </div>
            </>
        );
    };

export default CaptainProfile;
