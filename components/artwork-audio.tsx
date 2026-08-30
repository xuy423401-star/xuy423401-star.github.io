'use client';

/* oxlint-disable react/react-compiler */

import { Music2, Pause, Play } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getArtworkSoundtrack, type ArtworkSoundtrack } from '@/lib/soundtracks';
import { withBasePath } from '@/lib/paths';

export type PlaybackStatus = 'idle' | 'blocked' | 'playing' | 'paused';

type ArtworkAudioProps = {
  slug: string | null;
};

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

export function useArtworkAudio({ slug }: ArtworkAudioProps) {
  const soundtrack = getArtworkSoundtrack(slug);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSlugRef = useRef<string | null>(slug);
  const lastTrackFileRef = useRef<string | null>(null);
  const userEnabledRef = useRef(true);
  const [status, setStatus] = useState<PlaybackStatus>('idle');

  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.volume = .42;
  }, []);

  const playAudio = useCallback(async (track: ArtworkSoundtrack) => {
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
      fadeAudio(audio, .42, 420);
      setStatus('playing');
    } catch {
      setStatus('blocked');
    }
  }, []);

  useEffect(() => {
    currentSlugRef.current = slug;
    if (!soundtrack) {
      stopAudio();
      setStatus('idle');
      lastTrackFileRef.current = null;
      return;
    }

    if (lastTrackFileRef.current === soundtrack.file) return;
    lastTrackFileRef.current = soundtrack.file;
    stopAudio();
    if (userEnabledRef.current) {
      void playAudio(soundtrack);
    }
  }, [playAudio, slug, soundtrack, stopAudio]);

  useEffect(() => {
    const unlock = () => {
      const currentTrack = getArtworkSoundtrack(currentSlugRef.current);
      if (!currentTrack || !userEnabledRef.current) return;
      void playAudio(currentTrack);
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
    const currentTrack = getArtworkSoundtrack(currentSlugRef.current);
    if (!audio || status !== 'playing') {
      userEnabledRef.current = true;
      if (currentTrack) void playAudio(currentTrack);
      return;
    }

    userEnabledRef.current = false;
    fadeAudio(audio, 0, 180);
    window.setTimeout(() => audio.pause(), 190);
    setStatus('paused');
  }, [playAudio, status]);

  return { soundtrack, status, toggle };
}

export function SoundtrackButton({
  soundtrack,
  status,
  onToggle,
  className = '',
}: {
  soundtrack?: ArtworkSoundtrack;
  status: PlaybackStatus;
  onToggle: () => void;
  className?: string;
}) {
  if (!soundtrack) return null;
  const playing = status === 'playing';
  const label = status === 'blocked' ? '点击开启' : playing ? '正在播放' : '播放音乐';

  return (
    <button
      type="button"
      className={`soundtrack-button ${playing ? 'is-playing' : ''} ${className}`.trim()}
      onClick={onToggle}
      aria-label={`${playing ? '暂停' : '播放'}${soundtrack.title}`}
      aria-pressed={playing}
    >
      <span className="soundtrack-button-icon" aria-hidden="true">
        {playing ? <Pause size={13} /> : status === 'blocked' ? <Play size={13} /> : <Music2 size={13} />}
      </span>
      <span className="soundtrack-button-copy">
        <small>{label} · 配乐</small>
        <strong>{soundtrack.title}</strong>
      </span>
      <span className="soundtrack-equalizer" aria-hidden="true"><i /><i /><i /></span>
    </button>
  );
}

export function StandaloneArtworkAudio({ slug }: { slug: string }) {
  const playback = useArtworkAudio({ slug });
  return (
    <SoundtrackButton
      soundtrack={playback.soundtrack}
      status={playback.status}
      onToggle={playback.toggle}
      className="detail-soundtrack"
    />
  );
}
