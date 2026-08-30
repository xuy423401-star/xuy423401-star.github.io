import type { Metadata } from 'next';
import GalleryClient from '@/components/gallery-client';

export const metadata: Metadata = {
  title: '3D 白盒子展厅｜线迹之间',
  description: '进入《线迹之间》沉浸式 3D 白盒子展厅，自由漫游并观看 16 幅纸上作品。',
};

export default function GalleryPage() {
  return <GalleryClient />;
}
