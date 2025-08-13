// src/pages/About.jsx

import React from 'react';
import AnimatedElement from '../components/AnimatedElement';


// Data untuk bagian "Kenapa KamarOTO" (dari kode Anda)
const features = [
    {
        icon: "https://icongr.am/feather/target.svg?size=50&color=f97b02",
        iconWhiteUrl: "https://icongr.am/feather/target.svg?size=50&color=ffffff", // Versi putih
        title: "Layanan Cepat & Terintegrasi",
        description: "Semua kebutuhan otomotif Anda, dari servis hingga aksesori, terhubung dalam satu aplikasi."
    },
    {
        icon: "https://icongr.am/feather/map-pin.svg?size=50&color=f97b02",
        iconWhiteUrl: "https://icongr.am/feather/map-pin.svg?size=50&color=ffffff", // Versi putih
        title: "Jangkauan Hiperlokal",
        description: "Kami hadir di setiap radius 5KM, memastikan layanan kami selalu dekat dengan Anda."
    },
    {
        icon: "https://icongr.am/fontawesome/handshake-o.svg?size=50&color=f97b02",
        iconWhiteUrl: "https://icongr.am/fontawesome/handshake-o.svg?size=50&color=ffffff", // Versi putih
        title: "Platform Terpercaya",
        description: "Menghubungkan Anda dengan mitra dan UMKM otomotif lokal yang telah terverifikasi."
    }
];

// Data untuk nilai-nilai perusahaan (Credo) (dari kode Anda)
const credoItems = ['Passion', 'Commitment', 'Fast', 'Easy', 'Lifestyle'];

// Placeholder data untuk jajaran direksi
const direksi = Array(8).fill(null);

