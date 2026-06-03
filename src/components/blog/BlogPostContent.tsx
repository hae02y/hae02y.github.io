'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/lib/blog';
import Comments from '@/components/Comments';

interface BlogPostContentProps {
  post: BlogPost;
  dirName?: string;
}

export default function BlogPostContent({ post, dirName }: BlogPostContentProps) {
  const [MarkdownContent, setMarkdownContent] = useState<React.ComponentType | null>(null);

  const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  useEffect(() => {
    // Dynamically render markdown content
    import('@/lib/markdown-renderer').then(mod => {
      const Component = () => mod.renderMarkdown(post.content, dirName);
      setMarkdownContent(() => Component);
    });
  }, [post.content, dirName]);

  return (
    <article>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white leading-tight">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-black/70 dark:text-white/70">
          <span>{dateFormatter.format(new Date(post.date))}</span>
          <span>•</span>
          <span>{post.readingTime} min read</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <Link
              key={tag}
              href={`/blog/tags/${encodeURIComponent(tag)}`}
              className="border-2 border-black dark:border-white bg-white dark:bg-black px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-black dark:text-white transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
            >
              {tag}
            </Link>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="markdown">
        {MarkdownContent ? <MarkdownContent /> : (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          </div>
        )}
      </div>

      {/* Comments */}
      {post.comments && (
        <div className="mt-12">
          <Comments />
        </div>
      )}
    </article>
  );
}
