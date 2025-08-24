import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedElement from '../components/AnimatedElement';

// Komponen ikon sederhana untuk tombol kembali
const BackArrowIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 8 8 12 12 16"></polyline>
        <line x1="16" y1="12" x2="8" y2="12"></line>
    </svg>
);

const GabCo = () => {
    // PERUBAHAN 1: Menambahkan komponen Button dengan efek wipe
    const Button = ({ children, to }) => (
        <Link 
          to={to} 
          className="group relative inline-block text-center border-2 border-orange-500 overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-orange-500 transform -translate-x-full 
                       group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"
          ></div>
          <span className="relative z-10 block font-bold uppercase tracking-widest py-4 px-12 transition-colors duration-300">
            {children}
          </span>
        </Link>
      );

    return (
        // Wrapper utama dengan latar belakang gelap dan backdrop
        <div className="relative bg-[#1E1E1E] text-white font-sans">
            <div 
                className="absolute inset-0 z-0 bg-[url('/images/backdrop2.png')] bg-repeat-y bg-top bg-contain"
            ></div>

            {/* Konten utama di lapisan atas */}
            <div className="relative z-10">
                {/* Section utama */}
                <section className="relative py-12">
                    <div className="container mx-auto px-15">
                        {/* Layout 2 kolom */}
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            
                            {/* Kolom Kiri: Konten Teks */}
                            <div>
                                {/* ... Konten lainnya tetap sama ... */}
                                <Link to="/gabung" className="group inline-flex items-center gap-3 mb-8">
                                    <BackArrowIcon className="text-white group-hover:text-orange-500 transition-colors duration-300" />
                                    <span className="text-xl font-semibold text-white group-hover:text-orange-500 transition-colors duration-300">
                                        Kembali
                                    </span>
                                </Link>

                                <AnimatedElement><h1 className="text-4xl md:text-5xl font-extrabold text-orange-500 mb-4 leading-tight">
                                    Captain Officer
                                </h1>
                                <p className="text-lg text-gray-300 mb-8">
                                    Target Captain Officer adalah pengemudi online, staf marketing, dan mahasiswa berkriteria.
                                </p>

                                <h2 className="font-bold text-xl text-white mb-4">Syarat keanggotaan:</h2>
                                <ol className="list-decimal list-inside space-y-1.5 text-gray-300 mb-8">
                                    {/* ... list persyaratan Anda ... */}
                                    <li>Minimal 17 tahun</li>
                                    <li>Memiliki KTP</li>
                                    <li>Jujur</li>
                                    <li>Menyukai profesi lapangan</li>
                                    <li>Mematuhi Peraturan yang ditetapkan dari KamarOTO</li>
                                </ol>

                                <h2 className="font-bold text-xl text-white mb-4">Job Objective:</h2>
                                <ol className="list-decimal list-inside space-y-1.5 text-gray-300 mb-8">
                                    {/* ... list persyaratan Anda ... */}
                                    <li>Sales Transaksi Mitra Kerja Min 50jt/ bulan dari 7 Mitra Kerja (bobot 50%) & Min 250jt/bln dari 1 Mitra Kerja Showroom</li>
                                    <li>Aktifasi Mitra Kerja Min 75% dari yang sudah di PKS kan (bobot 25%)</li>
                                    <li>Training Pembekalan Diri (bobot 25%)</li>
                                </ol>

                                <h2 className="font-bold text-xl text-white mb-4">Job Description:</h2>
                                <ol className="list-decimal list-inside space-y-1.5 text-gray-300 mb-8">
                                    {/* ... list persyaratan Anda ... */}
                                    <li>Membuka hubungan kerjasama dengan 8 Mitra Kerja KamarOTO secara online</li>
                                    <li>Melakukan Upload di sistem KamarOTO atas produk2x yang dijual oleh Mitra Kerja KamarOTO</li>
                                    <li>Memberikan Laporan tertulis secara online terhadap kondisi bisnis di lapangan secara periodik</li>
                                    <li>Menghadiri undangan training pembekalan diri baik secara online maupun offline</li>
                                </ol>

                                <h2 className="font-bold text-xl text-white mb-4">Keuntungan:</h2>
                                <ol className="list-decimal list-inside space-y-1.5 text-gray-300 mb-8">
                                    {/* ... list persyaratan Anda ... */}
                                    <li>Mendapatkan Insentif atas produktiftas yang ditetapkan secara berkesinambungan</li>
                                    <li>Profesi Paruh Waktu (tidak terikat dengan jam kerja)</li>
                                    <li>Mendapatkan Training Pengembangan Diri secara gratis</li>
                                    <li>Mendapatkan Tunjangan Asuransi Jiwa dan Kesehatan</li>
                                    <li>Mendapatkan Hak Eksklusif Profesi di radius teritorinya</li>
                                    <li>Mendapatkan satu unit motor listrik </li>
                                </ol>
                                </AnimatedElement>
                                
                                {/* PERUBAHAN 2: Menempatkan tombol "DAFTAR SEKARANG" di sini */}
                                <AnimatedElement><div className="mt-10">
                                    <Button to="/register/captain">
                                        Daftar Sekarang
                                    </Button>
                                </div></AnimatedElement>
                            </div>

                            {/* Kolom Kanan: Gambar */}
                            <div className="w-full self-start">
                                <AnimatedElement><div className="aspect-square w-full max-w-lg ml-auto">
                                    <img 
                                        src="/images/gabcoimg.jpg"
                                        alt="Captain Officer" 
                                        className="w-full h-full object-cover border-2 border-orange-500"
                                    />
                                </div></AnimatedElement>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default GabCo;