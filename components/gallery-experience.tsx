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

const scenes = [
  { id: 'cover', label: '序幕', title: '线迹之间' },
  { id: 'prologue', label: '序章', title: '一根线进入夜' },
  { id: 'gaze', label: '第一章', title: '凝视' },
  { id: 'borrowed', label: '第二章', title: '借来的世界' },
  { id: 'cycle', label: '第三章', title: '生长与消逝' },
  { id: 'atlas', label: '作品图谱', title: '所有线仍在继续' },
  { id: 'about', label: '尾声', title: '纸面没有边界' },
] as const;

type DepthStyle = CSSProperties & {
  '--depth-offset': number;
};

function ChapterScene({
  chapter,
  onOpen,
}: {
  chapter: (typeof chapters)[number];
  onOpen: (slug: string) => void;
}) {
  const chapterWorks = chapter.slugs.map((slug) => getWork(slug)!);

  return (
    <div className="depth-chapter-layout">
      <header className="depth-chapter-copy">
        <p>CHAPTER {chapter.number} · {chapter.english}</p>
        <h2>{chapter.title}</h2>
        <span>{chapter.intro}</span>
      </header>

      <div className="depth-art-grid">
        {chapterWorks.map((work, index) => (
          <button
            type="button"
            className={`depth-art-card depth-art-card-${index + 1}`}
            onClick={() => onOpen(work.slug)}
            key={work.slug}
            aria-label={`查看《${work.title}》`}
          >
            <span className="depth-art-image">
              <Image
                src={withBasePath(work.image.thumb)}
                alt={work.alt}
                fill
                sizes="(max-width: 720px) 44vw, 23vw"
              />
            </span>
            <span className="depth-art-caption">
              <b>{work.number}</b>
              <span>{work.title}</span>
              <i>{work.englishTitle}</i>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

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
          打开作品页 <ArrowUpRight size={15} aria-hidden="true" />
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

export default function GalleryExperience() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const transitionLock = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openWork = useMemo(() => (openSlug ? getWork(openSlug) : undefined), [openSlug]);
  const openIndex = openWork ? works.findIndex((work) => work.slug === openWork.slug) : -1;
  const prologue = getWork('08-night-sea')!;

  const goToScene = useCallback((target: number) => {
    if (transitionLock.current) return;
    const next = Math.max(0, Math.min(scenes.length - 1, target));
    if (next === sceneIndex) return;

    transitionLock.current = true;
    setSceneIndex(next);
    window.setTimeout(() => {
      transitionLock.current = false;
    }, 920);
  }, [sceneIndex]);

  const moveWork = useCallback((direction: number) => {
    if (openIndex < 0) return;
    const next = (openIndex + direction + works.length) % works.length;
    setOpenSlug(works[next].slug);
  }, [openIndex]);

  useEffect(() => {
    const requestedIndex = scenes.findIndex((scene) => window.location.hash === `#${scene.id}`);
    if (requestedIndex > 0) setSceneIndex(requestedIndex);
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
    if (event.pointerType !== 'touch') return;
    touchStart.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'touch' || !touchStart.current || openWork) return;
    const deltaX = event.clientX - touchStart.current.x;
    const deltaY = event.clientY - touchStart.current.y;
    touchStart.current = null;
    const dominant = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
    if (Math.abs(dominant) < 42) return;
    goToScene(sceneIndex + (dominant < 0 ? 1 : -1));
  };

  const sceneState = (index: number) => {
    const offset = index - sceneIndex;
    if (offset < 0) return 'past';
    if (offset === 0) return 'current';
    if (offset === 1) return 'next';
    return 'far';
  };

  return (
    <main
      className="depth-experience"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
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
        <section
          className="depth-panel depth-cover"
          data-state={sceneState(0)}
          style={{ '--depth-offset': 0 - sceneIndex } as DepthStyle}
          aria-hidden={sceneIndex !== 0}
          inert={sceneIndex !== 0 ? true : undefined}
        >
          <figure className="depth-cover-image">
            <Image src={withBasePath(prologue.image.large)} alt={prologue.alt} fill preload sizes="100vw" />
          </figure>
          <div className="depth-cover-shade" />
          <div className="depth-cover-copy">
            <p>ONLINE EXHIBITION · 16 WORKS · 2026</p>
            <h1>
              线迹之间
              <span>我所看见的，与看见我的</span>
            </h1>
            <p className="depth-intro">
              一根线穿过夜、目光、动物与记忆。不是向下翻阅，而是向纸面深处进入。
            </p>
            <button type="button" className="depth-enter" onClick={() => goToScene(1)}>
              向展览深处进入 <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
          <p className="depth-gesture">滚轮 · 轻扫 · 方向键　推进展页</p>
        </section>

        <section
          className="depth-panel depth-prologue"
          data-state={sceneState(1)}
          style={{ '--depth-offset': 1 - sceneIndex } as DepthStyle}
          aria-hidden={sceneIndex !== 1}
          inert={sceneIndex !== 1 ? true : undefined}
        >
          <div className="depth-prologue-copy">
            <p>PROLOGUE · 序章</p>
            <h2>一根线<br />进入夜</h2>
            <span>{prologue.note}</span>
            <button type="button" onClick={() => setOpenSlug(prologue.slug)}>
              查看《{prologue.title}》细节 <Maximize2 size={15} aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            className="depth-prologue-art"
            onClick={() => setOpenSlug(prologue.slug)}
            aria-label={`查看《${prologue.title}》`}
          >
            <Image
              src={withBasePath(prologue.image.large)}
              alt={prologue.alt}
              fill
              sizes="(max-width: 760px) 90vw, 60vw"
            />
            <span>08 · 夜海 / NIGHT SEA</span>
          </button>
        </section>

        {chapters.map((chapter, chapterIndex) => {
          const index = chapterIndex + 2;
          return (
            <section
              className={`depth-panel depth-chapter depth-chapter-${chapter.id}`}
              data-state={sceneState(index)}
              style={{ '--depth-offset': index - sceneIndex } as DepthStyle}
              aria-hidden={sceneIndex !== index}
              inert={sceneIndex !== index ? true : undefined}
              key={chapter.id}
            >
              <ChapterScene chapter={chapter} onOpen={setOpenSlug} />
            </section>
          );
        })}

        <section
          className="depth-panel depth-atlas"
          data-state={sceneState(5)}
          style={{ '--depth-offset': 5 - sceneIndex } as DepthStyle}
          aria-hidden={sceneIndex !== 5}
          inert={sceneIndex !== 5 ? true : undefined}
        >
          <header className="depth-atlas-heading">
            <p>ATLAS · 作品图谱</p>
            <h2>所有线仍在继续</h2>
            <span>选择任意一幅作品，让它从图谱中靠近你。</span>
          </header>
          <div className="depth-atlas-grid">
            {works.map((work) => (
              <button
                type="button"
                onClick={() => setOpenSlug(work.slug)}
                key={work.slug}
                aria-label={`打开《${work.title}》`}
              >
                <span>
                  <Image
                    src={withBasePath(work.image.thumb)}
                    alt=""
                    fill
                    sizes="(max-width: 600px) 22vw, 11vw"
                  />
                </span>
                <b>{work.number}</b>
                <i>{work.title}</i>
              </button>
            ))}
          </div>
        </section>

        <section
          className="depth-panel depth-about"
          data-state={sceneState(6)}
          style={{ '--depth-offset': 6 - sceneIndex } as DepthStyle}
          aria-hidden={sceneIndex !== 6}
          inert={sceneIndex !== 6 ? true : undefined}
        >
          <div className="depth-about-mark" aria-hidden="true">○</div>
          <div className="depth-about-copy">
            <p>EPILOGUE · 尾声</p>
            <h2>纸面没有边界</h2>
            <span>
              这场展览收录 16 幅纸上作品。它们从线条开始，又在你的观看中继续。现在，你可以进入真正的白盒空间，自由选择下一条路。
            </span>
            <a href={withBasePath('/gallery/')} className="depth-gallery-link">
              进入 3D 白盒子漫游 <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <button type="button" onClick={() => goToScene(0)} className="depth-restart">
              从序幕重新进入
            </button>
          </div>
          <div className="depth-about-numbers" aria-label="展览信息">
            <span><b>16</b> 件作品</span>
            <span><b>03</b> 个章节</span>
            <span><b>01</b> 条未完成的线</span>
          </div>
        </section>
      </div>

      <nav className="depth-progress" aria-label="展页导航">
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
        <button
          type="button"
          onClick={() => goToScene(sceneIndex - 1)}
          disabled={sceneIndex === 0}
          aria-label="上一展页"
        >
          <ArrowLeft size={17} />
        </button>
        <span>{String(sceneIndex + 1).padStart(2, '0')} / {String(scenes.length).padStart(2, '0')}</span>
        <button
          type="button"
          onClick={() => goToScene(sceneIndex + 1)}
          disabled={sceneIndex === scenes.length - 1}
          aria-label="下一展页"
        >
          <ArrowRight size={17} />
        </button>
      </div>

      {sceneIndex < scenes.length - 1 && (
        <button type="button" className="depth-next-portal" onClick={() => goToScene(sceneIndex + 1)}>
          <span>下一展页 · {String(sceneIndex + 2).padStart(2, '0')}</span>
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
