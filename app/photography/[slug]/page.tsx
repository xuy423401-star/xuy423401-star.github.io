import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react';
import { getPhotographyWork, photographyWorks } from '@/lib/photography';
import { withBasePath } from '@/lib/paths';
import { notFound } from 'next/navigation';
import { StandalonePhotographyAudio } from '@/components/photography-audio';
import { photographyChapters } from '@/lib/photography';

export function generateStaticParams() {
  return photographyWorks.map(work => ({ slug: work.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const work = getPhotographyWork(slug);
  if (!work) return {};
  return { title: `${work.title}｜摄影展｜线迹之间`, description: work.short, openGraph: { title: `${work.title}｜摄影展｜线迹之间`, description: work.short, type: 'article', images: [{ url: withBasePath(work.file), width: work.width, height: work.height, alt: work.alt }] }, twitter: { card: 'summary_large_image', title: `${work.title}｜摄影展｜线迹之间`, description: work.short, images: [withBasePath(work.file)] } };
}

export default async function PhotographyWorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getPhotographyWork(slug);
  if (!work) notFound();
  const index = photographyWorks.findIndex(item => item.slug === work.slug);
  const previous = photographyWorks[(index - 1 + photographyWorks.length) % photographyWorks.length];
  const next = photographyWorks[(index + 1) % photographyWorks.length];

  return (
    <main className="photo-detail-page">
      <header className="photo-detail-header">
        <a href={withBasePath('/photography/')}><ArrowLeft size={16} aria-hidden="true" /> 返回摄影展</a>
        <a href={withBasePath('/')} className="photo-detail-wordmark">线迹之间</a>
        <span>PHOTO {work.number} / {String(photographyWorks.length).padStart(2, '0')}</span>
      </header>
      <article className="photo-detail-layout">
        <figure className="photo-detail-art">
          <a href={withBasePath(work.file)} target="_blank" rel="noreferrer" aria-label={`打开《${work.title}》高清图`}>
            <Image src={withBasePath(work.file)} alt={work.alt} width={work.width} height={work.height} priority sizes="(max-width: 900px) 100vw, 68vw" />
            <span><Maximize2 size={15} aria-hidden="true" /> 打开高清图</span>
          </a>
        </figure>
        <section className="photo-detail-copy">
          <p>{work.number} · 摄影展</p>
          <h1>{work.title}</h1>
          <i>{work.englishTitle}</i>
          <strong>{work.short}</strong>
          <p>{work.note}</p>
          <StandalonePhotographyAudio
            chapter={work.chapter}
            chapterIndex={photographyChapters.find(chapter => chapter.id === work.chapter)?.works.findIndex(item => item.slug === work.slug) ?? 0}
            chapterCount={photographyChapters.find(chapter => chapter.id === work.chapter)?.works.length ?? 0}
          />
          <dl><div><dt>类型</dt><dd>摄影作品</dd></div><div><dt>章节</dt><dd>{work.chapter}</dd></div><div><dt>编号</dt><dd>{work.number} / {String(photographyWorks.length).padStart(2, '0')}</dd></div></dl>
        </section>
      </article>
      <nav className="photo-detail-navigation" aria-label="前后摄影作品">
        <a href={withBasePath(`/photography/${previous.slug}/`)}><ArrowLeft size={18} aria-hidden="true" /><span><small>上一张</small>{previous.title}</span></a>
        <a href={withBasePath(`/photography/${next.slug}/`)}><span><small>下一张</small>{next.title}</span><ArrowRight size={18} aria-hidden="true" /></a>
      </nav>
    </main>
  );
}
