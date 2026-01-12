export interface NewsImage {
    id: number;
    news_id: number;
    name: string;
    path: string;
    main_image: number; // 1 or 0
    created_at: string;
    updated_at: string;
}

export interface NewsItem {
    id: number;
    title: string;
    slug: string;
    active: number;
    home: number;
    user_id: number;
    description: string; // HTML content
    created_at: string;
    updated_at: string;
    news_images: NewsImage[];
}

export type NewsResponse = NewsItem[];
