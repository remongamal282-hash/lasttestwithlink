'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar, Facebook, MessageCircle, ArrowRight } from 'lucide-react';
import { IMAGE_BASE_URL } from '../api/news';
import type { NewsItem, NewsImage } from '../types/news';
import logo from '../assets/logo.png';
import { useState, useEffect } from 'react';

interface NewsCardProps {
    news: NewsItem;
}

export const NewsCard = ({ news }: NewsCardProps) => {
    // Find main image or fallback to first image
    const mainImage = news.news_images?.find((img: NewsImage) => img.main_image === 1) || news.news_images?.[0];
    const initialImgSrc = mainImage ? `${IMAGE_BASE_URL}${mainImage.path}` : logo.src;

    const [imgSrc, setImgSrc] = useState(initialImgSrc);

    useEffect(() => {
        setImgSrc(initialImgSrc);
    }, [initialImgSrc]);

    const newsUrl = typeof window !== 'undefined' ? `${window.location.origin}/news/${news.slug}` : `/news/${news.slug}`;
    const shareText = encodeURIComponent(news.title);
    const shareUrl = encodeURIComponent(newsUrl);

    const handleShare = (platform: 'facebook' | 'whatsapp') => {
        if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
        } else {
            window.open(`https://wa.me/?text=${shareText}%20${shareUrl}`, '_blank');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full group">
            <div className="relative aspect-video overflow-hidden bg-gray-100">
                <img
                    src={imgSrc}
                    onError={() => setImgSrc(logo.src)}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-4">
                    {/* Overlay actions if needed */}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar size={14} className="text-primary-500" />
                    <time>{news.created_at ? format(new Date(news.created_at), 'dd MMMM yyyy', { locale: ar }) : ''}</time>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                    <Link href={`/news/${news.slug}`}>
                        {news.title}
                    </Link>
                </h3>

                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow opacity-80"
                    dangerouslySetInnerHTML={{
                        __html: (news.description || '')
                            .replace(/لمزيد من التفاصيل :|لمزيد من التفاصيل/g, '')
                            .replace(/<[^>]+>/g, '')
                    }}></p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleShare('facebook')}
                            className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="مشاركة على فيسبوك"
                        >
                            <Facebook size={16} />
                        </button>
                        <button
                            onClick={() => handleShare('whatsapp')}
                            className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                            title="مشاركة على واتساب"
                        >
                            <MessageCircle size={16} />
                        </button>
                    </div>

                    <Link
                        href={`/news/${news.slug}`}
                        className="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-all group-hover:gap-2"
                    >
                        اقرأ المزيد
                        <ArrowRight size={16} className="rtl:rotate-180" />
                    </Link>
                </div>
            </div>
        </div>
    );
};
