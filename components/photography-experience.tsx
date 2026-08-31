'use client';

/* oxlint-disable react/react-compiler */

import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { photographyChapters, photographyWorks, type PhotoChapter, type PhotographyWork } from '@/lib/photography';
import { withBasePath } from '@/lib/paths';

type PhotoScene =
  | { id: 'cover'; kind: 'cover'; title: string; label: string }
  | { id: string; kind: 'chapter'; chapter: PhotoChapter; title: string; label: string }
  | { id: string; kind: 'photo'; chapter: PhotoChapter; work: PhotographyWork; title: string; label: string }
  | { id: 'about'; kind: 'about'; title: string; label: string };

const scenes: PhotoScene[] = [
  { id: 'cover', kind: 'cover', title: '远方有光', label: '摄影展' },
  ...photographyChapters.flatMap((chapter) => [
    { id: `photo-chapter-${chapter.id}`, kind: 'chapter' as const, chapter, title: chapter.title, label: chapter.label },
    ...chapter.works.map((work) => ({
      id: work.slug,
      kind: 'photo' as const,
      chapter,
      work,
      title: work.title,
      label: `${chapter.label} · ${work.number} / ${String(photographyWorks.length).padStart(2, '0')}`,
    })),
  ]),
  { id: 'about', kind: 'about', title: '还在路上', label: '尾声' },
];

function sceneState(index: number, current: number) {
  const offset = index - current;
  if (offset < 0) return 'past';
  if (offset === 0) return 'current';
  if (offset === 1) return 'next';
  return 'far';
}

function PhotoArtwork({ work, chapter, offset }: { work: PhotographyWork; chapter: PhotoChapter; offset: number }) {
  const nearViewport = Math.abs(offset) <= 1;
  return (
    <figure className="photo-art" data-chapter={chapter.id}>
      <Image
        src={withBasePath(nearViewport ? work.file : work.thumb)}
        alt={work.alt}
        fill
        loading="eager"
        decoding="sync"
        sizes="(max-width: 720px) 100vw, 66vw"
      />
      <span className="photo-art-grain" aria-hidden="true" />
      <figcaption><Maximize2 size={13} aria-hidden="true" /> 查看作品页</figcaption>
    </figure>
  );
}

function PhotoWorkPanel({ chapter, work, sequence, offset }: { chapter: PhotoChapter; work: PhotographyWork; sequence: number; offset: number }) {
  return (
    <div className="photo-work-layout">
      <PhotoArtwork work={work} chapter={chapter} offset={offset} />
      <article className="photo-work-copy">
        <p>{chapter.english} · {chapter.label}</p>
        <span className="photo-work-sequence">{String(sequence).padStart(2, '0')} / {String(photographyWorks.length).padStart(2, '0')}</span>
        <h2>{work.title}</h2>
        <i>{work.englishTitle}</i>
        <strong>{work.short}</strong>
        <span>{work.note}</span>
        <span className="photo-work-link">
          打开摄影作品页 <ArrowUpRight size={15} aria-hidden="true" />
        </span>
      </article>
    </div>
  );
}

