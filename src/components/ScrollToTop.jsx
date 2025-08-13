// src/components/ScrollToTop.jsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Mengambil `pathname` (misal: "/about", "/join-us") dari URL saat ini
  const { pathname } = useLocation();

  // Menjalankan efek setiap kali `pathname` berubah
  useEffect(() => {
    // Perintah untuk scroll window ke posisi paling atas (0, 0)
    window.scrollTo(0, 0);
  }, [pathname]); // <-- Kunci: Efek ini berjalan setiap kali path URL berubah

  return null; // Komponen ini tidak merender elemen visual apapun
};

export default ScrollToTop;