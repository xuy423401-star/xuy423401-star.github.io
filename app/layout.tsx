import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://xianji-zhijian.sites.openai.com',
  ),
  title: '线迹之间｜网页版画展',
  description: '16 幅纸上世界的夜游——我所看见的，与看见我的。',
  openGraph: {
    title: '线迹之间｜网页版画展',
    description: '16 幅纸上世界的夜游——我所看见的，与看见我的。',
    type: 'website',
    locale: 'zh_CN',
    images: [
      {
        url: '/images/08-night-sea-large.webp',
        width: 4029,
        height: 4096,
        alt: '《线迹之间》线上画展序章作品《夜海》',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '线迹之间｜网页版画展',
    description: '16 幅纸上世界的夜游——我所看见的，与看见我的。',
    images: ['/images/08-night-sea-large.webp'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
