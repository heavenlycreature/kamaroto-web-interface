// pages/Home.jsx
// Bagian layanan telah diperbarui menjadi carousel dengan tombol dan fitur auto-play.

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Data untuk kartu layanan
const services = [
  { 
    iconUrl: 'https://icongr.am/feather/truck.svg?size=40&color=ea580c', 
    iconHoverUrl: 'https://icongr.am/feather/truck.svg?size=40&color=ffffff', 
    title: 'Jual Beli Kendaraan' 
  },
  { 
    iconUrl: 'https://icongr.am/feather/key.svg?size=40&color=ea580c', 
    iconHoverUrl: 'https://icongr.am/feather/key.svg?size=40&color=ffffff', 
    title: 'Sewa Kendaraan' 
  },
  { 
    iconUrl: 'https://icongr.am/feather/tool.svg?size=40&color=ea580c', 
    iconHoverUrl: 'https://icongr.am/feather/tool.svg?size=40&color=ffffff', 
    title: 'Servis Kendaraan' 
  },
  { 
    iconUrl: 'https://icongr.am/material/car-wash.svg?size=40&color=ea580c', 
    iconHoverUrl: 'https://icongr.am/material/car-wash.svg?size=40&color=ffffff', 
    title: 'Washing Vehicle Booking' 
  },
  { 
    iconUrl: 'https://icongr.am/feather/settings.svg?size=40&color=ea580c', 
    iconHoverUrl: 'https://icongr.am/feather/settings.svg?size=40&color=ffffff', 
    title: 'Parts & Accessories' 
  },
  { 
    iconUrl: 'https://icongr.am/feather/shield.svg?size=40&color=ea580c', 
    iconHoverUrl: 'https://icongr.am/feather/shield.svg?size=40&color=ffffff', 
    title: 'Insurance Consultant' 
  },
  { 
    iconUrl: 'https://icongr.am/feather/dollar-sign.svg?size=40&color=ea580c', 
    iconHoverUrl: 'https://icongr.am/feather/dollar-sign.svg?size=40&color=ffffff', 
    title: 'Investment & Financial' 
  },
  { 
    iconUrl: 'https://icongr.am/feather/award.svg?size=40&color=ea580c', 
    iconHoverUrl: 'https://icongr.am/feather/award.svg?size=40&color=ffffff', 
    title: 'Biro Jasa & Sekolah Mengemudi' 
  },
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 4; // Jumlah item yang ditampilkan sekaligus di desktop
  const timeoutRef = useRef(null);

  // Fungsi untuk mereset timeout auto-scroll
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  // useEffect untuk auto-scroll
  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === services.length - itemsToShow ? 0 : prevIndex + 1
        ),
      3000 // Ganti slide setiap 3 detik
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex]);

  const prevService = () => {
    const newIndex = currentIndex === 0 ? services.length - itemsToShow : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextService = () => {
    const newIndex = currentIndex === services.length - itemsToShow ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* ===== Hero Section Start ===== */}
      <section className="relative h-[60vh] bg-cover bg-center text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
        <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">Solusi Otomotif Terlengkap</h2>
          <p className="text-lg md:text-xl max-w-2xl mb-8 text-gray-200">Dari jual beli hingga perawatan, temukan semua kebutuhan kendaraan Anda di satu tempat.</p>
        </div>
      </section>

      <main className="container mx-auto px-6 py-16 md:py-24">
        {/* ===== Services Section Start (Auto-Play Carousel) ===== */}
        <section 
          className="text-center"
          onMouseEnter={() => resetTimeout()}
          onMouseLeave={() => {
            timeoutRef.current = setTimeout(
              () => setCurrentIndex((prevIndex) => prevIndex === services.length - itemsToShow ? 0 : prevIndex + 1),
              3000
            );
          }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">8 Pilar Layanan KamarOTO</h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">Kami menyediakan layanan terintegrasi untuk memastikan pengalaman terbaik bagi Anda.</p>

          <div className="relative flex items-center justify-center">
            <button onClick={prevService} className="absolute -left-4 md:-left-6 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all z-10 border border-gray-200">
              <img src="https://icongr.am/feather/chevron-left.svg?size=24&color=6b7280" alt="Previous" />
            </button>

            <div className="w-full overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}>
                {services.map((service, index) => (
                  <div key={index} className="flex-shrink-0 w-1/2 md:w-1/4 p-3">
                    <div className="group bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center aspect-square border border-gray-200 hover:bg-orange-500 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                      <div className="flex-shrink-0 mb-4 h-12 w-12 relative">
                        <img src={service.iconUrl} alt="Service Icon" className="w-12 h-12 absolute inset-0 block group-hover:opacity-0 opacity-100 transition-opacity duration-300" />
                        <img src={service.iconHoverUrl} alt="Service Icon Hover" className="w-12 h-12 absolute inset-0 hidden group-hover:block group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-white transition-colors duration-300">{service.title}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={nextService} className="absolute -right-4 md:-right-6 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all z-10 border border-gray-200">
              <img src="https://icongr.am/feather/chevron-right.svg?size=24&color=6b7280" alt="Next" />
            </button>
          </div>
        </section>

        {/* ===== CTA Section Start ===== */}
        <section className="text-center mt-24 bg-orange-500/10 p-12 rounded-2xl">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Siap Bergabung dengan Komunitas Kami?</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Jadilah mitra atau kapten kami dan nikmati berbagai keuntungan eksklusif.</p>
          <Link to="/register">
            <button className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
              Daftar Sekarang
            </button>
          </Link>
        </section>

        {/* ===== Map and Stats Section Start ===== */}
        <section className="mt-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Jangkauan Nasional</h3>
            <p className="text-lg text-gray-600 mb-8">Kami hadir di seluruh penjuru Indonesia, siap melayani di mana pun Anda berada.</p>
            <div className="flex justify-center md:justify-start gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-600">423</p>
                <p className="text-base text-gray-500">Mitra Terdaftar</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-600">123</p>
                <p className="text-base text-gray-500">Captain Bergabung</p>
              </div>
            </div>
          </div>
          <div className="relative w-full max-w-xl mx-auto p-4">
            <img src="https://icongr.am/feather/map.svg?size=256&color=3b82f6" alt="Map Icon" className="w-full h-auto opacity-80" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-500/20 rounded-full animate-ping"></div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home;
