'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { getNews } from '../api/news';
import type { NewsItem } from '../types/news';
import { NewsCard } from './NewsCard';

const ITEMS_PER_SCROLL = 3;

export const NewsList = () => {
    // Stores all data fetched from API
    const [fetchedNews, setFetchedNews] = useState<NewsItem[]>([]);
    // Stores what is currently visible to the user
    const [visibleNews, setVisibleNews] = useState<NewsItem[]>([]);

    // Pagination state
    const apiPageRef = useRef(1);
    const [loading, setLoading] = useState(false);
    const [hasMoreApi, setHasMoreApi] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Intersection Observer hook
    const { ref: observerTarget, inView } = useInView({
        threshold: 0,
        rootMargin: '100px',
    });

    // Function to show more items from our local buffer
    const showMoreLocal = useCallback(() => {
        const currentLength = visibleNews.length;
        const totalAvailable = fetchedNews.length;

        if (currentLength < totalAvailable) {
            const nextChunk = fetchedNews.slice(currentLength, currentLength + ITEMS_PER_SCROLL);
            setVisibleNews(prev => [...prev, ...nextChunk]);
            return true;
        }
        return false;
    }, [visibleNews.length, fetchedNews]);

    const loadFromApi = async () => {
        // Only load if we haven't fetched anything yet
        if (loading || fetchedNews.length > 0) return;

        setLoading(true);
        setError(null);
        try {
            const response = await getNews(1);
            if (response.length === 0) {
                setHasMoreApi(false);
            } else {
                const sortedData = [...response].sort((a: NewsItem, b: NewsItem) => {
                    const dateA = new Date(a.created_at || 0).getTime();
                    const dateB = new Date(b.created_at || 0).getTime();
                    return dateB - dateA;
                });

                setFetchedNews(sortedData);
                setVisibleNews(sortedData.slice(0, ITEMS_PER_SCROLL));
                setHasMoreApi(false);
            }
        } catch (err: unknown) {
            console.error('API Error:', err);
            const errorMessage = (err as any).response?.status === 429
                ? 'عذراً، يوجد ضغط عالي...'
                : 'حدث خطأ أثناء تحميل الأخبار...';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFromApi();
    }, []);

    // Effect to handle scrolling
    useEffect(() => {
        if (inView && !loading && fetchedNews.length > visibleNews.length) {
            showMoreLocal();
        }
    }, [inView, loading, showMoreLocal, fetchedNews.length, visibleNews.length]);

    if (error && visibleNews.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center text-red-500">
                <AlertCircle size={48} className="mb-4 opacity-50" />
                <p>{error}</p>
                <button
                    onClick={() => loadFromApi()}
                    className="mt-4 px-6 py-2 bg-red-50 text-red-600 rounded-full font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                    <RefreshCw size={16} />
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleNews.map((item, index) => (
                    <NewsCard key={`${item.id}-${index}`} news={item} />
                ))}
            </div>

            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-primary-500" size={32} />
                </div>
            )}

            {/* Show retry button at bottom if error occurs during scrolling */}
            {error && visibleNews.length > 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-red-500">
                    <p className="mb-2">{error}</p>
                    <button
                        onClick={() => loadFromApi()}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            )}

            {!hasMoreApi && visibleNews.length === fetchedNews.length && fetchedNews.length > 0 && (
                <div className="text-center py-12 text-gray-400">
                    <p>تم تحميل جميع الأخبار</p>
                </div>
            )}

            {/* Trigger for infinite scroll - only render if we have more data locally */}
            {(visibleNews.length < fetchedNews.length) && !error && (
                <div ref={observerTarget} className="h-10 w-full" />
            )}
        </div>
    );
};
