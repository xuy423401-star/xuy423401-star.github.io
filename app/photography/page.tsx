import type { Metadata } from 'next';
import PhotographyExperience from '@/components/photography-experience';
import { siteUrl, withBasePath } from '@/lib/paths';

const photographyShareImage = new URL(
  withBasePath('/photography/IMG_20260830_101938-large.webp'),
  siteUrl,
).toString();

export const metadata: Metadata = {
  title: '远方有光｜摄影展｜线迹之间',
  description: '《线迹之间》摄影展：65 幅关于距离、天气、日常与痕迹的照片。',
  openGraph: {
    title: '远方有光｜摄影展｜线迹之间',
    description: '65 幅关于距离、天气、日常与留下痕迹的摄影作品。',
    type: 'website',
    locale: 'zh_CN',
    url: new URL(withBasePath('/photography/'), siteUrl).toString(),
    images: [
      {
        url: photographyShareImage,
        width: 3072,
        height: 4096,
        alt: '《远方有光》摄影展封面：落日照亮海面与潮湿沙滩',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '远方有光｜摄影展｜线迹之间',
    description: '65 幅关于距离、天气、日常与留下痕迹的摄影作品。',
    images: [photographyShareImage],
  },
};

export default function PhotographyPage() {
  return <PhotographyExperience />;
}
