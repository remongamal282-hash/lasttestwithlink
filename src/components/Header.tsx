import Link from 'next/link';
import logo from '../assets/logo.png';
import { ExternalLink, Home } from 'lucide-react';

export const Header = () => {
    return (
        <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <img src={logo.src} alt="شركة مياه الشرب والصرف الصحى بأسيوط" className="h-12 w-auto object-contain transition-transform group-hover:scale-105" />
                </Link>

                <div className="flex items-center gap-4">
                    <Link href="/" className="hidden md:flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium transition-colors">
                        <Home size={18} />
                        <span>الرئيسية</span>
                    </Link>
                    <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
                    <a
                        href="https://ascww.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary-700 hover:text-primary-800 font-bold transition-colors bg-primary-50 px-4 py-2 rounded-full hover:bg-primary-100"
                    >
                        <span>الموقع الرسمي</span>
                        <ExternalLink size={18} />
                    </a>
                </div>
            </div>
        </header>
    );
};
