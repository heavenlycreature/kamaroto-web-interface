import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white border-t-4 border-orange-500">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">KamarOTO</h4>
            <p className="text-gray-400">Solusi otomotif terpadu untuk segala kebutuhan kendaraan Anda.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Hubungi Kami</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2 hover:text-white transition-colors">
                <img src="https://icongr.am/feather/phone.svg?size=20&color=currentColor" alt="Phone" />
                <span>0812-3456-7890</span>
              </li>
              <li className="flex items-center space-x-2 hover:text-white transition-colors">
                <img src="https://icongr.am/feather/mail.svg?size=20&color=currentColor" alt="Mail" />
                <span>kontak@kamaroto.com</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Tautan</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} KamarOTO. Semua Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
