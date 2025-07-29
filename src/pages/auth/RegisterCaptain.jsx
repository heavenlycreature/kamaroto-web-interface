// pages/auth/RegisterCaptain.jsx
// Halaman formulir pendaftaran untuk Captain dengan desain yang lebih profesional dan modern.

import React from 'react';
import { Link } from 'react-router-dom';

const RegisterCaptain = () => {

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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Formulir Pendaftaran Captain</h1>
            <p className="text-gray-600 mt-2">Lengkapi data di bawah ini untuk menjadi bagian dari KamarOTO.</p>
          </div>

          <form className="space-y-10">
            {/* --- Data Diri --- */}
            <fieldset className="space-y-6 border-t-4 border-orange-500 pt-6">
              <legend className="text-2xl font-semibold text-gray-800 px-4 -ml-4">Data Diri</legend>
              <InputField icon="https://icongr.am/feather/user.svg?size=20&color=9ca3af" label="Nama Lengkap" id="namaLengkap" placeholder="Masukkan nama lengkap Anda" />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tempat & Tanggal Lahir</label>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-2">
                    <input type="text" placeholder="Tempat Lahir" className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" />
                  </div>
                  <input type="text" placeholder="Tgl" className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" />
                  <input type="text" placeholder="Bln" className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" />
                  <input type="text" placeholder="Thn" className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="jenisKelamin" className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" /><span>Laki-laki</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="jenisKelamin" className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" /><span>Perempuan</span></label>
                </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Domisili</label>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField id="provinsi"><option>Pilih Provinsi</option></SelectField>
                    <SelectField id="kabupaten"><option>Pilih Kabupaten / Kota</option></SelectField>
                    <SelectField id="kecamatan"><option>Pilih Kecamatan</option></SelectField>
                    <SelectField id="kelurahan"><option>Pilih Kelurahan / Desa</option></SelectField>
                 </div>
                 <textarea placeholder="Detail alamat: Nama Jalan, RT/RW, Gedung/No. Rumah" className="mt-4 block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" rows="3"></textarea>
              </div>

              <InputField icon="https://icongr.am/feather/smartphone.svg?size=20&color=9ca3af" label="Nomor HP / WA" id="nomorHp" placeholder="081234567890" />
              <InputField icon="https://icongr.am/feather/briefcase.svg?size=20&color=9ca3af" label="Jenis Pekerjaan" id="pekerjaan" placeholder="Contoh: Karyawan Swasta" />
              <InputField icon="https://icongr.am/feather/mail.svg?size=20&color=9ca3af" label="Email Aktif" id="email" type="email" placeholder="email@contoh.com" />
              <InputField icon="https://icongr.am/feather/heart.svg?size=20&color=9ca3af" label="Status Pernikahan" id="statusPernikahan" placeholder="Belum Menikah / Menikah" />
              <InputField icon="https://icongr.am/feather/award.svg?size=20&color=9ca3af" label="Pendidikan Terakhir" id="pendidikan" placeholder="SMA / S1 / Dll" />
            </fieldset>

            {/* --- Unggah Foto --- */}
            <fieldset className="space-y-4 border-t-4 border-orange-500 pt-6">
              <legend className="text-2xl font-semibold text-gray-800 px-4 -ml-4">Dokumen & Foto</legend>
              <label className="block text-sm font-medium text-gray-700">Foto Selfie di Depan Rumah</label>
              <div className="mt-2 flex justify-center items-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="text-center">
                  <img src="https://icongr.am/feather/upload-cloud.svg?size=48&color=9ca3af" alt="Upload Icon" className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Klik untuk mengunggah foto</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 10MB</p>
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

export default RegisterCaptain;
