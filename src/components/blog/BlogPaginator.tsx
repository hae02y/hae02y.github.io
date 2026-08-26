import Link from 'next/link';
import { cn } from '@/lib/utils';

const PAGE_BLOCK_SIZE = 5;

interface BlogPaginatorProps {
  totalPages: number;
  currentPage: number;
}

export default function BlogPaginator({ totalPages, currentPage }: BlogPaginatorProps) {
  const currentBlock = Math.floor((currentPage - 1) / PAGE_BLOCK_SIZE);
  const startPage = currentBlock * PAGE_BLOCK_SIZE + 1;
  const endPage = Math.min(startPage + PAGE_BLOCK_SIZE - 1, totalPages);

  const pagesToShow = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  const toPageLink = (page: number) => (page === 1 ? '/blog/' : `/blog/page/${page}/`);

  return (
    <nav className="flex justify-center gap-2 flex-wrap">
      {pagesToShow.map(page => {
        const isActive = page === currentPage;
        return (
          <Link
            key={page}
            href={toPageLink(page)}
            className={cn(
              'border-2 border-black dark:border-white px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] transition-transform',
              isActive
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-white text-black dark:bg-black dark:text-white hover:-translate-y-0.5',
            )}
          >
            {page}
          </Link>
        );
      })}
    </nav>
  );
}
