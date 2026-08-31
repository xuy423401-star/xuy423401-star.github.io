'use client';

/* oxlint-disable react/react-compiler */

import { ChevronUp, Music2, Pause, Play } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PhotographySoundtrack } from '@/lib/photography-soundtracks';
import { getPhotographySoundtrack } from '@/lib/photography-soundtracks';
import { withBasePath } from '@/lib/paths';

export type PhotographyPlaybackStatus = 'idle' | 'blocked' | 'playing' | 'paused';

function fadeAudio(audio: HTMLAudioElement, target: number, duration: number) {
  const start = audio.volume;
  const startedAt = performance.now();
  const tick = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    audio.volume = start + (target - start) * progress;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function usePhotographyAudio(soundtrack?: PhotographySoundtrack) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackRef = useRef<PhotographySoundtrack | undefined>(soundtrack);
  const lastTrackFileRef = useRef<string | null>(null);
  const userEnabledRef = useRef(true);
  const [status, setStatus] = useState<PhotographyPlaybackStatus>('idle');

  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.volume = .38;
  }, []);

  const playAudio = useCallback(async (track: PhotographySoundtrack) => {
    if (!userEnabledRef.current) return;
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio();
      audio.preload = 'auto';
      audio.loop = true;
      audio.volume = 0;
      audioRef.current = audio;
    }
    const source = withBasePath(track.file);
    if (audio.src !== new URL(source, window.location.href).href) {
      audio.src = source;
      audio.load();
    }
    try {
      await audio.play();
      fadeAudio(audio, .38, 420);
      setStatus('playing');
    } catch {
      setStatus('blocked');
    }
  }, []);

  useEffect(() => {
    currentTrackRef.current = soundtrack;
    if (!soundtrack) {
      stopAudio();
      lastTrackFileRef.current = null;
      setStatus('idle');
      return;
    }
    if (lastTrackFileRef.current === soundtrack.file) return;
    lastTrackFileRef.current = soundtrack.file;
    stopAudio();
    if (userEnabledRef.current) void playAudio(soundtrack);
  }, [playAudio, soundtrack, stopAudio]);

  useEffect(() => {
    const unlock = () => {
      if (!currentTrackRef.current || !userEnabledRef.current) return;
      void playAudio(currentTrackRef.current);
    };
    document.addEventListener('pointerdown', unlock, { passive: true });
    document.addEventListener('keydown', unlock);
    return () => {
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('keydown', unlock);
    };
  }, [playAudio]);

  useEffect(() => () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = '';
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || status !== 'playing') {
      userEnabledRef.current = true;
      if (currentTrackRef.current) void playAudio(currentTrackRef.current);
      return;
    }
    userEnabledRef.current = false;
    fadeAudio(audio, 0, 180);
    window.setTimeout(() => audio.pause(), 190);
    setStatus('paused');
  }, [playAudio, status]);

  return { status, toggle };
}

export function PhotographySoundtrackButton({
  soundtrack,
  status,
  onToggle,
}: {
  soundtrack?: PhotographySoundtrack;
  status: PhotographyPlaybackStatus;
  onToggle: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  if (!soundtrack) return null;
  const playing = status === 'playing';
  const label = status === 'blocked' ? '点击开启' : playing ? '正在播放' : '播放音乐';

  if (collapsed) {
    return (
      <div className="soundtrack-button is-collapsed photo-floating-soundtrack">
        <button type="button" className="soundtrack-collapse-tab" onClick={() => setCollapsed(false)} aria-label={`展开摄影展音乐播放器：${soundtrack.title}`}>
          {playing ? <Pause size={15} /> : <Music2 size={15} />}
        </button>
      </div>
    );
  }

  return (
    <div className={`soundtrack-button ${playing ? 'is-playing' : ''} photo-floating-soundtrack`}>
      <button type="button" className="soundtrack-main" onClick={onToggle} aria-label={`${playing ? '暂停' : '播放'}${soundtrack.title}`} aria-pressed={playing}>
        <span className="soundtrack-button-icon" aria-hidden="true">{playing ? <Pause size={13} /> : status === 'blocked' ? <Play size={13} /> : <Music2 size={13} />}</span>
        <span className="soundtrack-button-copy"><small>{label} · 章节配乐</small><strong>{soundtrack.title}</strong></span>
        <span className="soundtrack-equalizer" aria-hidden="true"><i /><i /><i /></span>
      </button>
      <button type="button" className="soundtrack-collapse" onClick={() => setCollapsed(true)} aria-label="收起摄影展音乐播放器"><ChevronUp size={14} /></button>
    </div>
  );
}

export function StandalonePhotographyAudio({
  chapter,
  chapterIndex,
  chapterCount,
}: {
  chapter: Parameters<typeof getPhotographySoundtrack>[0];
  chapterIndex: number;
  chapterCount: number;
}) {
  const soundtrack = getPhotographySoundtrack(chapter, chapterIndex, chapterCount);
  const playback = usePhotographyAudio(soundtrack);
  return (
    <PhotographySoundtrackButton
      soundtrack={soundtrack}
      status={playback.status}
      onToggle={playback.toggle}
    />
  );
}
