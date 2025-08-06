// pages/auth/RegisterMitra.jsx
// Halaman pendaftaran Mitra dengan fungsionalitas upload gambar tempat usaha.

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/api';

// 1. Impor semua hook kustom yang dibutuhkan
import { useAddressDropdown } from '../../hooks/useAddressDropdown';
import usePersistentState from '../../hooks/usePersistentState';
import { useFormHandlers } from '../../hooks/useFormHandlers';
import { usePasswordValidation } from '../../hooks/usePasswordValidation';

// Mengimpor komponen-komponen UI
import { InputField, SelectField } from '../../components/form/FormElements';
import FormSection from '../../components/form/FormSection';
import ImageUpload from '../../components/form/ImageUpload';

// Komponen kecil untuk menampilkan syarat password
const PasswordRequirement = ({ isValid, text }) => (
    <p className={`text-sm ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
        {isValid ? '✓' : '•'} {text}
    </p>
);


const RegisterMitra = ({ isResubmitMode = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    // --- STATE MANAGEMENT DENGAN CUSTOM HOOKS ---
    const initialFormData = {
        pic_name: '', pic_phone: '', pic_email: '', pic_status: '',
        owner_name: '', owner_phone: '', owner_email: '', owner_ktp: '', owner_address_detail: '',
        business_type: '', business_entity: '', business_name: '', business_address_detail: '', business_duration: '',
        social_media_account: '', agreement: false, password: '', referral_code: ''
    };
    const initialAddress = { province: '', city: '', district: '', subdistrict: '' };

    const { formData, setFormData, handleInputChange: genericHandleInputChange } = useFormHandlers(initialFormData, 'mitraFormData');
    const [selectedOwnerAddress, setSelectedOwnerAddress] = usePersistentState('mitraOwnerAddress', initialAddress);
    const [selectedBusinessAddress, setSelectedBusinessAddress] = usePersistentState('mitraBusinessAddress', initialAddress);
    const [socialMediaPlatform, setSocialMediaPlatform] = usePersistentState('mitraSocialPlatform', '');
    const { passwordValidation, confirmPassword, passwordError, setPasswordError, validatePasswordStrength, handleConfirmPasswordChange: handleConfirmPassChange } = usePasswordValidation();
    const { addressOptions: ownerAddressOptions, handleAddressChange: handleOwnerAddressChange } = useAddressDropdown(selectedOwnerAddress, setSelectedOwnerAddress);
    const { addressOptions: businessAddressOptions, handleAddressChange: handleBusinessAddressChange } = useAddressDropdown(selectedBusinessAddress, setSelectedBusinessAddress);
    const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });

    const [storeImage, setStoreImage] = useState(null);
    const [storeImagePreview, setStoreImagePreview] = useState('');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setStoreImage(file);
            setStoreImagePreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if (isResubmitMode) {
            console.log("Mode pendaftaran ulang Mitra terdeteksi, mengambil data profil...");

            localStorage.removeItem('mitraFormData');
            localStorage.removeItem('mitraOwnerAddress');
            localStorage.removeItem('mitraBusinessAddress');
            localStorage.removeItem('mitraSocialPlatform');

            const fetchMyProfile = async () => {
                try {
                    const response = await api.get(`/profile/me/${location.state.userId}`);
                    const profileData = response.data;
                    const mitraProfile = profileData.mitraProfile;

                    if (mitraProfile) {
                        const businessTypeReverseMap = {
                            'jual_beli_kendaraan': 'Jual Beli Kendaraan',
                            'bengkel': 'Jasa Bengkel',
                            'cuci_kendaraan': 'Jasa Cuci Kendaraan',
                            'jual_beli_sparepart': 'Jual Beli Sparepart',
                            'sewa_kendaraan': 'Jasa Sewa Kendaraan',
                            'insurance_consultant': 'Insurance Consultant',
                            'pembiayaan': 'Fasilitas Pembiayaan',
                            'biro_jasa': 'Biro Jasa dan Sekolah Mengemudi',
                        };

                        const businessTypeForUI = businessTypeReverseMap[mitraProfile.business_type] || '';

                        setFormData({
                            ...formData,
                            pic_name: mitraProfile.pic_name,
                            pic_phone: mitraProfile.pic_phone,
                            pic_email: mitraProfile.pic_email,
                            pic_status: mitraProfile.pic_status,
                            owner_name: mitraProfile.owner_name,
                            owner_phone: mitraProfile.owner_phone,
                            owner_email: mitraProfile.owner_email,
                            owner_ktp: mitraProfile.owner_ktp,
                            owner_address_detail: mitraProfile.owner_address_detail,
                            business_type: businessTypeForUI,
                            business_entity: mitraProfile.business_entity,
                            business_name: mitraProfile.business_name || '',
                            business_address_detail: mitraProfile.business_address_detail,
                            business_duration: mitraProfile.business_duration,
                            social_media_account: mitraProfile.social_media_account,
                        });

                        setSelectedOwnerAddress({
                            province: mitraProfile.owner_address_province,
                            city: mitraProfile.owner_address_city,
                            district: mitraProfile.owner_address_subdistrict,
                            subdistrict: mitraProfile.owner_address_village,
                        });

                        setSelectedBusinessAddress({
                            province: mitraProfile.business_address_province,
                            city: mitraProfile.business_address_city,
                            district: mitraProfile.business_address_subdistrict,
                            subdistrict: mitraProfile.business_address_village,
                        });

                        setSocialMediaPlatform(mitraProfile.social_media_platform);
                    }
                } catch (error) {
                    console.error("Gagal memuat data untuk pendaftaran ulang Mitra:", error);
                    setMessage({ type: 'error', text: 'Gagal memuat data Anda. Silakan coba lagi.' });
                }
            };
            fetchMyProfile();
        }
    }, [isResubmitMode, setFormData, setSelectedOwnerAddress, setSelectedBusinessAddress, setSocialMediaPlatform, location.state]);

    useEffect(() => {
        if (selectedBusinessAddress.subdistrict) {
            const { province, city, district, subdistrict } = selectedBusinessAddress;
            api.get(`/address/coordinates?province=${province}&city=${city}&district=${district}&subdistrict=${subdistrict}`)
                .then((res) => setCoordinates(res.data))
                .catch(err => {
                    console.error("Error fetching coordinates for business address:", err);
                    setCoordinates({ latitude: null, longitude: null });
                });
        }
    }, [selectedBusinessAddress.subdistrict]);

    const handleInputChange = (e) => {
        if (e.target.name === 'business_entity' && e.target.value === 'perorangan') {
            setFormData(prev => ({ ...prev, business_name: '', business_entity: e.target.value }));
            return;
        }
        genericHandleInputChange(e);
    };

    const onInputChange = (e) => {
        if (e.target.name === 'password') {
            genericHandleInputChange(e, validatePasswordStrength);
            if (confirmPassword && e.target.value !== confirmPassword) {
                setPasswordError('Konfirmasi password tidak cocok.');
            } else { setPasswordError(''); }
        } else { handleInputChange(e); }
    };

    const onConfirmPasswordChange = (e) => {
        handleConfirmPassChange(e, formData.password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== confirmPassword && !isResubmitMode) {
            setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok.' });
            return;
        }
        if (!formData.agreement) {
            setMessage({ type: 'error', text: 'Anda harus menyetujui pernyataan untuk melanjutkan.' });
            return;
        }
        if (!storeImage && !isResubmitMode) {
            setMessage({ type: 'error', text: 'Foto tempat usaha wajib diunggah.' });
            return;
        }


        setLoading(true);
        setMessage({ type: '', text: '' });

        const registrationData = new FormData();

        const businessTypeMap = {
            'Jual Beli Kendaraan': 'jual_beli_kendaraan',
            'Jasa Bengkel': 'bengkel',
            'Jasa Cuci Kendaraan': 'cuci_kendaraan',
            'Jual Beli Sparepart': 'jual_beli_sparepart',
            'Jasa Sewa Kendaraan': 'sewa_kendaraan',
            'Insurance Consultant': 'insurance_consultant',
            'Fasilitas Pembiayaan': 'pembiayaan',
            'Biro Jasa dan Sekolah Mengemudi': 'biro_jasa',
        };

        const formDataForBackend = { ...formData };

        // Terjemahkan nilai business_type dan pic_status
        formDataForBackend.business_type = businessTypeMap[formData.business_type];

        Object.keys(formDataForBackend).forEach(key => {
            registrationData.append(key, formDataForBackend[key]);
        });

        registrationData.append('owner_address_province', selectedOwnerAddress.province);
        registrationData.append('owner_address_city', selectedOwnerAddress.city);
        registrationData.append('owner_address_subdistrict', selectedOwnerAddress.district);
        registrationData.append('owner_address_village', selectedOwnerAddress.subdistrict);

        registrationData.append('business_address_province', selectedBusinessAddress.province);
        registrationData.append('business_address_city', selectedBusinessAddress.city);
        registrationData.append('business_address_subdistrict', selectedBusinessAddress.district);
        registrationData.append('business_address_village', selectedBusinessAddress.subdistrict);

        // [PERBAIKAN] Hanya kirim koordinat jika valid (bukan null)
        if (coordinates.latitude !== null && coordinates.longitude !== null) {
            registrationData.append('latitude', coordinates.latitude);
            registrationData.append('longitude', coordinates.longitude);
        }

        registrationData.append('social_media_platform', socialMediaPlatform);

        if (storeImage) {
            // [PERBAIKAN] Pastikan nama field ini 'store_images' (plural)
            registrationData.append('store_images', storeImage);
        }

        console.log("--- DATA YANG DIKIRIM KE BACKEND ---");
        for (let [key, value] of registrationData.entries()) {
            console.log(`${key}:`, value);
        }
        console.log("------------------------------------");

        try {
            const endpoint = isResubmitMode ? '/resubmit' : '/register/mitra';
            const method = isResubmitMode ? 'put' : 'post';

            const response = await api[method](endpoint, registrationData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage({ type: 'success', text: response.data.message });
            setTimeout(() => {
                const destination = isResubmitMode ? '/status' : '/verify-email';
                navigate(destination);
            }, 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Terjadi kesalahan saat pendaftaran.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 md:py-20">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{isResubmitMode ? "Perbarui Pendaftaran Mitra" : "Formulir Pendaftaran Mitra"}</h1>
                        <p className="text-gray-600 mt-2"> {isResubmitMode ? "Perbaiki data Anda dan kirim ulang untuk ditinjau." : "Bergabunglah sebagai Mitra KamarOTO dan kembangkan usaha Anda."}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <FormSection title="Data Person In Charge (PIC)">
                            <InputField icon="https://icongr.am/feather/user.svg?size=20&color=9ca3af" label="Nama Lengkap PIC" id="pic_name" name="pic_name" value={formData.pic_name} onChange={onInputChange} placeholder="Masukkan nama lengkap PIC" />
                            <InputField icon="https://icongr.am/feather/smartphone.svg?size=20&color=9ca3af" label="Nomor HP / WA PIC" id="pic_phone" name="pic_phone" type="tel" value={formData.pic_phone} onChange={onInputChange} placeholder="081234567890" />
                            <InputField icon="https://icongr.am/feather/mail.svg?size=20&color=9ca3af" label="Email Aktif PIC" id="pic_email" name="pic_email" value={formData.pic_email} onChange={onInputChange} type="email" placeholder="email.pic@contoh.com" />
                            <InputField
                                icon="https://icongr.am/feather/gift.svg?size=20&color=9ca3af"
                                label="Kode Referral (Opsional)"
                                id="referral_code"
                                name="referral_code"
                                value={formData.referral_code}
                                onChange={handleInputChange}
                                placeholder="Masukkan kode referral jika ada"
                                required={false}
                            />
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status PIC</label>
                            <div className="flex items-center space-x-6 mb-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="pic_status"
                                        value="pengelola"
                                        checked={formData.pic_status === 'pengelola'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                                    />
                                    <span>Pengelola</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="pic_status"
                                        value="pemilik"
                                        checked={formData.pic_status === 'pemilik'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                                    />
                                    <span>Pemilik</span>
                                </label>
                            </div>
                        </FormSection>

                        <FormSection title="Data Pemilik Usaha & Akun Login">
                            <InputField icon="https://icongr.am/feather/user.svg?size=20&color=9ca3af" label="Nama Lengkap Pemilik" id="owner_name" name="owner_name" value={formData.owner_name} onChange={onInputChange} placeholder="Masukkan nama lengkap pemilik" />
                            <InputField icon="https://icongr.am/feather/mail.svg?size=20&color=9ca3af" label="Email Aktif Pemilik (untuk Login)" id="owner_email" name="owner_email" value={formData.owner_email} onChange={onInputChange} type="email" placeholder="email.pemilik@contoh.com" />

                            {!isResubmitMode && (
                                <>
                                    <div>
                                        <div className="relative">
                                            <InputField 
                                                icon="https://icongr.am/feather/lock.svg?size=20&color=9ca3af" 
                                                label="Password Akun" 
                                                id="password" 
                                                name="password" 
                                                type={showPassword ? 'text' : 'password'} // Tipe dinamis
                                                value={formData.password} 
                                                onChange={onInputChange} 
                                                placeholder="Buat password Anda" 
                                                required={!isResubmitMode} 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPassword(!showPassword)} 
                                                className="absolute inset-y-0 right-0 top-7 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? (
                                                    <img src="https://icongr.am/feather/eye-off.svg?size=20&color=currentColor" alt="Sembunyikan password" />
                                                ) : (
                                                    <img src="https://icongr.am/feather/eye.svg?size=20&color=currentColor" alt="Tampilkan password" />
                                                )}
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 mt-2 pl-2">
                                            <PasswordRequirement isValid={passwordValidation.minLength} text="Min. 8 karakter" />
                                            <PasswordRequirement isValid={passwordValidation.hasUpper} text="1 Huruf Kapital" />
                                            <PasswordRequirement isValid={passwordValidation.hasNumber} text="1 Angka" />
                                            <PasswordRequirement isValid={passwordValidation.hasSymbol} text="1 Simbol" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="relative">
                                            <InputField 
                                                icon="https://icongr.am/feather/lock.svg?size=20&color=9ca3af" 
                                                label="Konfirmasi Password" 
                                                id="confirmPassword" 
                                                type={showConfirmPassword ? 'text' : 'password'} // Tipe dinamis
                                                value={confirmPassword} 
                                                onChange={onConfirmPasswordChange} 
                                                placeholder="Ulangi password Anda" 
                                                hasError={!!passwordError} 
                                                required={!isResubmitMode} 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                                className="absolute inset-y-0 right-0 top-7 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? (
                                                    <img src="https://icongr.am/feather/eye-off.svg?size=20&color=currentColor" alt="Sembunyikan password" />
                                                ) : (
                                                    <img src="https://icongr.am/feather/eye.svg?size=20&color=currentColor" alt="Tampilkan password" />
                                                )}
                                            </button>
                                        </div>
                                        {passwordError && <p className="text-red-500 text-xs mt-1 ml-1">{passwordError}</p>}
                                    </div>
                                </>
                            )}


                            <InputField icon="https://icongr.am/feather/smartphone.svg?size=20&color=9ca3af" label="Nomor HP / WA Pemilik" id="owner_phone" name="owner_phone" type="tel" value={formData.owner_phone} onChange={onInputChange} placeholder="081234567890" />
                            <InputField icon="https://icongr.am/feather/file-text.svg?size=20&color=9ca3af" label="No. KTP Pemilik" id="owner_ktp" name="owner_ktp" type="tel" value={formData.owner_ktp} onChange={onInputChange} placeholder="Masukkan 16 digit nomor KTP" />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Pemilik Sesuai KTP</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <SelectField name="province" value={selectedOwnerAddress.province} onChange={handleOwnerAddressChange}><option value="">Pilih Provinsi</option>{ownerAddressOptions.provinces.map(p => <option key={p.province} value={p.province}>{p.province}</option>)}</SelectField>
                                    <SelectField name="city" value={selectedOwnerAddress.city} onChange={handleOwnerAddressChange} disabled={!selectedOwnerAddress.province}><option value="">Pilih Kota/Kabupaten</option>{ownerAddressOptions.cities.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}</SelectField>
                                    <SelectField name="district" value={selectedOwnerAddress.district} onChange={handleOwnerAddressChange} disabled={!selectedOwnerAddress.city}><option value="">Pilih Kecamatan</option>{ownerAddressOptions.districts.map(d => <option key={d.district} value={d.district}>{d.district}</option>)}</SelectField>
                                    <SelectField name="subdistrict" value={selectedOwnerAddress.subdistrict} onChange={handleOwnerAddressChange} disabled={!selectedOwnerAddress.district}><option value="">Pilih Kelurahan/Desa</option>{ownerAddressOptions.subdistricts.map(s => <option key={s.subdistrict} value={s.subdistrict}>{s.subdistrict}</option>)}</SelectField>
                                </div>
                                <textarea name="owner_address_detail" value={formData.owner_address_detail} onChange={onInputChange} placeholder="Detail alamat: Nama Jalan, RT/RW, Gedung/No. Rumah" className="mt-4 block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm" rows="3"></textarea>
                            </div>
                        </FormSection>

                        <FormSection title="Data Jenis Usaha">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Usaha Barang / Jasa</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {['Jual Beli Kendaraan', 'Jasa Sewa Kendaraan', 'Jasa Bengkel', 'Insurance Consultant', 'Jasa Cuci Kendaraan', 'Fasilitas Pembiayaan', 'Jual Beli Sparepart', 'Biro Jasa dan Sekolah Mengemudi'].map(type => (
                                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                            <input type="radio" name="business_type" value={type} checked={formData.business_type === type} onChange={handleInputChange} className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                                            <span>{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bentuk Usaha</label>
                                <div className="flex items-center space-x-6 mb-4">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="business_entity"
                                            value="perorangan"
                                            checked={formData.business_entity === 'perorangan'}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                                        />
                                        <span>Perorangan</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="business_entity"
                                            value="berbadan_usaha"
                                            checked={formData.business_entity === 'berbadan_usaha'}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                                        />
                                        <span>Berbadan Usaha</span>
                                    </label>
                                </div>
                                {formData.business_entity === 'berbadan_usaha' && (
                                    <InputField
                                        icon="https://icongr.am/feather/home.svg?size=20&color=9ca3af"
                                        label="Nama Badan Usaha"
                                        id="business_name"
                                        name="business_name"
                                        value={formData.business_name}
                                        onChange={handleInputChange}
                                        placeholder="Contoh: PT. Maju Jaya"
                                        required={true}
                                    />
                                )}
                                <div className='mb-6'></div>
                                <ImageUpload
                                    onFileChange={onFileChange}
                                    previewSrc={storeImagePreview}
                                    isRequired={!isResubmitMode}
                                    title='Foto Tampak Depan Usaha'
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap Usaha</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <SelectField name="province" value={selectedBusinessAddress.province} onChange={handleBusinessAddressChange}><option value="">Pilih Provinsi</option>{businessAddressOptions.provinces.map(p => <option key={p.province} value={p.province}>{p.province}</option>)}</SelectField>
                                    <SelectField name="city" value={selectedBusinessAddress.city} onChange={handleBusinessAddressChange} disabled={!selectedBusinessAddress.province}><option value="">Pilih Kota/Kabupaten</option>{businessAddressOptions.cities.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}</SelectField>
                                    <SelectField name="district" value={selectedBusinessAddress.district} onChange={handleBusinessAddressChange} disabled={!selectedBusinessAddress.city}><option value="">Pilih Kecamatan</option>{businessAddressOptions.districts.map(d => <option key={d.district} value={d.district}>{d.district}</option>)}</SelectField>
                                    <SelectField name="subdistrict" value={selectedBusinessAddress.subdistrict} onChange={handleBusinessAddressChange} disabled={!selectedBusinessAddress.district}><option value="">Pilih Kelurahan/Desa</option>{businessAddressOptions.subdistricts.map(s => <option key={s.subdistrict} value={s.subdistrict}>{s.subdistrict}</option>)}</SelectField>
                                </div>
                                <textarea name="business_address_detail" value={formData.business_address_detail} onChange={handleInputChange} placeholder="Detail alamat: Nama Jalan, RT/RW, Gedung/No. Rumah" className="mt-4 block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm" rows="3"></textarea>
                            </div>
                            <InputField icon="https://icongr.am/feather/clock.svg?size=20&color=9ca3af" label="Lama Usaha" id="business_duration" name="business_duration" value={formData.business_duration} onChange={handleInputChange} placeholder="Contoh: 5 Tahun" />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sosial Media Badan Usaha</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <SelectField value={socialMediaPlatform} onChange={(e) => setSocialMediaPlatform(e.target.value)}><option value="">Pilih Platform</option><option>Instagram</option><option>Facebook</option><option>Website</option></SelectField>
                                    <input type="text" name="social_media_account" value={formData.social_media_account} onChange={handleInputChange} placeholder="Account Name" className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm" />
                                </div>
                            </div>
                        </FormSection>

                        <FormSection title="Pernyataan">
                            <div className="mt-4 flex items-start space-x-3 bg-orange-50 p-4 rounded-lg">
                                <input id="agreement" name="agreement" type="checkbox" checked={formData.agreement} onChange={handleInputChange} className="h-5 w-5 mt-1 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                                <label htmlFor="agreement" className="text-gray-700">Dengan ini saya menyatakan bahwa seluruh informasi yang saya berikan adalah akurat, benar, dan dapat dipertanggungjawabkan secara hukum.</label>
                            </div>
                        </FormSection>

                        <div className="text-center pt-6">
                            {message.text && (<div className={`mb-4 p-4 rounded-lg text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message.text}</div>)}
                            <button type="submit" disabled={loading} className="w-full md:w-1/2 px-12 py-4 text-center font-semibold text-white bg-orange-500 rounded-lg shadow-lg hover:bg-orange-600 disabled:bg-gray-400">
                                {loading ? 'Mengirim...' : (isResubmitMode ? 'KIRIM ULANG PENDAFTARAN' : 'KIRIM PENDAFTARAN')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterMitra;
