import Link from 'next/link';
import { getInsightSidebar } from '@/lib/docs';
import type { Metadata } from 'next';
import type { DocSidebarItem } from '@/lib/docs';

export const metadata: Metadata = {
  title: 'Insight',
  description: '인사이트 모음',
};

function SidebarItem({ item, basePath }: { item: DocSidebarItem; basePath: string }) {
  return (
    <div className="mb-4">
      <Link
        href={`${basePath}/${item.slug.join('/')}`}
        className="text-lg font-semibold text-[var(--primary)] hover:underline"
      >
        {item.title}
      </Link>
      {item.children && (
        <ul className="ml-4 mt-2 space-y-1">
          {item.children.map(child => (
            <li key={child.slug.join('/')}>
              <Link
                href={`${basePath}/${child.slug.join('/')}`}
                className="text-sm text-[var(--secondary)] hover:text-[var(--primary)]"
              >
                {child.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function InsightPage() {
  const sidebar = getInsightSidebar();

  return (
    <div className="mx-auto px-4 mt-6 md:mt-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-[var(--primary)]">Insight</h1>
      <div className="space-y-2">
        {sidebar.map(item => (
          <SidebarItem key={item.slug.join('/')} item={item} basePath="/Insight" />
        ))}
      </div>
    </div>
  );
}
