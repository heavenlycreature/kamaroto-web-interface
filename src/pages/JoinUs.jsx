// src/pages/JoinUs.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedElement from '../components/AnimatedElement';


// Komponen Tombol dengan efek wipe dari kiri ke kanan
const ActionButton = ({ children, to, isLink = false }) => {
    // Gunakan tag <Link> jika isLink bernilai true, jika tidak gunakan tag <a>
    const Component = isLink ? Link : 'a';
    
    return (
        <Component 
            to={to}
            href={isLink ? null : to}
            className="group relative inline-block text-center border-2 border-orange-500 overflow-hidden text-white font-bold uppercase tracking-widest"
        >
            <div className="absolute inset-0 bg-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></div>
            <span className="relative z-10 block py-3 px-8 transition-colors duration-300 text-sm">
                {children}
            </span>
        </Component>
    );
};

const JoinUs = () => {
    return (
        <div className="relative bg-[#1E1E1E]">
            <div className="absolute inset-0 z-0 bg-[url('/images/backdrop2.png')] bg-repeat-y bg-top bg-contain"></div>
            
            <div className="relative z-10">
                {/* HALAMAN 1: Hero Section */}
                <section id="hero-join" className="h-[calc(108vh-80px)] relative flex flex-col items-start justify-center text-left">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/gabimg.jpg')" }}></div>
                    <div className="absolute inset-0 bg-black/70"></div>
                    <div className="relative z-10 text-white container mx-auto px-15">
                        <AnimatedElement><h1 className="text-3xl md:text-6xl font-extrabold max-w-2xl leading-tight mb-4">
                            Bergabunglah dan jadilah bagian dari kami
                        </h1>
                        <p className="text-lg text-gray-300 max-w-2xl">Temukan peran yang paling mencerminkan semangat Anda, dan mulailah langkah baru di ekosistem otomotif yang terintegrasi.</p></AnimatedElement>
                       <AnimatedElement><div className="mt-8 flex flex-col sm:flex-row items-center justify-start gap-6">
                            {/* Tombol sekarang menggunakan tag <a> untuk scroll */}
                            <ActionButton to="#captain-section">Captain Officer</ActionButton>
                            <ActionButton to="#mitra-section">Mitra Bisnis</ActionButton>
                        </div></AnimatedElement>
                    </div>
                </section>

                {/* HALAMAN 2: Captain Section */}
                <AnimatedElement><section id="captain-section" className="py-20 md:py-24">
                     <div className="container mx-auto px-15">
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            <div className="text-white">
                                <h2 className="text-4xl md:text-5xl font-extrabold text-orange-500 mb-4">Captain Officer</h2>
                                <p className="text-gray-300 mb-4">Captain Officer memadukan profesionalisme dengan semangat muda untuk menghadirkan energi baru dalam dunia bisnis otomotif. Mereka berasal dari berbagai latar belakang berbeda mulai dari pengemudi online, staf marketing, hingga mahasiswa yang memiliki satu tujuan yang sama untuk mendorong pertumbuhan dan memperluas jaringan.</p>
                                <p className="text-gray-300">Dalam perannya, Captain Officer tidak hanya menjalankan tugas harian. Mereka berinteraksi langsung dengan mitra, membangun hubungan yang saling menguntungkan, serta membuka peluang bisnis baru di wilayahnya. Dengan fleksibilitas dan jiwa kepemimpinan, mereka menjadi jembatan antara pelanggan dan layanan berkualitas.</p>
                                <div className="mt-8">
                                    <ActionButton to="/gabung/co" isLink={true}>Selengkapnya</ActionButton>
                                </div>
                            </div>
                            {/* --- PERUBAHAN DI SINI --- */}
                            <div className="w-full max-w-lg ml-auto">
                                <img src="/images/gabcoimg.jpg" alt="Captain Officer" className="w-full h-auto object-cover border-2 border-orange-500" />
                            </div>
                        </div>
                    </div>
                </section></AnimatedElement>

                {/* HALAMAN 3: Mitra Section */}
                <AnimatedElement><section id="mitra-section" className="py-20 md:py-24">
                     <div className="container mx-auto px-15">
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            <div className="text-white md:order-2">
                                <h2 className="text-4xl md:text-5xl font-extrabold text-orange-500 mb-4">Mitra Bisnis</h2>
                                <p className="text-gray-300 mb-4">Mitra Bisnis adalah pelaku usaha yang memanfaatkan jaringan dan platform pemasaran kami untuk memasarkan produk atau jasa mereka secara lebih luas. Memiliki tujuan jelas untuk memperluas pasar, meningkatkan penjualan, dan memperkuat citra brand di mata konsumen.</p>
                                <p className="text-gray-300">Dengan bergabung sebagai mitra, Anda tidak hanya terhubung ke komunitas yang sudah terbentuk, tetapi juga mendapatkan dukungan promosi digital yang efektif serta akses ke calon pelanggan yang sudah tertarget. Semua ini dirancang untuk membantu usaha Anda tumbuh lebih cepat dan menjangkau pasar yang sebelumnya sulit diraih.</p>
                                <div className="mt-8">
                                    <ActionButton to="/gabung/mitra" isLink={true}>Selengkapnya</ActionButton>
                                </div>
                            </div>
                             {/* --- PERUBAHAN DI SINI --- */}
                            <div className="md:order-1 w-full max-w-lg mr-auto">
                                <img src="/images/gabmiimg.jpg" alt="Mitra Bisnis" className="w-full h-auto object-cover border-2 border-orange-500" />
                            </div>
                        </div>
                    </div>
                </section></AnimatedElement>
            </div>
        </div>
    );
};

export default JoinUs;