const About = () => {
    return (
        // STRUKTUR UTAMA: Latar belakang gelap dengan pola backdrop
        <div className="relative bg-[#1E1E1E] text-white font-sans">
            <div
                className="absolute inset-0 z-0 bg-[url('/images/backdrop2.png')] bg-repeat-y bg-top bg-contain"
            ></div>

            {/* Konten utama di lapisan atas */}
            <div className="relative z-10">


                {/* ===== Hero Fullscreen Section Start ===== */}
                <section className="relative min-h-screen bg-cover bg-center text-white" style={{ backgroundImage: "url('/images/aboutimg.jpg')" }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
                    <div className="relative container mx-auto px-15 h-full flex flex-col justify-left items-start text-left pt-24 md:pt-48">
                        <AnimatedElement><h2 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">All in one platform otomotif</h2>
                        <p className="text-lg text-white mt-4">
                            KamarOTO adalah platform digital otomotif yang mengintegrasikan berbagai<br />
                            kebutuhan dan layanan pengguna kendaraan dalam satu aplikasi.<br />
                            Kami hadir untuk menjadi solusi utama ekosistem otomotif di Indonesia,<br />
                            di setiap radius 5KM dengan menyediakan layanan dan kebutuhan <br />
                            konsumsi pelanggan tanpa hambatan jarak dan waktu.
                        </p></AnimatedElement>
                    </div>
                </section>

                {/* ===== Kenapa KamarOTO Section ===== */}
                <section className="container mx-auto px-15 py-20 md:py-24">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <AnimatedElement><h2 className="text-3xl md:text-4xl font-bold text-white">Kenapa <span className="text-orange-500">KamarOTO?</span></h2></AnimatedElement>
                    </div>
                    <AnimatedElement><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            // PERUBAHAN 1: Wadah utama kartu sekarang menjadi 'relative' dan 'overflow-hidden'
                            <div
                                key={index}
                                className="group relative bg-transparent p-6 rounded-2xl border-2 border-orange-500 
                           transition-all duration-300 ease-in-out overflow-hidden"
                            >
                                {/* PERUBAHAN 2: Layer oranye tersembunyi untuk animasi wipe */}
                                <div
                                    className="absolute inset-0 bg-orange-500 transform -translate-x-full 
                               group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"
                                ></div>

                                {/* PERUBAHAN 3: Semua konten dibungkus agar berada di atas layer animasi */}
                                <div className="relative z-10 flex items-start space-x-5">
                                    <div className="flex-shrink-0 mt-1 relative w-8 h-8">
                                        {/* Ikon default (oranye), hilang saat hover */}
                                        <img
                                            src={feature.icon}
                                            alt="Feature Icon"
                                            className="w-full h-full absolute transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                                        />
                                        {/* Ikon hover (putih), muncul saat hover */}
                                        <img
                                            src={feature.iconWhiteUrl}
                                            alt="Feature Icon Hover"
                                            className="w-full h-full absolute transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">{feature.title}</h3>
                                        <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div></AnimatedElement>
                </section>

                {/* ===== Our Credo Section (Kembali ke Bawah) ===== */}
                <section className="container mx-auto px-20 pb-20 md:pb-24">
                    <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                        <div>
                            <AnimatedElement><h2 className="text-5xl md:text-8xl font-extrabold text-orange-500 leading-tight">
                                Our<br />Credo
                            </h2></AnimatedElement>
                        </div>
                        <div className="flex items-center">
                            <div className="w-1.5 h-60 bg-orange-500 mr-8 md:mr-12 shrink-0"></div>
                            <div>
                                {credoItems.map(item => (
                                    <AnimatedElement><p
                                        key={item}
                                        className="text-3xl md:text-4xl font-bold text-white mt-2 
                                       hover:text-orange-500 hover:scale-105 
                                       transition-all duration-300 ease-in-out">
                                        {item}
                                    </p></AnimatedElement>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== 4. Visi Misi Section (Full-width, Sesuai Referensi) ===== */}
                <section className="relative w-full left-1/2 -translate-x-1/2 min-h-[70vh] py-20 flex flex-col justify-center items-center text-center">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-fixed"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop')" }}
                    ></div>
                    <div className="absolute inset-0 bg-black/80"></div>
                    <AnimatedElement><div className="relative container mx-auto px-6 z-10">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-orange-500">VISI</h2>
                        <p className="mt-4 text-xl md:text-2xl max-w-4xl mx-auto text-gray-200 italic">
                            "Menjadi pusat ekosistem digital otomotif terlengkap dan terpercaya di Indonesia."
                        </p>
                        <h2 className="mt-12 text-4xl md:text-5xl font-extrabold text-orange-500">MISI</h2>
                        <ul className="mt-6 text-lg md:text-xl max-w-4xl mx-auto text-gray-200 space-y-3">
                            <li className="flex items-start justify-center"><span className="text-orange-500 mr-3 mt-1">&#10003;</span><span>Mendigitalkan UMKM dan pelaku industri otomotif lokal.</span></li>
                            <li className="flex items-start justify-center"><span className="text-orange-500 mr-3 mt-1">&#10003;</span><span>Menyediakan platform yang aman dan mudah diakses.</span></li>
                            <li className="flex items-start justify-center"><span className="text-orange-500 mr-3 mt-1">&#10003;</span><span>Memberikan pengalaman terbaik bagi mitra dan pengguna.</span></li>
                        </ul>
                    </div></AnimatedElement>
                </section>

                {/* ===== 5. Direksi Section (Sesuai Referensi) ===== */}
                <section className="container mx-auto px-6 py-20 md:py-28">
                    <AnimatedElement><h2 className="text-4xl md:text-5xl font-bold text-white text-center">Direksi</h2></AnimatedElement>

                    {/* PERUBAHAN 1: Menambahkan div pembungkus untuk membatasi lebar grid, membuat foto lebih kecil */}
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8 mt-12">
                            {direksi.map((_, index) => (
                                // PERUBAHAN 2: Menambahkan 'group' untuk mengaktifkan hover pada elemen anak
                                <AnimatedElement><div key={index} className="text-center group">

                                    {/* FOTO PLACEHOLDER: Diberi border transparan & efek hover */}
                                    <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center 
                                   border-2 border-transparent group-hover:border-orange-500 
                                   transition-all duration-300">
                                        <svg
                                            className="w-12 h-12 text-gray-600 group-hover:text-orange-500/80 transition-colors duration-300"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>

                                    {/* NAMA DIREKSI: Diberi efek hover dari group */}
                                    <h3 className="mt-4 font-bold text-lg text-white group-hover:text-orange-500 transition-colors duration-300">
                                        Nama Direksi
                                    </h3>

                                    <p className="text-sm text-gray-400">Jabatan</p>
                                </div></AnimatedElement>
                            ))}
                        </div>
                    </div>
                </section>


            </div>
        </div>
    );
};

export default About;