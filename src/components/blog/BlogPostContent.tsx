'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { BlogPost } from '@/lib/blog';
import { MarkdownRenderer } from '@/lib/markdown-renderer';
import Comments from '@/components/Comments';
import ReadingProgress from './ReadingProgress';
import { siteConfig } from '@/config/site';

interface BlogPostContentProps {
  post: BlogPost;
  dirName?: string;
}

export default function BlogPostContent({ post, dirName }: BlogPostContentProps) {
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
                <Link key={tag} href={`/blog/tags/${encodeURIComponent(tag)}`} className="brunch-tag">
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </header>

        <div className="brunch-divider"><span /></div>

        <div className="brunch-content">
          <MarkdownRenderer content={post.content} dirName={dirName} />
        </div>

        <footer className="brunch-footer">
          <div className="brunch-divider"><span /></div>
          <div className="brunch-author">
            <img src={siteConfig.author.image} alt={siteConfig.author.name} className="brunch-author-img" />
            <div>
              <p className="brunch-author-name">{siteConfig.author.name}</p>
              <p className="brunch-author-desc">{siteConfig.author.bio} @{siteConfig.author.company}</p>
            </div>
          </div>
          <div className="brunch-tags" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
            {post.tags.map(tag => (
              <Link key={tag} href={`/blog/tags/${encodeURIComponent(tag)}`} className="brunch-tag">
                #{tag}
              </Link>
            ))}
          </div>
          <button onClick={() => router.push('/blog')} className="brunch-back">
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
