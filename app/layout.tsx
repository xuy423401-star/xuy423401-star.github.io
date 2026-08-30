import type { Metadata } from 'next';
import './globals.css';
import { siteUrl, withBasePath } from '@/lib/paths';

export const metadata: Metadata = {
  metadataBase: new URL(new URL(siteUrl).origin),
  title: '线迹之间｜网页版画展',
  description: '16 幅纸上世界的夜游——我所看见的，与看见我的。',
  openGraph: {
    title: '线迹之间｜网页版画展',
    description: '16 幅纸上世界的夜游——我所看见的，与看见我的。',
    type: 'website',
    locale: 'zh_CN',
    images: [
      {
        url: withBasePath('/images/08-night-sea-large.webp'),
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
    images: [withBasePath('/images/08-night-sea-large.webp')],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
