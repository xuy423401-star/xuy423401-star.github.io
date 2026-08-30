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
import { chapters, getWork, works, type Work } from '@/lib/works';
import { withBasePath } from '@/lib/paths';

const chapterInfo = {
  prologue: { label: '序章', english: 'PROLOGUE', title: '一根线进入夜' },
  gaze: { label: '第一章', english: 'THE GAZE', title: '凝视' },
  borrowed: { label: '第二章', english: 'BORROWED WORLDS', title: '借来的世界' },
  cycle: { label: '第三章', english: 'GROWTH / AFTERLIFE', title: '生长与消逝' },
} as const;

const exhibitionOrder = [
  '08-night-sea',
  ...chapters.flatMap((chapter) => chapter.slugs),
];

const exhibitionWorks = exhibitionOrder.map((slug) => getWork(slug)!);

type Scene = {
  id: string;
  kind: 'cover' | 'work' | 'about';
  label: string;
  title: string;
  work?: Work;
};

const scenes: Scene[] = [
  { id: 'cover', kind: 'cover', label: '序幕', title: '线迹之间' },
  ...exhibitionWorks.map((work, index) => ({
    id: work.slug,
    kind: 'work' as const,
    label: `${chapterInfo[work.chapter].label} · ${String(index + 1).padStart(2, '0')} / 16`,
    title: work.title,
    work,
  })),
  { id: 'about', kind: 'about', label: '尾声', title: '纸面没有边界' },
];

type DepthStyle = CSSProperties & {
  '--depth-offset': number;
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
      <button
        ref={closeRef}
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label="关闭作品查看"
      >
        <X size={20} />
      </button>

      <div className="lightbox-image">
        <Image
          src={withBasePath(work.image.large)}
          alt={work.alt}
          fill
          preload
          sizes="(max-width: 800px) 100vw, 76vw"
        />
      </div>

      <aside className="lightbox-copy">
        <p className="lightbox-count">{work.number} / {String(works.length).padStart(2, '0')}</p>
        <h2 id="lightbox-title">{work.title}</h2>
        <p className="work-english">{work.englishTitle}</p>
        <p>{work.note}</p>
        {work.context && <p className="context-note">{work.context}</p>}
        <a href={withBasePath(`/works/${work.slug}/`)} className="lightbox-detail">
          打开独立作品页 <ArrowUpRight size={15} aria-hidden="true" />
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
}: {
  work: Work;
  sequence: number;
  offset: number;
  onOpen: (slug: string) => void;
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
        <Image
          src={withBasePath(nearViewport ? work.image.large : work.image.thumb)}
          alt={work.alt}
          fill
          preload={offset === 0}
          sizes="(max-width: 720px) 100vw, 64vw"
        />
        <span><Maximize2 size={14} aria-hidden="true" /> 查看细节</span>
      </button>

      <article className="depth-work-copy">
        <p>{chapter.english} · {chapter.label}</p>
        <span className="depth-work-sequence">{String(sequence).padStart(2, '0')} / 16</span>
        <h2>{work.title}</h2>
        <i>{work.englishTitle}</i>
        <strong>{work.short}</strong>
        <span className="depth-work-note">{work.note}</span>
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
  const transitionLock = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openWork = useMemo(() => (openSlug ? getWork(openSlug) : undefined), [openSlug]);
  const openIndex = openWork ? exhibitionWorks.findIndex((work) => work.slug === openWork.slug) : -1;
  const coverWork = getWork('08-night-sea')!;

  const goToScene = useCallback((target: number) => {
    if (transitionLock.current) return;
    const next = Math.max(0, Math.min(scenes.length - 1, target));
    if (next === sceneIndex) return;

    transitionLock.current = true;
    setSceneIndex(next);
    window.setTimeout(() => {
      transitionLock.current = false;
    }, 820);
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
    const onWheel = (event: WheelEvent) => {
      if (openWork || Math.abs(event.deltaY) < 18) return;
      event.preventDefault();
      goToScene(sceneIndex + (event.deltaY > 0 ? 1 : -1));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (openWork) {
        if (event.key === 'Escape') setOpenSlug(null);
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
  }, [goToScene, moveWork, openWork, sceneIndex]);

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

  const sceneState = (index: number) => {
    const offset = index - sceneIndex;
    if (offset < 0) return 'past';
    if (offset === 0) return 'current';
    if (offset === 1) return 'next';
    return 'far';
  };

  return (
    <main className="depth-experience" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
      <header className="depth-header">
        <button type="button" className="depth-wordmark" onClick={() => goToScene(0)}>
          线迹之间
        </button>
        <span>{scenes[sceneIndex].label} · {scenes[sceneIndex].title}</span>
        <a href={withBasePath('/gallery/')}>
          3D 白盒子 <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </header>

      <div className="depth-stage" aria-live="polite">
        {scenes.map((scene, index) => {
          const offset = index - sceneIndex;

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
                    从第一幅作品进入 <ArrowRight size={18} aria-hidden="true" />
                  </button>
                </div>
                <p className="depth-gesture">滚轮 · 轻扫 · 方向键　逐幅推进</p>
              </section>
            );
          }

          if (scene.kind === 'work' && scene.work) {
            return (
              <section
                key={scene.id}
                className={`depth-panel depth-work depth-work-${scene.work.chapter}`}
                data-accent={scene.work.accent}
                data-state={sceneState(index)}
                style={{ '--depth-offset': offset } as DepthStyle}
                aria-hidden={sceneIndex !== index}
                inert={sceneIndex !== index ? true : undefined}
              >
                <ArtworkScene
                  work={scene.work}
                  sequence={index}
                  offset={offset}
                  onOpen={setOpenSlug}
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
                  进入 3D 白盒子漫游 <ArrowUpRight size={18} aria-hidden="true" />
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

      {sceneIndex < scenes.length - 1 && (
        <button type="button" className="depth-next-portal" onClick={() => goToScene(sceneIndex + 1)}>
          <span>{scenes[sceneIndex + 1].kind === 'work' ? '下一幅作品' : '下一展页'} · {String(sceneIndex + 2).padStart(2, '0')}</span>
          <strong>{scenes[sceneIndex + 1].title}</strong>
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      )}

      {openWork && (
        <WorkDialog
          work={openWork}
          onClose={() => setOpenSlug(null)}
          onMove={moveWork}
          closeRef={closeRef}
        />
      )}
    </main>
  );
}
