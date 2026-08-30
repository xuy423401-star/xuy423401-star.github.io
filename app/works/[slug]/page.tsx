import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react';
import { getWork, works } from '@/lib/works';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return {};

  return {
    title: `${work.title}｜线迹之间`,
    description: work.short,
    openGraph: {
      title: `${work.title}｜线迹之间`,
      description: work.short,
      type: 'article',
      images: [
        {
          url: work.image.large,
          width: work.width,
          height: work.height,
          alt: work.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${work.title}｜线迹之间`,
      description: work.short,
      images: [work.image.large],
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  const index = works.findIndex((item) => item.slug === work.slug);
  const previous = works[(index - 1 + works.length) % works.length];
  const next = works[(index + 1) % works.length];

  return (
    <main className="detail-page" data-accent={work.accent}>
      <header className="detail-header">
        <Link href="/#atlas" className="detail-back">
          <ArrowLeft size={16} aria-hidden="true" />
          返回作品图谱
        </Link>
        <Link href="/" className="detail-wordmark">线迹之间</Link>
        <span>WORK {work.number} / {String(works.length).padStart(2, '0')}</span>
      </header>

      <article className="detail-layout">
        <figure className="detail-art">
          <a href={work.image.large} target="_blank" rel="noreferrer" aria-label={`在新窗口打开《${work.title}》高清图`}>
            <Image
              src={work.image.large}
              alt={work.alt}
              width={work.width}
              height={work.height}
              priority
              sizes="(max-width: 900px) 100vw, 64vw"
            />
            <span className="detail-zoom"><Maximize2 size={15} /> 打开高清图</span>
          </a>
        </figure>

        <section className="detail-copy" aria-labelledby="work-title">
          <p className="detail-number">{work.number}</p>
          <h1 id="work-title">{work.title}</h1>
          <p className="work-english">{work.englishTitle}</p>
          <p className="detail-short">{work.short}</p>
          <p className="detail-note">{work.note}</p>
          {work.context && <p className="context-note">{work.context}</p>}
          <dl>
            <div><dt>类型</dt><dd>纸上作品</dd></div>
            <div><dt>展览</dt><dd>《线迹之间》</dd></div>
            <div><dt>编号</dt><dd>{work.number} / {String(works.length).padStart(2, '0')}</dd></div>
          </dl>
        </section>
      </article>

      <nav className="detail-navigation" aria-label="前后作品">
        <Link href={`/works/${previous.slug}`}>
          <ArrowLeft size={18} aria-hidden="true" />
          <span><small>上一幅</small>{previous.title}</span>
        </Link>
        <Link href={`/works/${next.slug}`}>
          <span><small>下一幅</small>{next.title}</span>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </nav>
    </main>
  );
}
