'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar, ArrowLeft, Loader2, Share2, Facebook, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNewsDetails, IMAGE_BASE_URL } from '@/api/news';
import type { NewsItem, NewsImage } from '@/types/news';
import logo from '@/assets/logo.png';

interface NewsDetailsClientProps {
    id: string;
    initialData?: NewsItem | null;
}

export default function NewsDetailsClient({ id, initialData }: NewsDetailsClientProps) {
    const [news, setNews] = useState<NewsItem | null>(initialData || null);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState<string | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        if (!initialData && id) {
            setLoading(true);
            getNewsDetails(id)
                .then(data => {
                    if (data) {
                        setNews(data);
                        setActiveImageIndex(0);
                    } else {
                        setError('الخبر غير موجود');
                    }
                })
                .catch((err: Error) => {
                    console.error(err);
                    setError('حدث خطأ أثناء تحميل الخبر');
                })
                .finally(() => setLoading(false));
        }
    }, [id, initialData]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="animate-spin text-primary-600" size={40} />
        </div>
    );

    if (error || !news) return (
        <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error || 'الخبر غير موجود'}</p>
            <Link href="/" className="text-primary-600 underline">العودة للرئيسية</Link>
        </div>
    );

    // Collect images
    const images = news.news_images?.map((img: NewsImage) => img.path) || [];
    const allImages = images.length > 0 ? images : [];

    const currentImageUrl = allImages.length > 0
        ? `${IMAGE_BASE_URL}${allImages[activeImageIndex]}`
        : logo.src;

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = encodeURIComponent(`${news.title}\n\n${(news.description || '').replace(/<[^>]+>/g, '').substring(0, 160)}`);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors">
                <ArrowLeft size={20} className="rtl:rotate-180" />
                <span>العودة للأخبار</span>
            </Link>

            <header className="space-y-4">
                <div className="flex items-center gap-2 text-primary-600 text-sm font-medium">
                    <Calendar size={16} />
                    <time>{news.created_at && format(new Date(news.created_at), 'EEEE, dd MMMM yyyy', { locale: ar })}</time>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                    {news.title}
                </h1>
            </header>

            {/* Image Gallery / Slider */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-2 group">
                    <AnimatePresence mode='wait'>
                        <motion.img
                            key={currentImageUrl}
                            src={currentImageUrl}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            alt={news.title}
                            className="w-full h-full object-contain md:object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = logo.src;
                            }}
                        />
                    </AnimatePresence>

                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={() => setActiveImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                            >
                                <ChevronLeft className="rtl:rotate-180" size={24} />
                            </button>
                            <button
                                onClick={() => setActiveImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronRight className="rtl:rotate-180" size={24} />
                            </button>
                        </>
                    )}
                </div>

                {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
                        {allImages.map((img: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImageIndex(idx)}
                                className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-primary-500 ring-2 ring-primary-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <img src={`${IMAGE_BASE_URL}${img}`} className="w-full h-full object-cover" loading="lazy" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-[1fr_250px] gap-8">
                <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed font-sans"
                    dangerouslySetInnerHTML={{
                        __html: news.description
                            .replace(/لمزيد من التفاصيل :|لمزيد من التفاصيل/g, '')
                    }} />

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Share2 size={18} />
                            مشاركة الخبر
                        </h3>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#1877F2] text-white rounded-lg hover:bg-[#166fe5] transition-colors font-medium"
                            >
                                <Facebook size={18} />
                                <span>فيسبوك</span>
                            </button>

                            <button
                                onClick={() => window.open(`https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`, '_blank')}
                                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] text-white rounded-lg hover:bg-[#20bd5a] transition-colors font-medium"
                            >
                                <MessageCircle size={18} />
                                <span>واتساب</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
