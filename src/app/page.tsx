import type { Metadata } from 'next';
import { NewsList } from '@/components/NewsList';

export const metadata: Metadata = {
    title: 'آخر الأخبار | شركة مياه الشرب والصرف الصحى بأسيوط',
    description: 'تابع آخر أخبار وفعاليات شركة مياه الشرب والصرف الصحى بأسيوط والوادى الجديد',
};

export default function Home() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
                    المركز الإعلامي
                </h1>
                <p className="text-gray-500 max-w-2xl text-lg">
                    تابع أحدث الأخبار والفعاليات والإعلانات الخاصة بالشركة أولاً بأول
                </p>
            </div>

            <NewsList />
        </div>
    );
}
