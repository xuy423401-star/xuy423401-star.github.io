import type { Metadata } from 'next';
import PhotographyExperience from '@/components/photography-experience';

export const metadata: Metadata = {
  title: '远方有光｜摄影展｜线迹之间',
  description: '《线迹之间》摄影展：65 幅关于距离、天气、日常与痕迹的照片。',
};

export default function PhotographyPage() {
  return <PhotographyExperience />;
}
