import axios from 'axios';
import type { NewsItem, NewsResponse } from '../types/news';
export type { NewsItem };

// Base URL for images as per requirements
export const IMAGE_BASE_URL = 'https://backend.ascww.org/api/news/image/';

// Axios instance
const apiClient = axios.create({
    baseURL: '/api', // Proxied to https://backend.ascww.org in dev/preview
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getNews = async (page: number = 1): Promise<NewsItem[]> => {
    // API returns array directly
    const response = await apiClient.get<NewsItem[]>(`/news?page=${page}`);
    return response.data;
};

export const getNewsDetails = async (id: string | number): Promise<NewsItem> => {
    // Use slug or id, API returns array of 1 item
    const response = await apiClient.get<NewsItem[]>(`/news/${id}`);
    return response.data[0];
};

export const getNewsDetailsServer = async (id: string | number): Promise<NewsItem> => {
    try {
        const response = await fetch(`https://backend.ascww.org/api/news/${id}`, {
            next: { revalidate: 60 } // Revalidate every minute
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error('Error fetching news details:', error);
        throw error;
    }
};
