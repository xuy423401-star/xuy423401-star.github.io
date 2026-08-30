'use client';

/* oxlint-disable react/react-compiler */

import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from 'lucide-react';
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import { chapters, getWork, works, type Work } from '@/lib/works';
import { withBasePath } from '@/lib/paths';
import { SoundtrackButton, useArtworkAudio } from '@/components/artwork-audio';

const chapterInfo = {
  prologue: {
    number: '00', label: '序章', english: 'PROLOGUE', title: '一根线进入夜',
    intro: '月亮、海浪和一根遥远的细线，先为这次观看建立尺度。人在世界里很小，却仍可以成为方向。',
    coverSlug: '08-night-sea',
  },
  gaze: {
    number: '01', label: '第一章', english: 'THE GAZE', title: '凝视',
    intro: '眼睛、动物与遮住面孔的人同时看向画外。观看不再是单向的：当你靠近作品，作品也在注视你。',
    coverSlug: '03-blue-eyes',
  },
  borrowed: {
    number: '02', label: '第二章', english: 'BORROWED WORLDS', title: '借来的世界',
    intro: '游戏、动画、文学人物与名画被重新落到纸上。熟悉的世界经过手的描摹，成为新的个人记忆。',
    coverSlug: '01-panel-city',
  },
  cycle: {
    number: '03', label: '第三章', english: 'GROWTH / AFTERLIFE', title: '生长与消逝',
    intro: '花、骨骼、月亮、桥与树沿着同一条线相遇。盛放和消逝不是终点，而是彼此继续生长的方式。',
    coverSlug: '02-fractured-rose',
  },
} as const;

const exhibitionGroups = [
  { chapter: 'prologue' as const, slugs: ['08-night-sea'] },
  ...chapters.map((chapter) => ({ chapter: chapter.id, slugs: [...chapter.slugs] })),
];

const exhibitionOrder = exhibitionGroups.flatMap((group) => group.slugs);

const exhibitionWorks = exhibitionOrder.map((slug) => getWork(slug)!);

type Scene = {
  id: string;
  kind: 'cover' | 'chapter' | 'work' | 'about';
  label: string;
  title: string;
  chapter?: Work['chapter'];
  work?: Work;
};

const scenes: Scene[] = [
  { id: 'cover', kind: 'cover', label: '序幕', title: '线迹之间' },
  ...exhibitionGroups.flatMap((group) => {
    const info = chapterInfo[group.chapter];
    return [
      {
        id: `chapter-${group.chapter}`,
        kind: 'chapter' as const,
        label: info.label,
        title: info.title,
        chapter: group.chapter,
      },
      ...group.slugs.map((slug) => {
        const work = getWork(slug)!;
        const workIndex = exhibitionWorks.findIndex((item) => item.slug === slug);
        return {
          id: work.slug,
          kind: 'work' as const,
          label: `${info.label} · ${String(workIndex + 1).padStart(2, '0')} / 16`,
          title: work.title,
          chapter: group.chapter,
          work,
        };
      }),
    ];
  }),
  { id: 'about', kind: 'about', label: '尾声', title: '纸面没有边界' },
];

type DepthStyle = CSSProperties & {
  '--depth-offset': number;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => void;
};

function WorkDialog({
  work,
  onClose,
  onMove,
  closeRef,
}: {
  work: Work;
  onClose: () => void;
  onMove: (direction: number) => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <dialog open className="lightbox depth-lightbox" aria-modal="true" aria-labelledby="lightbox-title">
      <div className="depth-lightbox-veil" aria-hidden="true" />
      <button
        ref={closeRef}
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label="关闭作品查看"
      >
        <X size={20} />
      </button>

      <div className="lightbox-image" key={`image-${work.slug}`}>
        <Image
          src={withBasePath(work.image.large)}
          alt={work.alt}
          fill
          preload
          sizes="(max-width: 800px) 100vw, 76vw"
        />
      </div>

      <aside className="lightbox-copy" key={`copy-${work.slug}`}>
        <p className="lightbox-count">{work.number} / {String(works.length).padStart(2, '0')}</p>
        <h2 id="lightbox-title">{work.title}</h2>
        <p className="work-english">{work.englishTitle}</p>
        <p>{work.note}</p>
        {work.context && <p className="context-note">{work.context}</p>}
        <a href={withBasePath(`/works/${work.slug}/`)} className="lightbox-detail">
          阅读完整作品解读 <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </aside>

      <div className="lightbox-nav" aria-label="切换作品">
        <button type="button" onClick={() => onMove(-1)} aria-label="上一幅作品">
          <ChevronLeft size={22} />
        </button>
        <button type="button" onClick={() => onMove(1)} aria-label="下一幅作品">
          <ChevronRight size={22} />
        </button>
      </div>
    </dialog>
  );
}

