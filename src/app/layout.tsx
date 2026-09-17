import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'EduShort — Nền Tảng Video Hoạt Hình Học Tập & Quiz Ngắn',
  description: 'Học lý thuyết và công thức qua các video hoạt hình sinh động chuẩn TikTok/Reels, kiểm tra kiến thức tự động sau 5 video.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400&family=Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&subset=vietnamese&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-pink-300 selection:text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
