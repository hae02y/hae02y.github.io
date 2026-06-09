import Link from 'next/link';
import { getAllInsightPosts } from '@/lib/docs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insight',
  description: '정해영의 생각과 감성적인 기록',
};

export default function InsightPage() {
  const posts = getAllInsightPosts();
  const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div className="mx-auto px-4 mt-8 md:mt-14">
      <main className="mx-auto max-w-[760px] w-full">
        <section className="border-b border-black/10 dark:border-white/15 pb-10 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-black/40 dark:text-white/40">
            Essay Index
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-[-0.05em] text-black dark:text-white">
            Insight
          </h1>
          <p className="mx-auto mt-5 max-w-[520px] text-base md:text-lg leading-8 text-black/55 dark:text-white/55 break-keep">
            기술 밖에서 떠오른 생각, 오래 남은 문장, 일과 삶 사이의 감정을 천천히 발행합니다.
          </p>
        </section>

        <section className="mt-10 flex flex-col gap-5">
          {posts.map((post, index) => (
            <article key={post.href} className="group border-b border-black/10 dark:border-white/10 pb-7 transition-colors hover:border-black/30 dark:hover:border-white/30">
              <Link href={post.href} className="block rounded-2xl px-1 py-2 transition-colors hover:bg-black/[0.025] dark:hover:bg-white/[0.035]">
                <div className="flex items-start gap-5">
                  <span className="mt-1 font-mono text-xs text-black/30 dark:text-white/30">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                      {post.date && <span>{dateFormatter.format(new Date(post.date))}</span>}
                      {post.date && <span>/</span>}
                      <span>{post.readingTime} min read</span>
                    </div>
                    <h2 className="mt-3 text-2xl md:text-3xl font-semibold leading-snug tracking-[-0.035em] text-black dark:text-white group-hover:underline decoration-black/30 dark:decoration-white/40 underline-offset-4 break-keep">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-sm md:text-base leading-7 text-black/55 dark:text-white/55 line-clamp-2 break-keep">
                      {post.description}
                    </p>
                    {post.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                          <span key={tag} className="rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-xs text-black/40 dark:text-white/40">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {post.heroImage && (
                    <div className="hidden md:block h-24 w-32 shrink-0 overflow-hidden rounded-2xl bg-black/5 dark:bg-white/10 opacity-70 transition-opacity group-hover:opacity-100">
                      <img src={post.heroImage} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                  )}
                  <span className="hidden md:block text-2xl text-black/25 dark:text-white/25 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </section>
      </main>
      <footer className="h-[60px]" />
    </div>
  );
}
