import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

const PasswordRequirement = ({ isValid, text }) => (
    <p className={`text-sm ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
        {isValid ? '✓' : '•'} {text}
    </p>
);

const RegisterCaptain = () => {
   const navigate = useNavigate();

    // --- STATE MANAGEMENT DENGAN CUSTOM HOOKS ---

    const initialFormData = {
        name: "", birth_place: "", birth_date: "", password: "", phone: "",
        job: "", email: "", marital_status: "", education: "",
        address_detail: "", gender: "", nik: "", agreement: false,
    };
    const initialAddress = { province: "", city: "", district: "", subdistrict: "" };

    // Gunakan useFormHandlers untuk mengelola state form utama dan input handlers
    const {
        formData,
        setFormData, // Ambil setter untuk digunakan oleh useEffect
        birthDateParts,
        setBirthDateParts, // Ambil setter untuk digunakan oleh usePersistentState
        handleInputChange,
        handleBirthDateChange,
    } = useFormHandlers(initialFormData);
    
    // Gunakan usePersistentState untuk menyimpan state dari useFormHandlers
    usePersistentState('captainFormData', initialFormData, formData, setFormData);
    usePersistentState('captainBirthDateParts', { day: "", month: "", year: "" }, birthDateParts, setBirthDateParts);
    
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
    const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [errorField, setErrorField] = useState(null);

    // --- LOGIC & API CALLS ---
    
    useEffect(() => {
        if (selectedAddress.subdistrict) {
            const { province, city, district, subdistrict } = selectedAddress;
            api.get(`/address/coordinates?province=${province}&city=${city}&district=${district}&subdistrict=${subdistrict}`)
               .then((res) => setCoordinates(res.data))
               .catch(err => console.error("Error fetching coordinates:", err));
        }
    }, [selectedAddress.subdistrict]);

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
        if (Object.values(passwordValidation).some(v => !v)) { setMessage({ type: "error", text: "Password belum memenuhi semua persyaratan." }); return; }
        if (formData.password !== confirmPassword) { setMessage({ type: 'error', text: 'Password dan konfirmasi password tidak cocok.' }); return; }
        // ... (validasi lain)

        setLoading(true);
        const submissionData = new FormData();
        Object.keys(formData).forEach((key) => submissionData.append(key, formData[key]));
        submissionData.append('address_province', selectedAddress.province);
        submissionData.append('address_city', selectedAddress.city);
        submissionData.append('address_subdistrict', selectedAddress.district);
        submissionData.append('address_village', selectedAddress.subdistrict);
        submissionData.append("latitude", coordinates.latitude);
        submissionData.append("longitude", coordinates.longitude);
        submissionData.append("selfie_url", selfieFile);

        try {
            await api.post("/register/captain", submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage({ type: "success", text: "Pendaftaran berhasil! Akun Anda akan ditinjau admin." });
            
            localStorage.removeItem('captainFormData');
            localStorage.removeItem('captainBirthDateParts');
            localStorage.removeItem('captainSelectedAddress');

            setTimeout(() => navigate('/login'), 2000);
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
                            <InputField icon="https://icongr.am/feather/user.svg?size=20&color=9ca3af" label="Nama Lengkap" id="name" value={formData.name} onChange={onInputChange} placeholder="Masukkan nama lengkap Anda" hasError={errorField === 'name'} />
                            <InputField icon="https://icongr.am/feather/mail.svg?size=20&color=9ca3af" label="Email Aktif" id="email" type="email" value={formData.email} onChange={onInputChange} hasError={errorField === 'email'} placeholder="email@contoh.com" />
                            <div>
                                <InputField icon="https://icongr.am/feather/lock.svg?size=20&color=9ca3af" label="Password" id="password" type="password" value={formData.password} onChange={onInputChange} placeholder="Buat password Anda" hasError={errorField === 'password'} />
                                <div className="grid grid-cols-2 gap-x-4 mt-2 pl-2">
                                    <PasswordRequirement isValid={passwordValidation.minLength} text="Min. 8 karakter" />
                                    <PasswordRequirement isValid={passwordValidation.hasUpper} text="1 Huruf Kapital" />
                                    <PasswordRequirement isValid={passwordValidation.hasNumber} text="1 Angka" />
                                    <PasswordRequirement isValid={passwordValidation.hasSymbol} text="1 Simbol" />
                                </div>
                            </div>
                            <div>
                                <InputField icon="https://icongr.am/feather/lock.svg?size=20&color=9ca3af" label="Konfirmasi Password" id="confirmPassword" type="password" value={confirmPassword} onChange={onConfirmPasswordChange} placeholder="Ulangi password Anda" hasError={!!passwordError} />
                                {passwordError && <p className="text-red-500 text-xs mt-1 ml-1">{passwordError}</p>}
                            </div>
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
                                <SelectField id="province" name="province" value={selectedAddress.province} onChange={handleAddressChange} required><option value="">Pilih Provinsi</option>{addressOptions.provinces.map((p) => (<option key={p.province} value={p.province}>{p.province}</option>))}</SelectField>
                                <SelectField id="city" name="city" value={selectedAddress.city} onChange={handleAddressChange} required disabled={!selectedAddress.province || addressOptions.cities.length === 0}><option value="">Pilih Kota/Kabupaten</option>{addressOptions.cities.map((c) => (<option key={c.city} value={c.city}>{c.city}</option>))}</SelectField>
                                <SelectField id="district" name="district" value={selectedAddress.district} onChange={handleAddressChange} required disabled={!selectedAddress.city || addressOptions.districts.length === 0}><option value="">Pilih Kecamatan</option>{addressOptions.districts.map((d) => (<option key={d.district} value={d.district}>{d.district}</option>))}</SelectField>
                                <SelectField id="subdistrict" name="subdistrict" value={selectedAddress.subdistrict} onChange={handleAddressChange} required disabled={!selectedAddress.district || addressOptions.subdistricts.length === 0}><option value="">Pilih Kelurahan/Desa</option>{addressOptions.subdistricts.map((s) => (<option key={s.subdistrict} value={s.subdistrict}>{s.subdistrict}</option>))}</SelectField>
                            </div>
                            <textarea name="address_detail" value={formData.address_detail} onChange={handleInputChange} placeholder="Detail alamat: Nama Jalan, RT/RW, Gedung/No. Rumah" className="mt-4 block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm" rows="3" required></textarea>
                        </FormSection>

                        <FormSection title="Dokumen & Foto">
                            <ImageUpload onFileChange={handleFileChange} previewSrc={selfiePreview} />
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