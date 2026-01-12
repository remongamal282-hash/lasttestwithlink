import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import type { NewsItem } from '@/types/news';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<NewsItem[] | { error: string }>> {
    try {
        const { id } = await params;

        const response = await axios.get<NewsItem[]>(`https://backend.ascww.org/api/news/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        const axiosError = error as AxiosError;
        console.error('Error fetching news details:', axiosError.message);
        return NextResponse.json(
            { error: 'Failed to fetch news details' },
            { status: axiosError.response?.status || 500 }
        );
    }
}
