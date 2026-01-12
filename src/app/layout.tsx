import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
    title: 'شركة مياه الشرب والصرف الصحى بأسيوط',
    description: 'تابع آخر أخبار وفعاليات شركة مياه الشرب والصرف الصحى بأسيوط والوادى الجديد',
    openGraph: {
        title: 'شركة مياه الشرب والصرف الصحى بأسيوط',
        description: 'تابع آخر أخبار وفعاليات شركة مياه الشرب والصرف الصحى بأسيوط والوادى الجديد',
        locale: 'ar_EG',
        type: 'website',
        siteName: 'شركة مياه الشرب والصرف الصحى بأسيوط'
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ar" dir="rtl">
            <head>

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet" />
            </head>
            <body>
                <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
                    <Header />
                    <main className="flex-grow container mx-auto px-4 py-8">
                        {children}
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
