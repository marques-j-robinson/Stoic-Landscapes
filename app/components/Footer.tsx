'use client';
import { FaFacebook, FaInstagram, FaEtsy } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="sticky bottom-0 z-40 w-full bg-gray-950 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-slate-100 tracking-tight">Stoic Landscapes</span>
        </Link>
        
        {/* Social Media Icons */}
        <div className="flex space-x-4">
          <Link href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <FaFacebook />
          </Link>
          <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <FaInstagram />
          </Link>
          <Link href="https://www.etsy.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <FaEtsy />
          </Link>
        </div>

      </div>

        {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-center">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Stoic Landscapes. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
