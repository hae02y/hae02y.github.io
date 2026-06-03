'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { BlogPost } from '@/lib/blog';
import Comments from '@/components/Comments';

interface BlogPostContentProps {
  post: BlogPost;
  dirName?: string;
}

export default function BlogPostContent({ post, dirName }: BlogPostContentProps) {
  const router = useRouter();
  const [MarkdownContent, setMarkdownContent] = useState<React.ComponentType | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    import('@/lib/markdown-renderer').then(mod => {
      const Component = () => mod.renderMarkdown(post.content, dirName);
      setMarkdownContent(() => Component);
    });
  }, [post.content, dirName]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-black dark:bg-white z-[100] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      <article className="brunch-article">
        {/* Hero header */}
        <header className="brunch-header">
          <div className="brunch-header-inner">
            <div className="brunch-meta">
              <span>{dateFormatter.format(new Date(post.date))}</span>
              <span className="brunch-meta-dot" />
              <span>{post.readingTime}분 분량</span>
            </div>
            <h1 className="brunch-title">{post.title}</h1>
            {post.description && (
              <p className="brunch-subtitle">{post.description}</p>
            )}
            <div className="brunch-tags">
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/blog/tags/${encodeURIComponent(tag)}`}
                  className="brunch-tag"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </header>

        {/* Divider */}
        <div className="brunch-divider">
          <span />
        </div>

        {/* Content */}
        <div className="brunch-content">
          {MarkdownContent ? <MarkdownContent /> : (
            <div className="brunch-loading">
              <div /><div /><div />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="brunch-footer">
          <div className="brunch-divider"><span /></div>

          <div className="brunch-author">
            <img src="/img/me.jpg" alt="정해영" className="brunch-author-img" />
            <div>
              <p className="brunch-author-name">정해영</p>
              <p className="brunch-author-desc">백엔드 개발자 @VEStellaLab</p>
            </div>
          </div>

          <div className="brunch-tags" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
            {post.tags.map(tag => (
              <Link key={tag} href={`/blog/tags/${encodeURIComponent(tag)}`} className="brunch-tag">
                #{tag}
              </Link>
            ))}
          </div>

          <button
            onClick={() => router.push('/blog')}
            className="brunch-back"
          >
            ← 목록으로 돌아가기
          </button>

          {post.comments && (
            <div className="brunch-comments">
              <Comments />
            </div>
          )}
        </footer>
      </article>
    </>
  );
}