function ArtworkScene({
  work,
  sequence,
  offset,
  onOpen,
  dialogOpen,
}: {
  work: Work;
  sequence: number;
  offset: number;
  onOpen: (slug: string) => void;
  dialogOpen: boolean;
}) {
  const chapter = chapterInfo[work.chapter];
  const nearViewport = Math.abs(offset) <= 1;

  return (
    <div className={`depth-work-layout ${sequence % 2 === 0 ? 'is-reverse' : ''}`}>
      <button
        type="button"
        className="depth-work-art"
        onClick={() => onOpen(work.slug)}
        aria-label={`放大查看《${work.title}》`}
      >
        <span
          className="depth-work-art-surface"
          style={{ viewTransitionName: offset === 0 && !dialogOpen ? 'gallery-artwork' : 'none' }}
        >
          <Image
            src={withBasePath(nearViewport ? work.image.large : work.image.thumb)}
            alt={work.alt}
            fill
            loading="eager"
            decoding="sync"
            sizes="(max-width: 720px) 100vw, 64vw"
          />
          <span className="depth-work-glint" aria-hidden="true" />
        </span>
        <span><Maximize2 size={14} aria-hidden="true" /> 查看细节</span>
      </button>

      <article className="depth-work-copy">
        <p>{chapter.english} · {chapter.label}</p>
        <span className="depth-work-sequence">{String(sequence).padStart(2, '0')} / 16</span>
        <h2>{work.title}</h2>
        <i>{work.englishTitle}</i>
        <strong>{work.short}</strong>
        <span className="depth-work-note">{work.note.split('。')[0]}。</span>
        {work.context && <small>{work.context}</small>}
        <button type="button" onClick={() => onOpen(work.slug)}>
          放大作品与说明 <ArrowUpRight size={15} aria-hidden="true" />
        </button>
      </article>

      <span className="depth-work-watermark" aria-hidden="true">
        {String(sequence).padStart(2, '0')}
      </span>
    </div>
  );
}

