'use client';

import { useEffect, useState } from 'react';
import type { DocPage } from '@/lib/docs';

interface DocContentProps {
  page: DocPage;
}

export default function DocContent({ page }: DocContentProps) {
  const [Content, setContent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    import('@/lib/markdown-renderer').then(mod => {
      const Component = () => mod.renderMarkdown(page.content);
      setContent(() => Component);
    });
  }, [page.content]);

  return (
    <article>
      <h1 className="text-3xl font-bold mb-6 text-[var(--primary)]">{page.title}</h1>
      <div className="markdown">
        {Content ? <Content /> : (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          </div>
        )}
      </div>
    </article>
  );
}
