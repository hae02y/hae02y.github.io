import Link from 'next/link';
import { getAllInsightPosts } from '@/lib/docs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insight',
  description: '정해영의 생각과 감성적인 기록',
};

export default function InsightPage() {
  const posts = getAllInsightPosts();
  const [featuredPost, ...restPosts] = posts;
  const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div className="relative mx-auto min-h-screen overflow-hidden px-4 pt-8 md:pt-14">
      <div className="pointer-events-none absolute left-1/2 top-14 -z-10 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#ead7c1]/55 blur-3xl dark:bg-white/10" />
      <main className="mx-auto w-full max-w-[860px]">
        <section className="pb-9 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/55 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.32em] text-black/45 backdrop-blur dark:border-white/10 dark:bg-white/[0.04] dark:text-white/45">
            <span>Essay Index</span>
            <span className="h-1 w-1 rounded-full bg-current opacity-45" />
            <span>{posts.length} Notes</span>
          </div>
          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.065em] text-black dark:text-white md:text-6xl">
            Insight
          </h1>
          <p className="mx-auto mt-5 max-w-[560px] text-base leading-8 text-black/55 break-keep dark:text-white/55 md:text-lg">
            기술 밖에서 떠오른 생각, 오래 남은 문장, 일과 삶 사이의 감정을 천천히 발행합니다.
          </p>
        </section>

        {featuredPost && (
          <section>
            <Link href={featuredPost.href} className="group block overflow-hidden rounded-[2rem] border border-black/10 bg-white/65 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-black/20 dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)] dark:hover:border-white/25">
              <article className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
                {featuredPost.heroImage && (
                  <div className="relative min-h-[260px] overflow-hidden bg-black/5 dark:bg-white/10 md:min-h-[360px]">
                    <img src={featuredPost.heroImage} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 dark:from-black/55" />
                  </div>
                )}
                <div className="flex min-h-[320px] flex-col justify-between p-7 md:p-9">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-black/42 dark:text-white/42">
                      <span>Featured</span>
                      <span>/</span>
                      {featuredPost.date && <span>{dateFormatter.format(new Date(featuredPost.date))}</span>}
                      {featuredPost.date && <span>/</span>}
                      <span>{featuredPost.readingTime} min read</span>
                    </div>
                    <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.055em] text-black break-keep dark:text-white md:text-4xl">
                      {featuredPost.title}
                    </h2>
                    <p className="mt-4 text-base leading-8 text-black/55 break-keep dark:text-white/55">
                      {featuredPost.description}
                    </p>
                    {featuredPost.tags.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {featuredPost.tags.map(tag => (
                          <span key={tag} className="rounded-full border border-black/10 bg-black/[0.025] px-3 py-1 text-xs text-black/45 dark:border-white/15 dark:bg-white/[0.04] dark:text-white/45">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-8 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-black/45 transition group-hover:translate-x-1 dark:text-white/45">
                    Read Essay <span>→</span>
                  </div>
                </div>
              </article>
            </Link>
          </section>
        )}

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {restPosts.map((post, index) => (
            <article key={post.href} className="group overflow-hidden rounded-3xl border border-black/10 bg-white/55 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:bg-white/80 dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-white/25 dark:hover:bg-white/[0.06]">
              <Link href={post.href} className="grid h-full grid-cols-[112px_1fr] gap-4 p-4 md:grid-cols-1 md:gap-0 md:p-0">
                {post.heroImage && (
                  <div className="h-full min-h-[112px] overflow-hidden rounded-2xl bg-black/5 dark:bg-white/10 md:h-40 md:rounded-none">
                    <img src={post.heroImage} alt="" className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
                  </div>
                )}
                <div className="flex min-w-0 flex-col p-0 md:p-5">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-black/35 dark:text-white/35">
                    <span>{String(index + 2).padStart(2, '0')}</span>
                    {post.date && <span>/</span>}
                    {post.date && <span>{dateFormatter.format(new Date(post.date))}</span>}
                  </div>
                  <h2 className="mt-2 text-xl font-semibold leading-snug tracking-[-0.04em] text-black break-keep dark:text-white md:text-2xl">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/52 break-keep dark:text-white/52">
                    {post.description}
                  </p>
                  <div className="mt-auto hidden pt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-black/35 transition group-hover:translate-x-1 dark:text-white/35 md:block">
                    {post.readingTime} min read →
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </section>
      </main>
      <footer className="h-[72px]" />
    </div>
  );
}
