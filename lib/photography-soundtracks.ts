import type { PhotoChapterId } from '@/lib/photography';

export type PhotographySoundtrack = {
  title: string;
  file: string;
  mood: string;
  source: string;
};

export const photographyChapterSoundtracks: Record<PhotoChapterId, [PhotographySoundtrack, PhotographySoundtrack]> = {
  desert: [
    { title: '任我行', file: '/photography-audio/任我行.mp3', mood: '辽阔、自由与独行', source: '用户提供音频' },
    { title: '任我行', file: '/photography-audio/任我行.mp3', mood: '辽阔、自由与独行', source: '用户提供音频' },
  ],
  water: [
    { title: '落花流水', file: '/photography-audio/落花流水.mp3', mood: '流动、相遇与时间', source: '用户提供音频' },
    { title: '落花流水', file: '/photography-audio/落花流水.mp3', mood: '流动、相遇与时间', source: '用户提供音频' },
  ],
  daily: [
    { title: '单车', file: '/photography-audio/单车.mp3', mood: '陪伴、生活与温度', source: '用户提供音频' },
    { title: '单车', file: '/photography-audio/单车.mp3', mood: '陪伴、生活与温度', source: '用户提供音频' },
  ],
  trace: [
    { title: '好久不见', file: '/photography-audio/好久不见.mp3', mood: '重逢、距离与克制', source: '用户提供音频' },
    { title: '我怀念的', file: '/photography-audio/我怀念的.mp3', mood: '记忆、失去与回望', source: '用户提供音频' },
  ],
};

export function getPhotographySoundtrack(chapter: PhotoChapterId | null, chapterIndex = 0, chapterCount = 0) {
  if (!chapter) return undefined;
  const split = Math.ceil(chapterCount / 2);
  return photographyChapterSoundtracks[chapter][chapterIndex < split ? 0 : 1];
}
