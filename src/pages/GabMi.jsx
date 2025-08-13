
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

const GabMi = () => {
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
                {/* Section utama dengan tinggi custom sesuai permintaan */}
                <section className="relative py-12">
                    <div className="container mx-auto px-15">
                        {/* Layout 2 kolom */}
                        <div className="grid md:grid-cols-2 gap-12 items-start">

                            {/* Kolom Kiri: Konten Teks */}
                            <div>
                                {/* Tombol Kembali Interaktif */}
                                <Link to="/gabung" className="group inline-flex items-center gap-3 mb-8">
                                    <BackArrowIcon className="text-white group-hover:text-orange-500 transition-colors duration-300" />
                                    <span className="text-xl font-semibold text-white group-hover:text-orange-500 transition-colors duration-300">
                                        Kembali
                                    </span>
                                </Link>

                                <AnimatedElement><h1 className="text-4xl md:text-5xl font-extrabold text-orange-500 mb-4 leading-tight">
                                    Mitra Bisnis
                                </h1>
                                    <p className="text-lg text-gray-300 mb-8">
                                        Kami membuka peluang bagi Anda, pelaku usaha otomotif, untuk memperluas pasar, meningkatkan penjualan, dan memperkuat reputasi melalui kemitraan strategis.
                                    </p>

                                    <h2 className="font-bold text-xl text-white mb-4">8 Segmen Mitra Bisnis KamarOTO:</h2>
                                    <ol className="list-decimal list-inside space-y-1.5 text-gray-300 mb-8">
                                        <li>Jual Beli Kendaraan (mobil/motor)</li>
                                        <li>Jual Beli Part dan Aksesoris Kendaraan</li>
                                        <li>Jasa Service Kendaraan</li>
                                        <li>Jasa Cuci Kendaraan</li>
                                        <li>Jasa Sewa Kendaraan</li>
                                        <li>Insurance Consultant</li>
                                        <li>Fasilitas Pembiayaan</li>
                                        <li>Biro Jasa dan Sekolah Mengemudi</li>
                                    </ol> 

                                    <h2 className="font-bold text-xl text-white mb-4">Syarat Keanggotaan:</h2>
                                    <ol className="list-decimal list-inside space-y-1.5 text-gray-300 mb-8">
                                        <li>Memiliki usaha aktif di salah satu dari 8 segmen di atas</li>
                                        <li>Memiliki legalitas usaha (izin usaha atau bukti kepemilikan)</li>
                                        <li>Memiliki produk atau jasa berkualitas dan layak jual</li>
                                        <li>Bersedia mematuhi ketentuan kerjasama yang berlaku</li>
                                        <li>Siap mengikuti proses onboarding & verifikasi data</li>
                                    </ol>

                                    <h2 className="font-bold text-xl text-white mb-4">Keuntungan:</h2>
                                    <ol className="list-decimal list-inside space-y-1.5 text-gray-300 mb-8">
                                        <li>Pasar Lebih Luas - Produk/jasa Anda akan dipromosikan ke ribuan calon pelanggan potensial.</li>
                                        <li>Brand Awareness - Bisnis Anda lebih dikenal melalui platform online dan jaringan kami.</li>
                                        <li>Kemudahan Transaksi - Sistem yang memudahkan calon pelanggan menghubungi atau memesan layanan Anda.</li>
                                        <li>Support Marketing - Dukungan materi promosi & kampanye digital.</li>
                                        <li>Jaringan Kolaborasi - Terhubung dengan pelaku usaha otomotif lain di ekosistem KamarOTO.</li>
                                    </ol>
                                    </AnimatedElement>
                                {/* PERUBAHAN 2: Menempatkan tombol "DAFTAR SEKARANG" di sini */}
                                <AnimatedElement><div className="mt-10">
                                    <Button to="/register/mitra">
                                        Daftar Sekarang
                                    </Button>
                                </div></AnimatedElement>
                            </div>

                            {/* Kolom Kanan: Gambar */}
                            <div className="w-full self-start">
                                <AnimatedElement><div className="aspect-square w-full max-w-lg ml-auto">
                                    <img
                                        src="/images/gabmiimg.jpg"
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

export default GabMi;