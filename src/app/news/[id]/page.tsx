
import { Metadata } from 'next';
import { getNewsDetailsServer, IMAGE_BASE_URL } from '@/api/news';
import NewsDetailsClient from './NewsDetailsClient';
import type { NewsImage } from '@/types/news';

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const id = (await params).id;

    try {
        const news = await getNewsDetailsServer(id);

        const images = news.news_images?.map((img: NewsImage) => `${IMAGE_BASE_URL}${img.path}`) || [];
        const description = (news.description || '').replace(/<[^>]+>/g, '').substring(0, 160);

        return {
            title: news.title,
            description: description,
            openGraph: {
                title: news.title,
                description: description,
                images: images.length > 0 ? images : undefined,
                type: 'article',
                publishedTime: news.created_at,
            },
            twitter: {
                card: 'summary_large_image',
                title: news.title,
                description: description,
                images: images.length > 0 ? images : undefined,
            }
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'News Details',
            description: 'Read the latest news from Assiut Water Company'
        };
    }
}

export default async function NewsDetailsPage({ params }: Props) {
    const id = (await params).id;
    let initialData = null;

    try {
        initialData = await getNewsDetailsServer(id);
    } catch (error) {
        console.error('Error fetching initial data:', error);
    }

    return <NewsDetailsClient id={id} initialData={initialData} />;
}
