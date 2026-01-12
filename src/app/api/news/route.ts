import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import type { NewsItem } from '@/types/news';

export async function GET(request: NextRequest): Promise<NextResponse<NewsItem[] | { error: string; details: string }>> {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = searchParams.get('page') || '1';

        const response = await axios.get<NewsItem[]>(`https://backend.ascww.org/api/news?page=${page}`, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
            timeout: 10000, // 10 seconds timeout
        });

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        const axiosError = error as AxiosError;
        console.error('Error fetching news:', axiosError.response?.data || axiosError.message);
        return NextResponse.json(
            { error: 'Failed to fetch news', details: axiosError.message },
            { status: axiosError.response?.status || 500 }
        );
    }
}
