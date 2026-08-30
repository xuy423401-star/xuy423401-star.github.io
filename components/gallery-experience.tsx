'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Grid3X3, Maximize2, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { chapters, getWork, works, type Work } from '@/lib/works';

function WorkPanel({
  work,
  index,
  onOpen,
}: {
  work: Work;
  index: number;
  onOpen: (slug: string) => void;
}) {
  const portrait = work.height > work.width * 1.08;

  return (
    <article
      className={`work-panel work-panel-${index % 5} ${portrait ? 'is-portrait' : 'is-landscape'}`}
      data-accent={work.accent}
    >
      <figure className="work-figure">
        <button
          type="button"
          className="work-open"
          onClick={() => onOpen(work.slug)}
          aria-label={`放大查看《${work.title}》`}
        >
          <Image
            src={work.image.large}
            alt={work.alt}
            width={work.width}
            height={work.height}
            sizes={portrait ? '(max-width: 760px) 90vw, 47vw' : '(max-width: 760px) 92vw, 70vw'}
          />
          <span className="zoom-cue" aria-hidden="true">
            <Maximize2 size={15} />
            查看细节
          </span>
        </button>
      </figure>

      <div className="work-caption">
        <span className="work-number">{work.number}</span>
        <div>
          <h3>{work.title}</h3>
          <p className="work-english">{work.englishTitle}</p>
        </div>
        <p className="work-short">{work.short}</p>
        <Link className="detail-link" href={`/works/${work.slug}`}>
          作品详情 <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function GalleryExperience() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const openWork = useMemo(() => (openSlug ? getWork(openSlug) : undefined), [openSlug]);
  const openIndex = openWork ? works.findIndex((work) => work.slug === openWork.slug) : -1;

  const moveLightbox = (direction: number) => {
    if (openIndex < 0) return;
    const next = (openIndex + direction + works.length) % works.length;
    setOpenSlug(works[next].slug);
  };

  useEffect(() => {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      progressRef.current?.style.setProperty('--scroll-progress', `${ratio * 100}%`);
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  useEffect(() => {
    if (!openWork) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenSlug(null);
      if (event.key === 'ArrowLeft') moveLightbox(-1);
      if (event.key === 'ArrowRight') moveLightbox(1);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [openSlug]);

  const prologue = getWork('08-night-sea')!;

  return (
    <main id="top">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="线迹之间，返回展览封面">
          线迹之间
        </a>
        <nav aria-label="主要导航">
          <Link href="/gallery">3D 展厅</Link>
          <a href="#exhibition">策展路线</a>
          <a href="#atlas">作品图谱</a>
        </nav>
        <span className="edition">ONLINE EXHIBITION · 2026</span>
      </header>

      <div className="scroll-trace" aria-hidden="true">
        <span ref={progressRef} />
      </div>

      <section className="hero" aria-labelledby="exhibition-title">
        <div className="hero-copy">
          <p className="eyebrow">16 幅纸上世界的夜游</p>
          <h1 id="exhibition-title">
            线迹之间
            <span>我所看见的，</span>
            <span>与看见我的</span>
          </h1>
          <p className="hero-intro">
            一根线穿过夜、目光、动物与记忆。沿着它走，纸上的世界会一页页醒来。
          </p>
          <div className="hero-actions">
            <Link className="enter-link" href="/gallery">
              <span>进入 3D 白盒子</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <a className="scroll-link" href="#exhibition">
              <span>沿策展长卷浏览</span>
              <ArrowDown size={15} aria-hidden="true" />
            </a>
          </div>
        </div>

        <figure className="hero-art">
          <Image
            src={prologue.image.large}
            alt={prologue.alt}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 68vw"
          />
          <figcaption>
            <span>{prologue.number}</span>
            <span>{prologue.title} · PROLOGUE</span>
          </figcaption>
        </figure>
        <span className="hero-coordinate" aria-hidden="true">31°N / PAPER / INK</span>
      </section>

      <section className="prologue" id="exhibition" aria-labelledby="prologue-title">
        <p className="section-kicker">PROLOGUE · 序章</p>
        <h2 id="prologue-title">一根线进入夜</h2>
        <p>{prologue.note}</p>
        <button type="button" className="prologue-detail" onClick={() => setOpenSlug(prologue.slug)}>
          <span>查看序章作品</span>
          <Maximize2 size={15} aria-hidden="true" />
        </button>
      </section>

      {chapters.map((chapter, chapterIndex) => (
        <section
          className={`chapter chapter-${chapter.id}`}
          id={chapter.id}
          key={chapter.id}
          aria-labelledby={`chapter-${chapter.id}-title`}
        >
          <header className="chapter-header">
            <div className="chapter-meta">
              <span>CHAPTER {chapter.number}</span>
              <span>{chapter.english}</span>
            </div>
            <h2 id={`chapter-${chapter.id}-title`}>{chapter.title}</h2>
            <p>{chapter.intro}</p>
            <span className="chapter-mark" aria-hidden="true">
              {chapterIndex === 0 ? '●' : chapterIndex === 1 ? '□' : '○'}
            </span>
          </header>

          <div className="works-stage">
            {chapter.slugs.map((slug, index) => {
              const work = getWork(slug)!;
              return <WorkPanel key={slug} work={work} index={index} onOpen={setOpenSlug} />;
            })}
          </div>
        </section>
      ))}

      <section className="atlas" id="atlas" aria-labelledby="atlas-title">
        <header className="atlas-header">
          <div>
            <p className="section-kicker">ATLAS · 作品图谱</p>
            <h2 id="atlas-title">所有线仍在继续</h2>
          </div>
          <p>从策展路线离开，按自己的顺序重新观看。每一幅作品都是另一条入口。</p>
        </header>

        <div className="atlas-grid">
          {works.map((work) => (
            <button
              type="button"
              className="atlas-item"
              data-accent={work.accent}
              onClick={() => setOpenSlug(work.slug)}
              key={work.slug}
              aria-label={`打开《${work.title}》`}
            >
              <span className="atlas-image">
                <Image
                  src={work.image.thumb}
                  alt=""
                  fill
                  sizes="(max-width: 600px) 46vw, (max-width: 1000px) 30vw, 23vw"
                />
              </span>
              <span className="atlas-label">
                <span>{work.number}</span>
                <span>{work.title}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="about" id="about" aria-labelledby="about-title">
        <div className="about-heading">
          <p className="section-kicker">ABOUT · 关于</p>
          <h2 id="about-title">纸面没有边界</h2>
        </div>
        <div className="about-copy">
          <p>
            这场展览收录 16 幅纸上作品。它们没有共享单一题材，却都从线条开始：线条成为目光、毛发、波浪、枝条、文字，也成为通往另一幅画的道路。
          </p>
          <p>
            展览保留纸张、折痕和手工痕迹。观看不要求从“正确答案”开始，只邀请你在熟悉与陌生之间多停留一会。
          </p>
        </div>
        <div className="about-index" aria-label="展览信息">
          <span><b>16</b> 件作品</span>
          <span><b>03</b> 个章节</span>
          <span><b>01</b> 条未完成的线</span>
        </div>
      </section>

      <footer className="site-footer">
        <a href="#top">返回夜的入口 ↑</a>
        <p>《线迹之间》· ONLINE EXHIBITION · 2026</p>
        <Grid3X3 size={18} aria-hidden="true" />
      </footer>

      {openWork && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpenSlug(null);
          }}
        >
          <button
            ref={closeRef}
            type="button"
            className="lightbox-close"
            onClick={() => setOpenSlug(null)}
            aria-label="关闭作品查看"
          >
            <X size={20} />
          </button>

          <div className="lightbox-image">
            <Image
              src={openWork.image.large}
              alt={openWork.alt}
              fill
              priority
              sizes="(max-width: 800px) 100vw, 76vw"
            />
          </div>

          <aside className="lightbox-copy">
            <p className="lightbox-count">{openWork.number} / {String(works.length).padStart(2, '0')}</p>
            <h2 id="lightbox-title">{openWork.title}</h2>
            <p className="work-english">{openWork.englishTitle}</p>
            <p>{openWork.note}</p>
            {openWork.context && <p className="context-note">{openWork.context}</p>}
            <Link href={`/works/${openWork.slug}`} className="lightbox-detail">
              打开作品页 <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </aside>

          <div className="lightbox-nav" aria-label="切换作品">
            <button type="button" onClick={() => moveLightbox(-1)} aria-label="上一幅作品">
              <ChevronLeft size={22} />
            </button>
            <button type="button" onClick={() => moveLightbox(1)} aria-label="下一幅作品">
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
