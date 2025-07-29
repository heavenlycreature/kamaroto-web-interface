import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { InputField, SelectField } from '../../components/form/FormElements';
import FormSection from '../../components/form/FormSection';
import ImageUpload from '../../components/form/ImageUpload';
axios.defaults.baseURL = 'http://localhost:3000';

const RegisterCaptain = () => {
    const [formData, setFormData] = useState({
        name: '', birth_place: '', birth_date: '', password: '', phone: '',
        job: '', email: '', marital_status: '', education: '',
        address_detail: '', gender: '', agreement: false,
    });
    const [birthDateParts, setBirthDateParts] = useState({ day: '', month: '', year: '' });
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState({
        province: '', city: '', district: '', subdistrict: '',
    });
    const [selfieFile, setSelfieFile] = useState(null);
    const [selfiePreview, setSelfiePreview] = useState(null);
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    useEffect(() => {
        const { day, month, year } = birthDateParts;
        if (day && month && year) {
            setFormData(prev => ({ ...prev, birth_date: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` }));
        }
    }, [birthDateParts]);

    useEffect(() => { axios.get('/address').then(res => setProvinces(res.data)).catch(err => console.error(err)) }, []);
    useEffect(() => { if (selectedAddress.province) axios.get(`/address?province=${selectedAddress.province}`).then(res => setCities(res.data)) }, [selectedAddress.province]);
    useEffect(() => { if (selectedAddress.city) axios.get(`/address?province=${selectedAddress.province}&city=${selectedAddress.city}`).then(res => setDistricts(res.data)) }, [selectedAddress.city]);
    useEffect(() => { if (selectedAddress.district) axios.get(`/address?province=${selectedAddress.province}&city=${selectedAddress.city}&district=${selectedAddress.district}`).then(res => setSubdistricts(res.data)) }, [selectedAddress.district]);
    useEffect(() => {
        if (selectedAddress.subdistrict) {
            const { province, city, district, subdistrict } = selectedAddress;
            axios.get(`/address/coordinates?province=${province}&city=${city}&district=${district}&subdistrict=${subdistrict}`).then(res => setCoordinates(res.data));
        }
    }, [selectedAddress.subdistrict]);

    useEffect(() => {
        return () => { if (selfiePreview) URL.revokeObjectURL(selfiePreview); };
    }, [selfiePreview]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    const handleBirthDateChange = (e) => { setBirthDateParts(prev => ({ ...prev, [e.target.name]: e.target.value })); };
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        const newState = { ...selectedAddress, [name]: value };
        if (name === 'province') { newState.city = ''; newState.district = ''; newState.subdistrict = ''; setCities([]); setDistricts([]); setSubdistricts([]); }
        else if (name === 'city') { newState.district = ''; newState.subdistrict = ''; setDistricts([]); setSubdistricts([]); }
        else if (name === 'district') { newState.subdistrict = ''; setSubdistricts([]); }
        setSelectedAddress(newState);
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
        e.preventDefault(); setLoading(true); setMessage({ type: '', text: '' });
        if (!formData.agreement) { setMessage({ type: 'error', text: 'Anda harus menyetujui pernyataan.' }); setLoading(false); return; }
        const submissionData = new FormData();
        Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
        Object.keys(selectedAddress).forEach(key => submissionData.append(key, selectedAddress[key]));
        submissionData.append('latitude', coordinates.lat); submissionData.append('longitude', coordinates.lng);
        submissionData.append('selfie_image', selfieFile);
        try {
            await axios.post('/register/captain', submissionData);
            setMessage({ type: 'success', text: 'Pendaftaran berhasil! Akun Anda akan ditinjau admin.' });
        } catch (error) { setMessage({ type: 'error', text: error.response?.data?.message || 'Terjadi kesalahan.' }); }
        finally { setLoading(false); }
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
                            <InputField icon="https://icongr.am/feather/user.svg?size=20&color=9ca3af" label="Nama Lengkap" id="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama lengkap Anda" />
                            <InputField icon="https://icongr.am/feather/lock.svg?size=20&color=9ca3af" label="Password" id="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Buat password Anda" />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tempat & Tanggal Lahir</label>
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    <div className="md:col-span-2"><input type="text" name="birth_place" value={formData.birth_place} onChange={handleInputChange} placeholder="Tempat Lahir" className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" /></div>
                                    <input type="text" name="day" value={birthDateParts.day} onChange={handleBirthDateChange} placeholder="Tgl" className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" />
                                    <input type="text" name="month" value={birthDateParts.month} onChange={handleBirthDateChange} placeholder="Bln" className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" />
                                    <input type="text" name="year" value={birthDateParts.year} onChange={handleBirthDateChange} placeholder="Thn" className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                                <div className="flex items-center space-x-6">
                                    <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="gender" value="Laki-laki" checked={formData.gender === 'Laki-laki'} onChange={handleInputChange} className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" /><span>Laki-laki</span></label>
                                    <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="gender" value="Perempuan" checked={formData.gender === 'Perempuan'} onChange={handleInputChange} className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" /><span>Perempuan</span></label>
                                </div>
                            </div>
                            <InputField icon="https://icongr.am/feather/smartphone.svg?size=20&color=9ca3af" label="Nomor HP / WA" id="phone" value={formData.phone} onChange={handleInputChange} placeholder="081234567890" />
                            <InputField icon="https://icongr.am/feather/briefcase.svg?size=20&color=9ca3af" label="Jenis Pekerjaan" id="job" value={formData.job} onChange={handleInputChange} placeholder="Contoh: Karyawan Swasta" />
                            <InputField icon="https://icongr.am/feather/mail.svg?size=20&color=9ca3af" label="Email Aktif" id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="email@contoh.com" />
                            <InputField icon="https://icongr.am/feather/heart.svg?size=20&color=9ca3af" label="Status Pernikahan" id="marital_status" value={formData.marital_status} onChange={handleInputChange} placeholder="Belum Menikah / Menikah" />
                            <InputField icon="https://icongr.am/feather/award.svg?size=20&color=9ca3af" label="Pendidikan Terakhir" id="education" value={formData.education} onChange={handleInputChange} placeholder="SMA / S1 / Dll" />
                        </FormSection>

                        <FormSection title="Alamat Domisili">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SelectField id="province" name="province" value={selectedAddress.province} onChange={handleAddressChange} required>
                                    <option value="">Pilih Provinsi</option>
                                    {provinces.map(p => <option key={p.province} value={p.province}>{p.province}</option>)}
                                </SelectField>
                                <SelectField id="city" name="city" value={selectedAddress.city} onChange={handleAddressChange} required disabled={!selectedAddress.province || cities.length === 0}>
                                    <option value="">Pilih Kota/Kabupaten</option>
                                    {cities.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
                                </SelectField>
                                <SelectField id="district" name="district" value={selectedAddress.district} onChange={handleAddressChange} required disabled={!selectedAddress.city || districts.length === 0}>
                                    <option value="">Pilih Kecamatan</option>
                                    {districts.map(d => <option key={d.district} value={d.district}>{d.district}</option>)}
                                </SelectField>
                                <SelectField id="subdistrict" name="subdistrict" value={selectedAddress.subdistrict} onChange={handleAddressChange} required disabled={!selectedAddress.district || subdistricts.length === 0}>
                                    <option value="">Pilih Kelurahan/Desa</option>
                                    {subdistricts.map(s => <option key={s.subdistrict} value={s.subdistrict}>{s.subdistrict}</option>)}
                                </SelectField>
                            </div>
                            <textarea name="address_detail" value={formData.address_detail} onChange={handleInputChange} placeholder="Detail alamat: Nama Jalan, RT/RW, Gedung/No. Rumah" className="mt-4 block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" rows="3" required></textarea>
                        </FormSection>
                        
                        <FormSection title="Dokumen & Foto">
                            <ImageUpload onFileChange={handleFileChange} previewSrc={selfiePreview} />
                        </FormSection>
                        
                        <FormSection title="Pernyataan">
                            <div className="mt-4 flex items-start space-x-3 bg-orange-50 p-4 rounded-lg">
                                <input id="agreement" name="agreement" type="checkbox" checked={formData.agreement} onChange={handleInputChange} className="cursor-pointer h-5 w-5 mt-1 text-orange-600 border-gray-300 rounded focus:ring-orange-500" required />
                                <label htmlFor="agreement" className="text-gray-700">
                                    Dengan ini saya menyatakan bahwa seluruh informasi yang saya berikan adalah akurat, benar, dan dapat dipertanggungjawabkan secara hukum.
                                </label>
                            </div>
                        </FormSection>
                        
                        <div className="text-center pt-6">
                            {message.text && (
                                <div className={`mb-4 p-4 rounded-lg text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {message.text}
                                </div>
                            )}
                            <button type="submit" disabled={loading} className="cursor-pointer w-full md:w-1/2 px-12 py-4 text-center font-semibold text-white bg-orange-500 rounded-lg shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100">
                                {loading ? 'Mengirim...' : 'KIRIM PENDAFTARAN'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterCaptain;