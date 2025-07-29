// pages/auth/RegisterMitra.jsx
// Halaman ini telah direfaktor untuk menggunakan komponen formulir yang bisa digunakan kembali.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000'; // Pastikan URL ini sesuai

// Mengimpor komponen-komponen yang sudah dipisahkan
import { InputField, SelectField } from '../../components/form/FormElements';
import FormSection from '../../components/form/FormSection';

const RegisterMitra = () => {
    // --- STATE MANAGEMENT ---
    const [formData, setFormData] = useState({
        pic_name: '', pic_phone: '', pic_email: '', pic_status: '',
        owner_name: '', owner_phone: '', owner_email: '', owner_ktp: '', owner_address_detail: '',
        business_type: '', business_name: '', business_address_detail: '', business_duration: '',
        social_media_account: '', agreement: false,
    });
    const [ownerProvinces, setOwnerProvinces] = useState([]);
    const [ownerCities, setOwnerCities] = useState([]);
    const [ownerDistricts, setOwnerDistricts] = useState([]);
    const [ownerSubdistricts, setOwnerSubdistricts] = useState([]);
    const [selectedOwnerAddress, setSelectedOwnerAddress] = useState({
        province: '', city: '', district: '', subdistrict: '',
    });
    const [businessProvinces, setBusinessProvinces] = useState([]);
    const [businessCities, setBusinessCities] = useState([]);
    const [businessDistricts, setBusinessDistricts] = useState([]);
    const [businessSubdistricts, setBusinessSubdistricts] = useState([]);
    const [selectedBusinessAddress, setSelectedBusinessAddress] = useState({
        province: '', city: '', district: '', subdistrict: '',
    });
    const [socialMediaPlatform, setSocialMediaPlatform] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // --- LOGIC & API CALLS ---
    useEffect(() => {
        axios.get('/address').then(res => {
            setOwnerProvinces(res.data);
            setBusinessProvinces(res.data);
        }).catch(err => console.error(err));
    }, []);

    useEffect(() => { if (selectedOwnerAddress.province) axios.get(`/address?province=${selectedOwnerAddress.province}`).then(res => setOwnerCities(res.data)) }, [selectedOwnerAddress.province]);
    useEffect(() => { if (selectedOwnerAddress.city) axios.get(`/address?province=${selectedOwnerAddress.province}&city=${selectedOwnerAddress.city}`).then(res => setOwnerDistricts(res.data)) }, [selectedOwnerAddress.city]);
    useEffect(() => { if (selectedOwnerAddress.district) axios.get(`/address?province=${selectedOwnerAddress.province}&city=${selectedOwnerAddress.city}&district=${selectedOwnerAddress.district}`).then(res => setOwnerSubdistricts(res.data)) }, [selectedOwnerAddress.district]);
    
    useEffect(() => { if (selectedBusinessAddress.province) axios.get(`/address?province=${selectedBusinessAddress.province}`).then(res => setBusinessCities(res.data)) }, [selectedBusinessAddress.province]);
    useEffect(() => { if (selectedBusinessAddress.city) axios.get(`/address?province=${selectedBusinessAddress.province}&city=${selectedBusinessAddress.city}`).then(res => setBusinessDistricts(res.data)) }, [selectedBusinessAddress.city]);
    useEffect(() => { if (selectedBusinessAddress.district) axios.get(`/address?province=${selectedBusinessAddress.province}&city=${selectedBusinessAddress.city}&district=${selectedBusinessAddress.district}`).then(res => setBusinessSubdistricts(res.data)) }, [selectedBusinessAddress.district]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Validasi untuk input numerik
        const numericFields = ['pic_phone', 'owner_phone', 'owner_ktp'];
        if (numericFields.includes(name)) {
            const numericValue = value.replace(/[^0-9]/g, '');
            setFormData(prev => ({ ...prev, [name]: numericValue }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleOwnerAddressChange = (e) => {
        const { name, value } = e.target;
        const newState = { ...selectedOwnerAddress, [name]: value };
        if (name === 'province') { newState.city = ''; newState.district = ''; newState.subdistrict = ''; setOwnerCities([]); setOwnerDistricts([]); setOwnerSubdistricts([]); }
        else if (name === 'city') { newState.district = ''; newState.subdistrict = ''; setOwnerDistricts([]); setOwnerSubdistricts([]); }
        else if (name === 'district') { newState.subdistrict = ''; setOwnerSubdistricts([]); }
        setSelectedOwnerAddress(newState);
    };
    
    const handleBusinessAddressChange = (e) => {
        const { name, value } = e.target;
        const newState = { ...selectedBusinessAddress, [name]: value };
        if (name === 'province') { newState.city = ''; newState.district = ''; newState.subdistrict = ''; setBusinessCities([]); setBusinessDistricts([]); setBusinessSubdistricts([]); }
        else if (name === 'city') { newState.district = ''; newState.subdistrict = ''; setBusinessDistricts([]); setBusinessSubdistricts([]); }
        else if (name === 'district') { newState.subdistrict = ''; setBusinessSubdistricts([]); }
        setSelectedBusinessAddress(newState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setMessage({ type: '', text: '' });
        if (!formData.agreement) { setMessage({ type: 'error', text: 'Anda harus menyetujui pernyataan.' }); setLoading(false); return; }
        
        const submissionData = {
            ...formData,
            owner_address: selectedOwnerAddress,
            business_address: selectedBusinessAddress,
            social_media_platform: socialMediaPlatform,
        };

        try {
            await axios.post('/register/mitra', submissionData);
            setMessage({ type: 'success', text: 'Pendaftaran berhasil! Akun Anda akan ditinjau admin.' });
        } catch (error) { setMessage({ type: 'error', text: error.response?.data?.message || 'Terjadi kesalahan.' }); }
        finally { setLoading(false); }
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 md:py-20">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Formulir Pendaftaran Mitra</h1>
                        <p className="text-gray-600 mt-2">Bergabunglah sebagai Mitra KamarOTO dan kembangkan usaha Anda.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <FormSection title="Data Person In Charge (PIC)">
                            <InputField icon="https://icongr.am/feather/user.svg?size=20&color=9ca3af" label="Nama Lengkap PIC" id="pic_name" name="pic_name" value={formData.pic_name} onChange={handleInputChange} placeholder="Masukkan nama lengkap PIC" />
                            <InputField icon="https://icongr.am/feather/smartphone.svg?size=20&color=9ca3af" label="Nomor HP / WA PIC" id="pic_phone" name="pic_phone" type="tel" value={formData.pic_phone} onChange={handleInputChange} placeholder="081234567890" />
                            <InputField icon="https://icongr.am/feather/mail.svg?size=20&color=9ca3af" label="Email Aktif PIC" id="pic_email" name="pic_email" value={formData.pic_email} onChange={handleInputChange} type="email" placeholder="email.pic@contoh.com" />
                            <InputField icon="https://icongr.am/feather/briefcase.svg?size=20&color=9ca3af" label="Status PIC" id="pic_status" name="pic_status" value={formData.pic_status} onChange={handleInputChange} placeholder="Contoh: Manajer, Pemilik" />
                        </FormSection>

                        <FormSection title="Data Pemilik Usaha">
                            <InputField icon="https://icongr.am/feather/user.svg?size=20&color=9ca3af" label="Nama Lengkap Pemilik" id="owner_name" name="owner_name" value={formData.owner_name} onChange={handleInputChange} placeholder="Masukkan nama lengkap pemilik" />
                            <InputField icon="https://icongr.am/feather/smartphone.svg?size=20&color=9ca3af" label="Nomor HP / WA Pemilik" id="owner_phone" name="owner_phone" type="tel" value={formData.owner_phone} onChange={handleInputChange} placeholder="081234567890" />
                            <InputField icon="https://icongr.am/feather/mail.svg?size=20&color=9ca3af" label="Email Aktif Pemilik" id="owner_email" name="owner_email" value={formData.owner_email} onChange={handleInputChange} type="email" placeholder="email.pemilik@contoh.com" />
                            <InputField icon="https://icongr.am/feather/file-text.svg?size=20&color=9ca3af" label="No. Identitas / No. KTP Pemilik" id="owner_ktp" name="owner_ktp" type="tel" value={formData.owner_ktp} onChange={handleInputChange} placeholder="Masukkan 16 digit nomor KTP" />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Pemilik Sesuai KTP</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <SelectField name="province" value={selectedOwnerAddress.province} onChange={handleOwnerAddressChange}><option value="">Pilih Provinsi</option>{ownerProvinces.map(p=><option key={p.province} value={p.province}>{p.province}</option>)}</SelectField>
                                    <SelectField name="city" value={selectedOwnerAddress.city} onChange={handleOwnerAddressChange} disabled={!selectedOwnerAddress.province}><option value="">Pilih Kota/Kabupaten</option>{ownerCities.map(c=><option key={c.city} value={c.city}>{c.city}</option>)}</SelectField>
                                    <SelectField name="district" value={selectedOwnerAddress.district} onChange={handleOwnerAddressChange} disabled={!selectedOwnerAddress.city}><option value="">Pilih Kecamatan</option>{ownerDistricts.map(d=><option key={d.district} value={d.district}>{d.district}</option>)}</SelectField>
                                    <SelectField name="subdistrict" value={selectedOwnerAddress.subdistrict} onChange={handleOwnerAddressChange} disabled={!selectedOwnerAddress.district}><option value="">Pilih Kelurahan/Desa</option>{ownerSubdistricts.map(s=><option key={s.subdistrict} value={s.subdistrict}>{s.subdistrict}</option>)}</SelectField>
                                </div>
                                <textarea name="owner_address_detail" value={formData.owner_address_detail} onChange={handleInputChange} placeholder="Detail alamat: Nama Jalan, RT/RW, Gedung/No. Rumah" className="mt-4 block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" rows="3"></textarea>
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
                            <InputField icon="https://icongr.am/feather/home.svg?size=20&color=9ca3af" label="Nama Badan Usaha" id="business_name" name="business_name" value={formData.business_name} onChange={handleInputChange} placeholder="Contoh: PT. Maju Jaya" />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap Usaha</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <SelectField name="province" value={selectedBusinessAddress.province} onChange={handleBusinessAddressChange}><option value="">Pilih Provinsi</option>{businessProvinces.map(p=><option key={p.province} value={p.province}>{p.province}</option>)}</SelectField>
                                    <SelectField name="city" value={selectedBusinessAddress.city} onChange={handleBusinessAddressChange} disabled={!selectedBusinessAddress.province}><option value="">Pilih Kota/Kabupaten</option>{businessCities.map(c=><option key={c.city} value={c.city}>{c.city}</option>)}</SelectField>
                                    <SelectField name="district" value={selectedBusinessAddress.district} onChange={handleBusinessAddressChange} disabled={!selectedBusinessAddress.city}><option value="">Pilih Kecamatan</option>{businessDistricts.map(d=><option key={d.district} value={d.district}>{d.district}</option>)}</SelectField>
                                    <SelectField name="subdistrict" value={selectedBusinessAddress.subdistrict} onChange={handleBusinessAddressChange} disabled={!selectedBusinessAddress.district}><option value="">Pilih Kelurahan/Desa</option>{businessSubdistricts.map(s=><option key={s.subdistrict} value={s.subdistrict}>{s.subdistrict}</option>)}</SelectField>
                                </div>
                                <textarea name="business_address_detail" value={formData.business_address_detail} onChange={handleInputChange} placeholder="Detail alamat: Nama Jalan, RT/RW, Gedung/No. Rumah" className="mt-4 block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" rows="3"></textarea>
                            </div>
                            <InputField icon="https://icongr.am/feather/clock.svg?size=20&color=9ca3af" label="Lama Usaha" id="business_duration" name="business_duration" value={formData.business_duration} onChange={handleInputChange} placeholder="Contoh: 5 Tahun" />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sosial Media Badan Usaha</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <SelectField value={socialMediaPlatform} onChange={(e) => setSocialMediaPlatform(e.target.value)}><option value="">Pilih Platform</option><option>Instagram</option><option>Facebook</option><option>Website</option></SelectField>
                                    <input type="text" name="social_media_account" value={formData.social_media_account} onChange={handleInputChange} placeholder="Account Name" className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" />
                                </div>
                            </div>
                        </FormSection>

                        <FormSection title="Pernyataan">
                            <div className="mt-4 flex items-start space-x-3 bg-orange-50 p-4 rounded-lg">
                                <input id="agreement" name="agreement" type="checkbox" checked={formData.agreement} onChange={handleInputChange} className="h-5 w-5 mt-1 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
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
                            <button type="submit" disabled={loading} className="w-full md:w-1/2 px-12 py-4 text-center font-semibold text-white bg-orange-500 rounded-lg shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform hover:scale-105 disabled:bg-gray-400">
                                {loading ? 'Mengirim...' : 'KIRIM PENDAFTARAN'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterMitra;
