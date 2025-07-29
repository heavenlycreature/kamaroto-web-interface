// pages/auth/RegisterMitra.jsx
// Halaman formulir pendaftaran untuk Mitra.

import React from 'react';
import { Link } from 'react-router-dom';

const RegisterMitra = () => {

  // Komponen input kustom dengan ikon
  const InputField = ({ icon, label, id, type = 'text', placeholder, required = true }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <img src={icon} alt="input icon" className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type={type}
          id={id}
          name={id}
          placeholder={placeholder}
          required={required}
          className="block w-full pl-10 pr-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
        />
      </div>
    </div>
  );

  // Komponen select kustom
  const SelectField = ({ id, children }) => (
    <select
      id={id}
      name={id}
      className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
    >
      {children}
    </select>
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-2xl">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Formulir Pendaftaran Mitra</h1>
            <p className="text-gray-600 mt-2">Bergabunglah sebagai Mitra KamarOTO dan kembangkan usaha Anda.</p>
          </div>

          <form className="space-y-10">
            {/* --- Data Person In Charge --- */}
            <fieldset className="space-y-6 border-t-4 border-orange-500 pt-6">
              <legend className="text-2xl font-semibold text-gray-800 px-4 -ml-4">Data Person In Charge (PIC)</legend>
              <InputField icon="https://icongr.am/feather/user.svg?size=20&color=9ca3af" label="Nama Lengkap PIC" id="namaPic" placeholder="Masukkan nama lengkap PIC" />
              <InputField icon="https://icongr.am/feather/smartphone.svg?size=20&color=9ca3af" label="Nomor HP / WA PIC" id="nomorHpPic" placeholder="081234567890" />
              <InputField icon="https://icongr.am/feather/mail.svg?size=20&color=9ca3af" label="Email Aktif PIC" id="emailPic" type="email" placeholder="email.pic@contoh.com" />
              <InputField icon="https://icongr.am/feather/briefcase.svg?size=20&color=9ca3af" label="Status PIC" id="statusPic" placeholder="Contoh: Manajer, Pemilik" />
            </fieldset>

            {/* --- Data Pemilik Usaha --- */}
            <fieldset className="space-y-6 border-t-4 border-orange-500 pt-6">
              <legend className="text-2xl font-semibold text-gray-800 px-4 -ml-4">Data Pemilik Usaha</legend>
              <InputField icon="https://icongr.am/feather/user.svg?size=20&color=9ca3af" label="Nama Lengkap Pemilik" id="namaPemilik" placeholder="Masukkan nama lengkap pemilik" />
              <InputField icon="https://icongr.am/feather/smartphone.svg?size=20&color=9ca3af" label="Nomor HP / WA Pemilik" id="nomorHpPemilik" placeholder="081234567890" />
              <InputField icon="https://icongr.am/feather/mail.svg?size=20&color=9ca3af" label="Email Aktif Pemilik" id="emailPemilik" type="email" placeholder="email.pemilik@contoh.com" />
              <InputField icon="https://icongr.am/feather/file-text.svg?size=20&color=9ca3af" label="No. Identitas / No. KTP Pemilik" id="noKtp" placeholder="Masukkan 16 digit nomor KTP" />
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Pemilik Sesuai KTP</label>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField id="provinsiKtp"><option>Pilih Provinsi</option></SelectField>
                    <SelectField id="kabupatenKtp"><option>Pilih Kabupaten / Kota</option></SelectField>
                    <SelectField id="kecamatanKtp"><option>Pilih Kecamatan</option></SelectField>
                    <SelectField id="kelurahanKtp"><option>Pilih Kelurahan / Desa</option></SelectField>
                 </div>
                 <textarea placeholder="Detail alamat: Nama Jalan, RT/RW, Gedung/No. Rumah" className="mt-4 block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" rows="3"></textarea>
              </div>
            </fieldset>
            
            {/* --- Data Jenis Usaha --- */}
            <fieldset className="space-y-6 border-t-4 border-orange-500 pt-6">
                <legend className="text-2xl font-semibold text-gray-800 px-4 -ml-4">Data Jenis Usaha</legend>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Usaha Barang / Jasa</label>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="jenisUsaha" className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" /><span>Jual Beli Kendaraan</span></label>
                        <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="jenisUsaha" className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" /><span>Jasa Sewa Kendaraan</span></label>
                        <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="jenisUsaha" className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" /><span>Jasa Bengkel</span></label>
                        <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="jenisUsaha" className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" /><span>Insurance Consultant</span></label>
                        <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="jenisUsaha" className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" /><span>Jasa Cuci Kendaraan</span></label>
                        <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="jenisUsaha" className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" /><span>Fasilitas Pembiayaan</span></label>
                        <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="jenisUsaha" className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" /><span>Jual Beli Sparepart</span></label>
                        <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="jenisUsaha" className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" /><span>Biro Jasa dan Sekolah Mengemudi</span></label>
                    </div>
                </div>
                <InputField icon="https://icongr.am/feather/home.svg?size=20&color=9ca3af" label="Nama Badan Usaha" id="namaBadanUsaha" placeholder="Contoh: PT. Maju Jaya" />
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap Usaha</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField id="provinsiUsaha"><option>Pilih Provinsi</option></SelectField>
                        <SelectField id="kabupatenUsaha"><option>Pilih Kabupaten / Kota</option></SelectField>
                        <SelectField id="kecamatanUsaha"><option>Pilih Kecamatan</option></SelectField>
                        <SelectField id="kelurahanUsaha"><option>Pilih Kelurahan / Desa</option></SelectField>
                    </div>
                    <textarea placeholder="Detail alamat: Nama Jalan, RT/RW, Gedung/No. Rumah" className="mt-4 block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" rows="3"></textarea>
                </div>
                <InputField icon="https://icongr.am/feather/clock.svg?size=20&color=9ca3af" label="Lama Usaha" id="lamaUsaha" placeholder="Contoh: 5 Tahun" />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sosial Media Badan Usaha</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField id="platformSosmed"><option>Pilih Platform</option><option>Instagram</option><option>Facebook</option><option>Website</option></SelectField>
                        <input type="text" placeholder="Account Name" className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" />
                    </div>
                </div>
            </fieldset>

            {/* --- Pernyataan --- */}
            <fieldset className="border-t-4 border-orange-500 pt-6">
              <legend className="text-2xl font-semibold text-gray-800 px-4 -ml-4">Pernyataan</legend>
              <div className="mt-4 flex items-start space-x-3 bg-orange-50 p-4 rounded-lg">
                <input id="pernyataan" name="pernyataan" type="checkbox" className="h-5 w-5 mt-1 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                <label htmlFor="pernyataan" className="text-gray-700">
                  Dengan ini saya menyatakan bahwa seluruh informasi yang saya berikan adalah akurat, benar, dan dapat dipertanggungjawabkan secara hukum.
                </label>
              </div>
            </fieldset>

            {/* --- Tombol Kirim --- */}
            <div className="text-center pt-6">
              <button
                type="submit"
                className="w-full md:w-1/2 px-12 py-4 text-center font-semibold text-white bg-orange-500 rounded-lg shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform hover:scale-105"
              >
                KIRIM PENDAFTARAN
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default RegisterMitra;
