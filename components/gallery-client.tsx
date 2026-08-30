'use client';

import dynamic from 'next/dynamic';

const WhiteCubeGallery = dynamic(() => import('@/components/white-cube-gallery'), {
  ssr: false,
  loading: () => (
    <main className="tour-shell tour-route-loading" aria-live="polite">
      <div className="tour-loading"><span /> 正在打开白盒子展厅…</div>
    </main>
  ),
});

export default function GalleryClient() {
  return <WhiteCubeGallery />;
}