export default function GalleryExperience() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [showOpening, setShowOpening] = useState(true);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const transitionLock = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const openWork = useMemo(() => (openSlug ? getWork(openSlug) : undefined), [openSlug]);
  const openIndex = openWork ? exhibitionWorks.findIndex((work) => work.slug === openWork.slug) : -1;
  const coverWork = getWork('08-night-sea')!;
  const activeScene = scenes[sceneIndex];
  const activeArtworkSlug = activeScene?.kind === 'work' && activeScene.work ? activeScene.work.slug : null;
  const soundtrackPlayback = useArtworkAudio({ slug: activeArtworkSlug });

  const runViewTransition = useCallback((update: () => void) => {
    const viewTransitionDocument = document as ViewTransitionDocument;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!viewTransitionDocument.startViewTransition || reduceMotion) {
      update();
      return;
    }

    viewTransitionDocument.startViewTransition(() => {
      flushSync(update);
    });
  }, []);

  const openArtwork = useCallback((slug: string) => {
    runViewTransition(() => setOpenSlug(slug));
  }, [runViewTransition]);

  const closeArtwork = useCallback(() => {
    runViewTransition(() => setOpenSlug(null));
  }, [runViewTransition]);

  const goToScene = useCallback((target: number) => {
    if (transitionLock.current) return;
    const next = Math.max(0, Math.min(scenes.length - 1, target));
    if (next === sceneIndex) return;

    const nextScene = scenes[next];
    setDirection(next > sceneIndex ? 'forward' : 'backward');

    transitionLock.current = true;
    setSceneIndex(next);
    window.history.replaceState(null, '', next === 0 ? window.location.pathname : `#${nextScene.id}`);
    window.setTimeout(() => {
      transitionLock.current = false;
    }, 760);
  }, [sceneIndex]);

  const moveWork = useCallback((direction: number) => {
    if (openIndex < 0) return;
    const next = (openIndex + direction + exhibitionWorks.length) % exhibitionWorks.length;
    setOpenSlug(exhibitionWorks[next].slug);
  }, [openIndex]);

  useEffect(() => {
    const syncSceneFromHash = () => {
      const requestedIndex = scenes.findIndex((scene) => window.location.hash === `#${scene.id}`);
      if (requestedIndex < 0) return;
      transitionLock.current = false;
      setSceneIndex(requestedIndex);
    };

    syncSceneFromHash();
    window.addEventListener('hashchange', syncSceneFromHash);
    return () => window.removeEventListener('hashchange', syncSceneFromHash);
  }, []);

  useEffect(() => {
    const deepLink = window.location.hash.length > 1;
    const hasSeenOpening = window.sessionStorage.getItem('xianji-opening-seen') === '1';

    if (deepLink || hasSeenOpening || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShowOpening(false);
      return;
    }

    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem('xianji-opening-seen', '1');
      setShowOpening(false);
    }, 1850);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (openWork || Math.abs(event.deltaY) < 18) return;
      event.preventDefault();
      goToScene(sceneIndex + (event.deltaY > 0 ? 1 : -1));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (openWork) {
        if (event.key === 'Escape') closeArtwork();
        if (event.key === 'ArrowLeft') moveWork(-1);
        if (event.key === 'ArrowRight') moveWork(1);
        return;
      }

      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault();
        goToScene(sceneIndex + 1);
      }
      if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        goToScene(sceneIndex - 1);
      }
      if (event.key === 'Home') goToScene(0);
      if (event.key === 'End') goToScene(scenes.length - 1);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [closeArtwork, goToScene, moveWork, openWork, sceneIndex]);

  useEffect(() => {
    if (openWork) closeRef.current?.focus();
  }, [openWork]);

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') {
      touchStart.current = { x: event.clientX, y: event.clientY };
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'touch' || !touchStart.current || openWork) return;
    const deltaX = event.clientX - touchStart.current.x;
    const deltaY = event.clientY - touchStart.current.y;
    touchStart.current = null;
    const dominant = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
    if (Math.abs(dominant) >= 42) goToScene(sceneIndex + (dominant < 0 ? 1 : -1));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch' || !experienceRef.current) return;
    const x = (event.clientX / window.innerWidth - .5) * 2;
    const y = (event.clientY / window.innerHeight - .5) * 2;
    experienceRef.current.style.setProperty('--parallax-x', `${x * 3}px`);
    experienceRef.current.style.setProperty('--parallax-y', `${y * 2}px`);
    experienceRef.current.style.setProperty('--tilt-x', `${y * -.22}deg`);
    experienceRef.current.style.setProperty('--tilt-y', `${x * .26}deg`);
    experienceRef.current.style.setProperty('--light-x', `${50 + x * 16}%`);
    experienceRef.current.style.setProperty('--light-y', `${45 + y * 12}%`);
  };

  const resetPointerMotion = () => {
    if (!experienceRef.current) return;
    experienceRef.current.style.setProperty('--parallax-x', '0px');
    experienceRef.current.style.setProperty('--parallax-y', '0px');
    experienceRef.current.style.setProperty('--tilt-x', '0deg');
    experienceRef.current.style.setProperty('--tilt-y', '0deg');
    experienceRef.current.style.setProperty('--light-x', '50%');
    experienceRef.current.style.setProperty('--light-y', '45%');
  };

  const sceneState = (index: number) => {
    const offset = index - sceneIndex;
    if (offset < 0) return 'past';
    if (offset === 0) return 'current';
    if (offset === 1) return 'next';
    return 'far';
  };

  const upcomingScene = scenes[sceneIndex + 1];
  const upcomingPreview = upcomingScene?.work ?? (
    upcomingScene?.chapter ? getWork(chapterInfo[upcomingScene.chapter].coverSlug) : undefined
  );

  return (
    <main
      ref={experienceRef}
      className="depth-experience"
      data-direction={direction}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointerMotion}
    >
      {showOpening && (
        <div className="depth-opening" aria-hidden="true">
          <span className="depth-opening-line" />
          <span className="depth-opening-title">线迹之间</span>
          <span className="depth-opening-subtitle">BETWEEN THE TRACES</span>
        </div>
      )}

      <header className="depth-header">
        <button type="button" className="depth-wordmark" onClick={() => goToScene(0)}>
          线迹之间
        </button>
        <span>{scenes[sceneIndex].label} · {scenes[sceneIndex].title}</span>
        <a href={withBasePath('/gallery/')}>
          3D 白盒子 <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </header>

      <SoundtrackButton
        soundtrack={soundtrackPlayback.soundtrack}
        status={soundtrackPlayback.status}
        onToggle={soundtrackPlayback.toggle}
        className="depth-floating-soundtrack"
      />

      <div className="depth-stage" aria-live="polite">
        {scenes.map((scene, index) => {
          const offset = index - sceneIndex;

          // Keep only the transition neighbors mounted. Holding every full-screen
          // artwork in the DOM exhausts decoded-image and compositor memory on phones.
          if (Math.abs(offset) > 1) return null;

          if (scene.kind === 'cover') {
            return (
              <section
                key={scene.id}
                className="depth-panel depth-cover"
                data-state={sceneState(index)}
                style={{ '--depth-offset': offset } as DepthStyle}
                aria-hidden={sceneIndex !== index}
                inert={sceneIndex !== index ? true : undefined}
              >
                <figure className="depth-cover-image">
                  <Image
                    src={withBasePath(coverWork.image.large)}
                    alt={coverWork.alt}
                    fill
                    loading="eager"
                    sizes="100vw"
                  />
                </figure>
                <div className="depth-cover-shade" />
                <div className="depth-cover-copy">
                  <p>ONLINE EXHIBITION · 16 WORKS · 2026</p>
                  <h1>线迹之间<span>我所看见的，与看见我的</span></h1>
                  <p className="depth-intro">
                    16 幅作品，一次只与你面对一幅。每次推进，下一张画会从纸面深处来到眼前。
                  </p>
                  <button type="button" className="depth-enter" onClick={() => goToScene(1)}>
                    进入序章 <ArrowRight size={18} aria-hidden="true" />
                  </button>
                </div>
                <p className="depth-gesture">滚轮 · 轻扫 · 方向键　逐幅推进</p>
              </section>
            );
          }

          if (scene.kind === 'chapter' && scene.chapter) {
            const info = chapterInfo[scene.chapter];
            const chapterCover = getWork(info.coverSlug)!;
            const chapterCount = exhibitionGroups.find((group) => group.chapter === scene.chapter)?.slugs.length ?? 0;

            return (
              <section
                key={scene.id}
                className={`depth-panel depth-chapter-intro depth-chapter-intro-${scene.chapter}`}
                data-state={sceneState(index)}
                style={{ '--depth-offset': offset } as DepthStyle}
                aria-hidden={sceneIndex !== index}
                inert={sceneIndex !== index ? true : undefined}
              >
                <figure className="depth-chapter-intro-art">
                  <picture>
                    <source media="(max-width: 650px)" srcSet={withBasePath(chapterCover.image.thumb)} />
                    <Image
                      src={withBasePath(chapterCover.image.large)}
                      alt=""
                      fill
                      loading="eager"
                      decoding="sync"
                      sizes="62vw"
                    />
                  </picture>
                  <span aria-hidden="true" />
                </figure>
                <div className="depth-chapter-intro-copy">
                  <p>{info.english} · {info.label}</p>
                  <span className="depth-chapter-number">{info.number}</span>
                  <h2>{info.title}</h2>
                  <strong>{info.intro}</strong>
                  <span className="depth-chapter-count">{String(chapterCount).padStart(2, '0')} WORK{chapterCount > 1 ? 'S' : ''}</span>
                  <button type="button" onClick={() => goToScene(index + 1)}>
                    进入本章 <ArrowRight size={17} aria-hidden="true" />
                  </button>
                </div>
                <span className="depth-chapter-trace" aria-hidden="true" />
              </section>
            );
          }

          if (scene.kind === 'work' && scene.work) {
            const workSequence = exhibitionWorks.findIndex((work) => work.slug === scene.work?.slug) + 1;
            return (
              <section
                key={scene.id}
                className={`depth-panel depth-work depth-work-${scene.work.chapter}`}
                data-accent={scene.work.accent}
                data-work={scene.work.slug}
                data-state={sceneState(index)}
                style={{ '--depth-offset': offset } as DepthStyle}
                aria-hidden={sceneIndex !== index}
                inert={sceneIndex !== index ? true : undefined}
              >
                <ArtworkScene
                  work={scene.work}
                  sequence={workSequence}
                  offset={offset}
                  onOpen={openArtwork}
                  dialogOpen={Boolean(openSlug)}
                />
              </section>
            );
          }

          return (
            <section
              key={scene.id}
              className="depth-panel depth-about"
              data-state={sceneState(index)}
              style={{ '--depth-offset': offset } as DepthStyle}
              aria-hidden={sceneIndex !== index}
              inert={sceneIndex !== index ? true : undefined}
            >
              <div className="depth-about-mark" aria-hidden="true">○</div>
              <div className="depth-about-copy">
                <p>EPILOGUE · 尾声</p>
                <h2>纸面没有边界</h2>
                <span>
                  16 幅作品已经逐一与你相遇。现在可以进入白盒空间，自由走回任何一幅画前。
                </span>
                <a href={withBasePath('/gallery/')} className="depth-gallery-link">
                  <span className="depth-gallery-door" aria-hidden="true"><i /></span>
                  <span>穿过空间门<br /><b>进入 3D 白盒子漫游</b></span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                <button type="button" onClick={() => goToScene(0)} className="depth-restart">
                  从第一幅重新观看
                </button>
              </div>
              <div className="depth-about-numbers" aria-label="展览信息">
                <span><b>16</b> 幅作品</span>
                <span><b>01</b> 次相遇</span>
                <span><b>∞</b> 条路径</span>
              </div>
            </section>
          );
        })}
      </div>

      <nav className="depth-progress depth-progress-works" aria-label="展页导航">
        {scenes.map((scene, index) => (
          <button
            type="button"
            onClick={() => goToScene(index)}
            className={index === sceneIndex ? 'is-current' : ''}
            aria-label={`前往${scene.label}：${scene.title}`}
            aria-current={index === sceneIndex ? 'step' : undefined}
            key={scene.id}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </nav>

      <div className="depth-controls">
        <button type="button" onClick={() => goToScene(sceneIndex - 1)} disabled={sceneIndex === 0} aria-label="上一幅">
          <ArrowLeft size={17} />
        </button>
        <span>{String(sceneIndex + 1).padStart(2, '0')} / {String(scenes.length).padStart(2, '0')}</span>
        <button type="button" onClick={() => goToScene(sceneIndex + 1)} disabled={sceneIndex === scenes.length - 1} aria-label="下一幅">
          <ArrowRight size={17} />
        </button>
      </div>

      {upcomingScene && (
        <button type="button" className="depth-next-portal" onClick={() => goToScene(sceneIndex + 1)}>
          {upcomingPreview && (
            <span className="depth-next-preview" aria-hidden="true">
              <Image src={withBasePath(upcomingPreview.image.thumb)} alt="" fill sizes="80px" />
            </span>
          )}
          <span className="depth-next-copy">
            <small>{upcomingScene.kind === 'work' ? '下一幅作品' : '下一展页'} · {String(sceneIndex + 2).padStart(2, '0')}</small>
            <strong>{upcomingScene.title}</strong>
          </span>
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      )}

      {openWork && (
        <WorkDialog
          work={openWork}
          onClose={closeArtwork}
          onMove={moveWork}
          closeRef={closeRef}
        />
      )}
    </main>
  );
}
