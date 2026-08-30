export type ArtworkSoundtrack = {
  title: string;
  file: string;
  mood: string;
  source: string;
};

const tracks = {
  storm: {
    title: '颠倒风暴',
    file: '/audio/storm-tension.mp3',
    mood: '悬疑、紧张与压迫',
    source: '爱给网轻音乐素材（用户提供）',
  },
  spring: {
    title: '向光生长',
    file: '/audio/spring-pulse.mp3',
    mood: '明亮、流动与新生',
    source: '爱给网轻音乐素材（用户提供）',
  },
  cinematic: {
    title: '蓝色远景',
    file: '/audio/cinematic-blue.mp3',
    mood: '电影感、辽阔与梦境',
    source: '爱给网轻音乐素材（用户提供）',
  },
  canon: {
    title: '纸上回声',
    file: '/audio/canon-strings.mp3',
    mood: '熟悉、温柔与时间感',
    source: '爱给网轻音乐素材（用户提供）',
  },
  emotional: {
    title: '月下独白',
    file: '/audio/emotional-piano.mp3',
    mood: '孤独、克制与回望',
    source: '爱给网轻音乐素材（用户提供）',
  },
  soft: {
    title: '柔光停留',
    file: '/audio/soft-piano.mp3',
    mood: '安静、清新与留白',
    source: '爱给网轻音乐素材（用户提供）',
  },
  lost: {
    title: '失落之后',
    file: '/audio/lost-melody.mp3',
    mood: '忧郁、内省与呼吸',
    source: '爱给网轻音乐素材（用户提供）',
  },
  cello: {
    title: '暗处的弦',
    file: '/audio/cello-night.mp3',
    mood: '沉静、厚重与凝视',
    source: '爱给网轻音乐素材（用户提供）',
  },
} as const;

const artworkTrackKeys: Record<string, keyof typeof tracks> = {
  '01-panel-city': 'canon',
  '02-fractured-rose': 'emotional',
  '03-blue-eyes': 'cinematic',
  '04-bridge-storm': 'storm',
  '05-bloom-after': 'spring',
  '06-beyond-sea': 'soft',
  '07-resting-tiger': 'cello',
  '08-night-sea': 'emotional',
  '09-autumn-moon': 'soft',
  '10-black-cat': 'lost',
  '11-running-rabbit': 'cinematic',
  '12-hidden-face': 'lost',
  '13-lone-tree': 'emotional',
  '14-self-mockery': 'cello',
  '15-sunflowers': 'spring',
  '16-starry-night': 'cinematic',
};

export function getArtworkSoundtrack(slug: string | null) {
  if (!slug) return undefined;
  const key = artworkTrackKeys[slug];
  return key ? tracks[key] : undefined;
}
