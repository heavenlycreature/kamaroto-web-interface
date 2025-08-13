// pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AnimatedElement from '../components/AnimatedElement';

const services = [
    { iconUrl: 'https://icongr.am/feather/truck.svg?size=40&color=ea580c', iconHoverUrl: 'https://icongr.am/feather/truck.svg?size=40&color=ffffff', title: 'Jual Beli Kendaraan',url: '/notfound' },
    { iconUrl: 'https://icongr.am/feather/key.svg?size=40&color=ea580c', iconHoverUrl: 'https://icongr.am/feather/key.svg?size=40&color=ffffff', title: 'Sewa Kendaraan',url: '/notfound' },
    { iconUrl: 'https://icongr.am/feather/tool.svg?size=40&color=ea580c', iconHoverUrl: 'https://icongr.am/feather/tool.svg?size=40&color=ffffff', title: 'Servis Kendaraan',url: '/notfound' },
    { iconUrl: 'https://icongr.am/material/car-wash.svg?size=40&color=ea580c', iconHoverUrl: 'https://icongr.am/material/car-wash.svg?size=40&color=ffffff', title: 'Washing Vehicle Booking',url: '/notfound' },
    { iconUrl: 'https://icongr.am/feather/settings.svg?size=40&color=ea580c', iconHoverUrl: 'https://icongr.am/feather/settings.svg?size=40&color=ffffff', title: 'Parts & Accessories',url: '/notfound' },
    { iconUrl: 'https://icongr.am/feather/shield.svg?size=40&color=ea580c', iconHoverUrl: 'https://icongr.am/feather/shield.svg?size=40&color=ffffff', title: 'Insurance Consultant',url: '/notfound' },
    { iconUrl: 'https://icongr.am/feather/dollar-sign.svg?size=40&color=ea580c', iconHoverUrl: 'https://icongr.am/feather/dollar-sign.svg?size=40&color=ffffff', title: 'Investment & Financial',url: '/notfound' },
    { iconUrl: 'https://icongr.am/feather/award.svg?size=40&color=ea580c', iconHoverUrl: 'https://icongr.am/feather/award.svg?size=40&color=ffffff', title: 'Biro Jasa & Sekolah Mengemudi',url: '/notfound' },
];

const Home = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsToShow = 4;
    const timeoutRef = useRef(null);
  
    const resetTimeout = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  
    useEffect(() => {
      resetTimeout();
      timeoutRef.current = setTimeout(
        () => setCurrentIndex(prev => prev === services.length - itemsToShow ? 0 : prev + 1),
        3000
      );
      return () => resetTimeout();
    }, [currentIndex]);
  
    const prevService = () => {
      setCurrentIndex(currentIndex === 0 ? services.length - itemsToShow : currentIndex - 1);
    };
  
    const nextService = () => {
      setCurrentIndex(currentIndex === services.length - itemsToShow ? 0 : currentIndex + 1);
    };

  return (
    // ===== PERUBAHAN UTAMA DI SINI =====
    <div className={`
      relative bg-slate-100 text-gray-800 font-sans 
      bg-[url('/images/backdrop1.png')] bg-repeat-y bg-top bg-contain
    `}>
      
      {/* Struktur z-index tetap sama untuk memastikan konten berada di atas background */}
      <div className="relative z-10" >
        
        {/* ===== Hero Fullscreen Section Start ===== */}
        <section className="relative min-h-screen bg-cover bg-center text-white" style={{ backgroundImage: "url('/images/homeimg.jpg')" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
          <div className="relative container mx-auto px-15 h-full flex flex-col justify-left items-start text-left pt-24 md:pt-48">
            <AnimatedElement triggerOnce={false}>
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">KamarOTO</h2>
            <p className="text-lg md:text-4xl max-w-2xl mb-4 text-gray-200">Solusi otomotif terpadu untuk</p>
            <p className="text-lg md:text-4xl max-w-2xl mb-8 text-gray-200">segala kebutuhan kendaraan Anda.</p></AnimatedElement>
          </div>
        </section>

        <main className="container mx-auto px-6 py-24"> {/* Sedikit mengurangi padding horizontal */}
    {/* ===== Services Section (Auto-Play Carousel) ===== */}
    <section className="text-center" onMouseEnter={resetTimeout} onMouseLeave={() => {
        timeoutRef.current = setTimeout(() => setCurrentIndex(prev => prev === services.length - itemsToShow ? 0 : prev + 1), 3000);
    }}>
        <AnimatedElement>
            <h3 className="text-3xl md:text-4xl font-bold text-black mb-4">
                8 Pilar Layanan <span className="text-orange-500">KamarOTO</span>
            </h3>
            <p className="text-lg text-black max-w-3xl mx-auto mb-12">Kami menyediakan layanan terintegrasi untuk memastikan pengalaman terbaik bagi Anda.</p>
        </AnimatedElement>

        {/* --- PERUBAHAN UTAMA DI SINI --- */}
        {/* 1. Tambahkan div pembungkus dengan max-w-* dan mx-auto */}
        <div className="max-w-6xl mx-auto">
            <div className="relative flex items-center justify-center">
                <button onClick={prevService} className="absolute -left-4 md:-left-8 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all z-10 border border-gray-200">
                    <img src="https://icongr.am/feather/chevron-left.svg?size=24&color=6b7280" alt="Previous" />
                </button>
                <div className="w-full overflow-hidden">
                    <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}>
                        {services.map((service, index) => (
                            // 2. Tambahkan breakpoint baru untuk tampilan di layar terkecil
                            <div key={index} className="flex-shrink-0 w-1/2 sm:w-1/2 md:w-1/4 p-2 sm:p-3">
                                <Link to={service.url}>
                <div className="group bg-gray-50 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center aspect-square border border-gray-200 hover:bg-orange-500 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
                    <div className="mb-4 h-10 w-10 sm:h-12 sm:w-12 relative">
                        <img src={service.iconUrl.replace('size=40', 'size=32')} alt="icon" className="absolute inset-0 w-full h-full opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                        <img src={service.iconHoverUrl.replace('size=40', 'size=32')} alt="icon-hover" className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h3 className="text-sm sm:text-base text-center font-bold text-gray-900 group-hover:text-white transition-colors duration-300">{service.title}</h3>
                </div>
            </Link>
                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={nextService} className="absolute -right-4 md:-right-8 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all z-10 border border-gray-200">
                    <img src="https://icongr.am/feather/chevron-right.svg?size=24&color=6b7280" alt="Next" />
                </button>
            </div>
        </div>
    </section>
</main>
        
        {/* ===== Full-Width Overlay Section ===== */}
        <section className="w-full bg-[#1E1E1E] py-24 px-15 grid md:grid-cols-2 gap-12 items-center">
          <AnimatedElement><div className="text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-bold text-orange-500 mb-4">Jangkauan Nasional</h3>
            <p className="text-lg text-white mb-8">Kami hadir di seluruh penjuru Indonesia, siap melayani di mana pun Anda berada.</p>
            <div className="flex justify-center md:justify-start gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-500">423</p>
                <p className="text-base text-white">Mitra Terdaftar</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-500">123</p>
                <p className="text-base text-white">Captain Bergabung</p>
              </div>
            </div>
          </div></AnimatedElement>
          <div className="relative w-full max-w-xl mx-auto p-4">
            <img src="https://icongr.am/feather/map.svg?size=256&color=3b82f6" alt="Map Icon" className="w-full h-auto opacity-80" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-500/20 rounded-full animate-ping"></div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;