import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/kamaroto1.png';

const Navbar = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/">
          <img src={logo} alt="KamarOTO Logo" className="h-10 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-600 hover:text-orange-600 transition-colors duration-300">Home</Link>
          <Link to="/about" className="text-gray-600 hover:text-orange-600 transition-colors duration-300">About Us</Link>
        </nav>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <img src="https://icongr.am/feather/user.svg?size=24&color=6b7280" alt="User Icon" className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