export default function PhotographyExperience() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const transitionLock = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const total = scenes.length;
  const currentScene = scenes[sceneIndex];
  const nextScene = scenes[sceneIndex + 1];

  const goToScene = useCallback((target: number) => {
    if (transitionLock.current) return;
    const next = Math.max(0, Math.min(total - 1, target));
    if (next === sceneIndex) return;
    setDirection(next > sceneIndex ? 'forward' : 'backward');
    transitionLock.current = true;
    setSceneIndex(next);
    window.history.replaceState(null, '', next === 0 ? window.location.pathname : `#${scenes[next].id}`);
    window.setTimeout(() => { transitionLock.current = false; }, 640);
  }, [sceneIndex, total]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault();
        goToScene(sceneIndex + 1);
      }
      if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        goToScene(sceneIndex - 1);
      }
      if (event.key === 'Home') goToScene(0);
      if (event.key === 'End') goToScene(total - 1);
    };
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 18) return;
      event.preventDefault();
      goToScene(sceneIndex + (event.deltaY > 0 ? 1 : -1));
    };
    const syncHash = () => {
      const index = scenes.findIndex(scene => `#${scene.id}` === window.location.hash);
      if (index >= 0) setSceneIndex(index);
    };
    syncHash();
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('hashchange', syncHash);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('hashchange', syncHash);
    };
  }, [goToScene, sceneIndex, total]);

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') touchStart.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'touch' || !touchStart.current) return;
    const deltaX = event.clientX - touchStart.current.x;
    const deltaY = event.clientY - touchStart.current.y;
    touchStart.current = null;
    const dominant = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
    if (Math.abs(dominant) >= 42) goToScene(sceneIndex + (dominant < 0 ? 1 : -1));
  };

  return (
    <main className={`photo-experience photo-direction-${direction}`} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      <header className="photo-header">
        <a href={withBasePath('/')} className="photo-wordmark"><ArrowLeft size={15} aria-hidden="true" /> 线迹之间</a>
        <span>{currentScene.label} · {currentScene.title}</span>
        <a href={withBasePath('/gallery/')} className="photo-cube-link">3D 白盒子 <ArrowUpRight size={14} aria-hidden="true" /></a>
      </header>

      <div className="photo-stage" aria-live="polite">
        {scenes.map((scene, index) => {
          const offset = index - sceneIndex;
          if (Math.abs(offset) > 1) return null;
          const state = sceneState(index, sceneIndex);

          if (scene.kind === 'cover') {
            return (
              <section className="photo-panel photo-cover" data-state={state} key={scene.id} aria-hidden={state !== 'current'}>
                <div className="photo-cover-shape photo-cover-shape-one" />
                <div className="photo-cover-shape photo-cover-shape-two" />
                <div className="photo-cover-copy">
                  <p>PHOTOGRAPHY EXHIBITION · 65 WORKS · 2026</p>
                  <h1>远方<br /><em>有光</em></h1>
                  <span>一组关于距离、天气、日常与留下痕迹的摄影作品。向前一步，下一张照片会从时间深处显现。</span>
                  <button type="button" onClick={() => goToScene(1)}>进入摄影展 <ArrowRight size={18} aria-hidden="true" /></button>
                </div>
                <p className="photo-gesture">滚轮 · 轻扫 · 方向键　逐张观看</p>
              </section>
            );
          }

          if (scene.kind === 'chapter') {
            return (
              <section className={`photo-panel photo-chapter photo-chapter-${scene.chapter.id}`} data-state={state} key={scene.id} aria-hidden={state !== 'current'}>
                <div className="photo-chapter-number">{scene.chapter.number}</div>
                <div className="photo-chapter-copy">
                  <p>{scene.chapter.english} · {scene.chapter.label}</p>
                  <h2>{scene.chapter.title}</h2>
                  <strong>{scene.chapter.intro}</strong>
                  <span>{String(scene.chapter.works.length).padStart(2, '0')} PHOTOGRAPHS</span>
                  <button type="button" onClick={() => goToScene(index + 1)}>进入本章 <ArrowRight size={17} aria-hidden="true" /></button>
                </div>
              </section>
            );
          }

          if (scene.kind === 'photo') {
            const sequence = photographyWorks.findIndex(work => work.slug === scene.work.slug) + 1;
            return (
              <section className={`photo-panel photo-work photo-work-${scene.chapter.id}`} data-state={state} key={scene.id} aria-hidden={state !== 'current'}>
                <a className="photo-work-hit" href={withBasePath(`/photography/${scene.work.slug}/`)} aria-label={`打开《${scene.work.title}》摄影作品页`}>
                  <PhotoWorkPanel chapter={scene.chapter} work={scene.work} sequence={sequence} offset={offset} />
                </a>
              </section>
            );
          }

          return (
            <section className="photo-panel photo-about" data-state={state} key={scene.id} aria-hidden={state !== 'current'}>
              <div><p>EPILOGUE · 尾声</p><h2>还在路上</h2><span>照片没有替现实停下，只把某一刻的光、风和人的位置留在这里。你可以回到任何一章，重新看见它。</span><button type="button" onClick={() => goToScene(0)}>从第一张重新观看 <ArrowLeft size={16} aria-hidden="true" /></button></div>
            </section>
          );
        })}
      </div>

      <div className="photo-controls">
        <button type="button" onClick={() => goToScene(sceneIndex - 1)} disabled={sceneIndex === 0} aria-label="上一张照片"><ArrowLeft size={17} /></button>
        <span>{String(sceneIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        <button type="button" onClick={() => goToScene(sceneIndex + 1)} disabled={sceneIndex === total - 1} aria-label="下一张照片"><ArrowRight size={17} /></button>
      </div>

      {nextScene && (
        <button className="photo-next" type="button" onClick={() => goToScene(sceneIndex + 1)}>
          <small>{nextScene.kind === 'photo' ? '下一张照片' : '下一展页'} · {String(sceneIndex + 2).padStart(2, '0')}</small>
          <strong>{nextScene.title}</strong>
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      )}
    </main>
  );
}
