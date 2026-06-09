'use client';

import { useRouter } from 'next/navigation';
import type { DocPage } from '@/lib/docs';
import { MarkdownRenderer } from '@/lib/markdown-renderer';
import ReadingProgress from '@/components/blog/ReadingProgress';
import { siteConfig } from '@/config/site';

interface InsightPostContentProps {
  page: DocPage;
  readingTime: number;
}

export default function InsightPostContent({ page, readingTime }: InsightPostContentProps) {
  const router = useRouter();
  const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <ReadingProgress />

      <article className="brunch-article">
        <header className={`brunch-header ${page.heroImage ? 'relative isolate overflow-hidden' : ''}`}>
          {page.heroImage && (
            <div className="absolute inset-0 -z-10 h-[420px] opacity-45 dark:opacity-30">
              <img src={page.heroImage} alt="" className="h-full w-full scale-110 object-cover blur-2xl" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-white/85 to-white dark:from-black/45 dark:via-black/80 dark:to-black" />
            </div>
          )}
          <div className="brunch-header-inner relative z-10">
            <div className="brunch-meta">
              <span>Insight</span>
              {page.date && (
                <>
                  <span className="brunch-meta-dot" />
                  <span>{dateFormatter.format(new Date(page.date))}</span>
                </>
              )}
              <span className="brunch-meta-dot" />
              <span>{readingTime}분 분량</span>
            </div>
            <h1 className="brunch-title">{page.title}</h1>
            {page.description && <p className="brunch-subtitle">{page.description}</p>}
            {Boolean(page.tags?.length) && (
              <div className="brunch-tags">
                {page.tags?.map(tag => (
                  <span key={tag} className="brunch-tag">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="brunch-divider"><span /></div>

        <div className="brunch-content">
          <MarkdownRenderer content={page.content} assetBasePath={page.assetBasePath} />
        </div>

        <footer className="brunch-footer">
          <div className="brunch-divider"><span /></div>
          <div className="brunch-author">
            <img src={siteConfig.author.image} alt={siteConfig.author.name} className="brunch-author-img" />
            <div>
              <p className="brunch-author-name">{siteConfig.author.name}</p>
              <p className="brunch-author-desc">생각을 천천히 기록합니다.</p>
            </div>
          </div>
          <button onClick={() => router.push('/Insight')} className="brunch-back">
            ← 인사이트 목록으로 돌아가기
          </button>
        </footer>
      </article>
    </>
  );
}
