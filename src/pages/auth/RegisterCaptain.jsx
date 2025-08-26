import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from '../../api/api';

// Impor custom hook
import usePersistentState from '../../hooks/usePersistentState';
import { useAddressDropdown } from '../../hooks/useAddressDropdown';
import { usePasswordValidation } from '../../hooks/usePasswordValidation';
import { useFormHandlers } from '../../hooks/useFormHandlers';

// Impor komponen UI
import { InputField, SelectField } from "../../components/form/FormElements";
import FormSection from "../../components/form/FormSection";
import ImageUpload from "../../components/form/ImageUpload";
import PasswordInput from "../../components/form/PasswordInput";

const PasswordRequirement = ({ isValid, text }) => (
    <p className={`text-sm ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
        {isValid ? '✓' : '•'} {text}
    </p>
);

const RegisterCaptain = ({ isResubmitMode = false }) => {
    const navigate = useNavigate();
    const location = useLocation();


    // --- STATE MANAGEMENT DENGAN CUSTOM HOOKS ---

    const initialFormData = {
        name: "", birth_place: "", birth_date: "", password: "", phone: "",
        job: "", email: "", marital_status: "", education: "",
        address_detail: "", gender: "", nik: "", agreement: false, referral_code: ''
    };
      const initialAddress = {
        provinceCode: '', provinceName: '',
        regencyCode: '', regencyName: '',
        districtCode: '', districtName: '',
        villageCode: '', villageName: '',
        postalCode: ''
    };

    // Gunakan useFormHandlers untuk mengelola state form utama dan input handlers
    const {
        formData,
        setFormData, // Ambil setter untuk digunakan oleh useEffect
        birthDateParts,
        setBirthDateParts, // Ambil setter untuk digunakan oleh usePersistentState
        handleInputChange,
        handleBirthDateChange,
    } = useFormHandlers(initialFormData, 'captainFormData', 'captainBirthDateParts');


    // Gunakan usePersistentState untuk state alamat
    const [selectedAddress, setSelectedAddress] = usePersistentState('captainSelectedAddress', initialAddress);

    // Gunakan hook untuk validasi password
    const {
        passwordValidation,
        confirmPassword,
        passwordError,
        setPasswordError,
        validatePasswordStrength,
        handleConfirmPasswordChange: handleConfirmPassChange,
    } = usePasswordValidation();

    // Gunakan hook untuk dropdown alamat
    const {
        addressOptions,
        handleAddressChange,
    } = useAddressDropdown(selectedAddress, setSelectedAddress);

    // State lain yang tidak dikelola oleh hook
    const [selfieFile, setSelfieFile] = useState(null);
    const [selfiePreview, setSelfiePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [errorField, setErrorField] = useState(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        // Cek apakah ada state 'resubmitData' yang dikirim dari StatusPage
        if (isResubmitMode && location.state?.userId) {
            console.log("Mode pendaftaran ulang, mengambil data dari endpoint publik...");

            localStorage.removeItem('captainFormData');
            localStorage.removeItem('captainBirthDateParts');
            localStorage.removeItem('captainSelectedAddress');

            const fetchMyProfile = async () => {
                try {
                    const response = await api.get(`/profile/me`); // Panggil endpoint baru
                    const profileData = response.data;
                    if (isResubmitMode && profileData?.status !== 'rejected') {
                        return navigate('/login')
                    }

                    // Isi state form dengan data yang diterima dari backend
                    setFormData({
                        name: profileData.name,
                        email: profileData.email,
                        phone: profileData.phone,
                        nik: profileData.coProfile.nik,
                        birth_place: profileData.coProfile.birth_place,
                        job: profileData.coProfile.job,
                        marital_status: profileData.coProfile.marital_status,
                        education: profileData.coProfile.education,
                        address_detail: profileData.coProfile.address_detail,
                        gender: profileData.coProfile.gender,
                        password: '', // Password dikosongkan untuk keamanan
                        referral_code: profileData.coProfile.referral_code || '',
                        agreement: false,
                    });

                    setSelectedAddress({
                            provinceCode: profileData.coProfile.address_province_code,
                            provinceName: profileData.coProfile.address_province_name,
                            regencyCode: profileData.coProfile.address_regency_code,
                            regencyName: profileData.coProfile.address_regency_name,
                            districtCode: profileData.coProfile.address_district_code,
                            districtName: profileData.coProfile.address_district_name,
                            villageCode: profileData.coProfile.address_village_code,
                            villageName: profileData.coProfile.address_village_name,
                            postalCode: profileData.coProfile.address_postal_code,
                        });

                    // Pecah tanggal lahir untuk diisi ke input terpisah
                    if (profileData.coProfile.birth_date) {
                        const date = new Date(profileData.coProfile.birth_date);
                        setBirthDateParts({
                            day: String(date.getDate()).padStart(2, '0'),
                            month: String(date.getMonth() + 1).padStart(2, '0'),
                            year: String(date.getFullYear()),
                        });
                    }
                    if (profileData.coProfile?.selfie_url) {
                        setSelfiePreview(`http://localhost:3000${profileData.coProfile.selfie_url}`);
                    }

                } catch (error) {
                    console.error("Gagal memuat data untuk pendaftaran ulang:", error);
                }
            };

            fetchMyProfile();
        }
    }, [isResubmitMode, location.state]); // Efek ini hanya berjalan jika location.state berubah

    useEffect(() => {
        return () => { if (selfiePreview) URL.revokeObjectURL(selfiePreview); };
    }, [selfiePreview]);

    // --- EVENT HANDLERS (ORKESTRASI HOOKS) ---

    // Handler input yang disatukan, sekarang memanggil handler dari hook
    const onInputChange = (e) => {
        if (e.target.name === 'password') {
            handleInputChange(e, validatePasswordStrength); // Kirim callback validasi
            if (confirmPassword && e.target.value !== confirmPassword) {
                setPasswordError('Konfirmasi password tidak cocok.');
            } else {
                setPasswordError('');
            }
        } else {
            handleInputChange(e);
        }
    };

    const onConfirmPasswordChange = (e) => {
        handleConfirmPassChange(e, formData.password);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelfieFile(file);
            if (selfiePreview) URL.revokeObjectURL(selfiePreview);
            setSelfiePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        setErrorField(null);

        // Validasi frontend
        if (!isResubmitMode) {
            if (Object.values(passwordValidation).some(v => !v)) {
                setMessage({ type: "error", text: "Password belum memenuhi semua persyaratan." });
                return;
            }
            if (formData.password !== confirmPassword) {
                setMessage({ type: 'error', text: 'Password dan konfirmasi password tidak cocok.' });
                return;
            }
        }

        setLoading(true);
        const submissionData = new FormData();
        Object.keys(formData).forEach((key) => submissionData.append(key, formData[key]));
        submissionData.append('address_province_code', selectedAddress.provinceCode);
        submissionData.append('address_province_name', selectedAddress.provinceName);
        submissionData.append('address_regency_code', selectedAddress.regencyCode);
        submissionData.append('address_regency_name', selectedAddress.regencyName);
        submissionData.append('address_district_code', selectedAddress.districtCode);
        submissionData.append('address_district_name', selectedAddress.districtName);
        submissionData.append('address_village_code', selectedAddress.villageCode);
        submissionData.append('address_village_name', selectedAddress.villageName);
        submissionData.append('address_postal_code', selectedAddress.postalCode);
       
        if (formData.referral_code) {
            submissionData.set('referral_code', formData.referral_code.toLowerCase());
        }
        if (selfieFile) {
            submissionData.append("selfie_url", selfieFile);
        }

        const endpoint = isResubmitMode ? '/resubmit' : '/register/captain';
        const method = isResubmitMode ? 'put' : 'post';

        //     console.log("--- [DEBUG] Data FormData yang akan dikirim: ---");
        // for (const pair of submissionData.entries()) {
        //   console.log(`${pair[0]}: `, pair[1]);
        // }
        // console.log("---------------------------------------------");

        try {
            await api[method](endpoint, submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const successMessage = isResubmitMode
                ? "Data berhasil dikirim ulang! Akun Anda akan ditinjau kembali."
                : "Pendaftaran berhasil! Akun Anda akan ditinjau admin.";

            setMessage({ type: "success", text: successMessage });

            localStorage.removeItem('captainFormData');
            localStorage.removeItem('captainBirthDateParts');
            localStorage.removeItem('captainSelectedAddress');

            setTimeout(() => {
                const destination = isResubmitMode ? '/status' : '/verify-email';
                navigate(destination);
            }, 2000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Terjadi kesalahan.";
            const errorSourceField = error.response?.data?.field || null;
            setMessage({ type: "error", text: errorMessage });
            setErrorField(errorSourceField);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 md:py-20">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Formulir Pendaftaran Captain</h1>
                        <p className="text-gray-600 mt-2">Lengkapi data di bawah ini untuk menjadi bagian dari KamarOTO.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <FormSection title="Data Diri">
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
                            <InputField icon="https://icongr.am/feather/user.svg?size=20&color=9ca3af" label="Nama Lengkap" id="name" value={formData.name} onChange={onInputChange} placeholder="Masukkan nama lengkap Anda" hasError={errorField === 'name'} />
                            <InputField icon="https://icongr.am/feather/mail.svg?size=20&color=9ca3af" label="Email Aktif" id="email" type="email" value={formData.email} onChange={onInputChange} hasError={errorField === 'email'} placeholder="email@contoh.com" />
                            {!isResubmitMode && (
                                <>
                                    <PasswordInput
                                        label="Password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={onInputChange}
                                        placeholder="Buat password Anda"
                                        passwordValidation={passwordValidation}
                                        required={!isResubmitMode}
                                    />
                                    <div>
                                        <div className="relative">
                                            <InputField
                                                icon="https://icongr.am/feather/lock.svg?size=20&color=9ca3af"
                                                label="Konfirmasi Password"
                                                id="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tempat & Tanggal Lahir</label>
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    <div className="md:col-span-2"><input type="text" name="birth_place" value={formData.birth_place} onChange={onInputChange} placeholder="Tempat Lahir" className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm" /></div>
                                    <input type="tel" name="day" maxLength="2" value={birthDateParts.day} onChange={handleBirthDateChange} placeholder="Tgl" className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm" />
                                    <input type="tel" name="month" maxLength="2" value={birthDateParts.month} onChange={handleBirthDateChange} placeholder="Bln" className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm" />
                                    <input type="tel" name="year" maxLength="4" value={birthDateParts.year} onChange={handleBirthDateChange} placeholder="Thn" className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                                <div className="flex items-center space-x-6">
                                    <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="gender" value="pria" checked={formData.gender === "pria"} onChange={handleInputChange} className="h-4 w-4 text-orange-600 border-gray-300" /><span>Laki-laki</span></label>
                                    <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="gender" value="perempuan" checked={formData.gender === "perempuan"} onChange={handleInputChange} className="h-4 w-4 text-orange-600 border-gray-300" /><span>Perempuan</span></label>
                                </div>
                            </div>
                            <InputField icon="https://icongr.am/feather/file-text.svg?size=20&color=9ca3af" label="Nomor KTP / NIK" id="nik" name="nik" type="tel" value={formData.nik} onChange={handleInputChange} placeholder="Masukkan 16 digit NIK" hasError={errorField === 'nik'} />
                            <InputField icon="https://icongr.am/feather/smartphone.svg?size=20&color=9ca3af" label="Nomor HP / WA" id="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="081234567890" hasError={errorField === 'phone'} />
                            <InputField icon="https://icongr.am/feather/briefcase.svg?size=20&color=9ca3af" label="Jenis Pekerjaan" id="job" value={formData.job} onChange={handleInputChange} hasError={errorField === 'job'} placeholder="Contoh: Karyawan Swasta" />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status Pernikahan</label>
                                <div className="flex items-center space-x-6">
                                    <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="marital_status" value="Belum Menikah" checked={formData.marital_status === 'Belum Menikah'} onChange={handleInputChange} className="h-4 w-4 text-orange-600 border-gray-300" /><span>Belum Menikah</span></label>
                                    <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="marital_status" value="Sudah Menikah" checked={formData.marital_status === 'Sudah Menikah'} onChange={handleInputChange} className="h-4 w-4 text-orange-600 border-gray-300" /><span>Sudah Menikah</span></label>
                                </div>
                            </div>
                            <InputField icon="https://icongr.am/feather/award.svg?size=20&color=9ca3af" label="Pendidikan Terakhir" id="education" value={formData.education} onChange={handleInputChange} hasError={errorField === 'education'} placeholder="SMA / S1 / Dll" />
                        </FormSection>

                        <FormSection title="Alamat Domisili">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Province */}
                                <SelectField
                                    name="province"
                                    value={JSON.stringify({ code: selectedAddress.provinceCode, name: selectedAddress.provinceName })}
                                    onChange={handleAddressChange}
                                >
                                    <option value={JSON.stringify({ code: '', name: '' })}>Pilih Provinsi</option>
                                    {addressOptions.provinces.map(p => (
                                    <option key={p.id} value={JSON.stringify({ code: p.id, name: p.value })}>
                                        {p.value}
                                    </option>
                                    ))}
                                </SelectField>

                                {/* City / Regency */}
                                <SelectField
                                name="regency"
                                value={JSON.stringify({ code: selectedAddress.regencyCode, name: selectedAddress.regencyName })}
                                onChange={handleAddressChange}
                                disabled={!selectedAddress.provinceCode}
                                >
                                <option value={JSON.stringify({ code: '', name: '' })}>Pilih Kota/Kabupaten</option>
                                {addressOptions.regencies.map(r => (
                                    <option key={r.id} value={JSON.stringify({ code: r.id, name: r.display })}>
                                    {r.display}
                                    </option>
                                ))}
                                </SelectField>

                                {/* District */}
                                <SelectField
                                    name="district"
                                    value={JSON.stringify({ code: selectedAddress.districtCode, name: selectedAddress.districtName })}
                                    onChange={handleAddressChange}
                                    disabled={!selectedAddress.regencyCode}
                                >
                                    <option value={JSON.stringify({ code: '', name: '' })}>Pilih Kecamatan</option>
                                    {addressOptions.districts.map(d => (
                                    <option key={d.id} value={JSON.stringify({ code: d.id, name: d.value })}>
                                        {d.value}
                                    </option>
                                    ))}
                                </SelectField>

                                {/* Village */}
                                <SelectField
                                    name="village"
                                    value={JSON.stringify({ code: selectedAddress.villageCode, name: selectedAddress.villageName })}
                                    onChange={handleAddressChange}
                                    disabled={!selectedAddress.districtCode}
                                >
                                    <option value={JSON.stringify({ code: '', name: '' })}>Pilih Desa</option>
                                    {addressOptions.villages.map(v => (
                                    <option key={v.id} value={JSON.stringify({ code: v.id, name: v.value })}>
                                        {v.value}
                                    </option>
                                    ))}
                                </SelectField>

                                {/* Postal Code */}
                                <SelectField
                                name="postalCode"
                                value={JSON.stringify({ code: selectedAddress.postalCode || '', name: selectedAddress.postalCode || '' })}
                                onChange={handleAddressChange}
                                disabled={!selectedAddress.districtCode || addressOptions.zipcodes.length === 0}
                                >
                                <option value={JSON.stringify({ code: '', name: '' })}>Pilih Kode Pos</option>
                                {addressOptions.zipcodes.map(z => (
                                    <option key={z.id} value={JSON.stringify({ code: z.value, name: z.value })}>
                                    {z.value}
                                    </option>
                                ))}
                                </SelectField>         
                            </div>
                            <textarea name="address_detail" value={formData.address_detail} onChange={handleInputChange} placeholder="Detail alamat: Nama Jalan, RT/RW, Gedung/No. Rumah" className="mt-4 block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm" rows="3" required></textarea>
                        </FormSection>

                        <FormSection title="Dokumen & Foto">
                            <ImageUpload onFileChange={handleFileChange} previewSrc={selfiePreview} isRequired={!isResubmitMode} title='Foto Selfi Depan Rumah' />
                        </FormSection>

                        <FormSection title="Pernyataan">
                            <div className="mt-4 flex items-start space-x-3 bg-orange-50 p-4 rounded-lg">
                                <input id="agreement" name="agreement" type="checkbox" checked={formData.agreement} onChange={handleInputChange} className="cursor-pointer h-5 w-5 mt-1 text-orange-600 border-gray-300 rounded" required />
                                <label htmlFor="agreement" className="text-gray-700">Dengan ini saya menyatakan bahwa seluruh informasi yang saya berikan adalah akurat, benar, dan dapat dipertanggungjawabkan secara hukum.</label>
                            </div>
                        </FormSection>

                        <div className="text-center pt-6">
                            {message.text && (<div className={`mb-4 p-4 rounded-lg text-center ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{message.text}</div>)}
                            <button type="submit" disabled={loading} className="cursor-pointer w-full md:w-1/2 px-12 py-4 text-center font-semibold text-white bg-orange-500 rounded-lg shadow-lg hover:bg-orange-600 disabled:bg-gray-400">
                                {loading ? "Mengirim..." : "KIRIM PENDAFTARAN"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterCaptain;