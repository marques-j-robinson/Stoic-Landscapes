'use client';
import Link from 'next/link';
import { navItems } from '@/config/navigation';
import MobileMenu from './MobileMenu';

export default function Footer() {
  return (
    <footer className="sticky bottom-0 z-40 w-full bg-white/80 backdrop-blur-md border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-gray-900 tracking-tight">Stoic Landscapes</span>
        </Link>

        {/* Desktop Navigation, do not show "Home" link in desktop view */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.filter(item => item.label!=='Home').map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation Menu Toggle */}
        <MobileMenu items={navItems} />

      </div>
    </footer>
  );
}
