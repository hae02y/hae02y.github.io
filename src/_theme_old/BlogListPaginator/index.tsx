import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import type { Props } from '@theme/BlogListPaginator';

const PAGE_BLOCK_SIZE = 5;

export default function BlogListPaginator({ metadata }: Props){
    const { totalPages, permalink } = metadata;
    const currentPage = Number(permalink.split('/').filter(Boolean).pop()) || 1;

    const currentBlock = Math.floor((currentPage - 1) / PAGE_BLOCK_SIZE);
    const startPage = currentBlock * PAGE_BLOCK_SIZE + 1;
    const endPage = Math.min(startPage + PAGE_BLOCK_SIZE - 1, totalPages);

    const pagesToShow = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
    );

    const toPageLink = (page: number) => (page === 1 ? '/blog' : `/blog/page/${page}`);

    return (
        <nav className="flex justify-center gap-2 flex-wrap">
            {pagesToShow.map((page) => {
                const isActive = page === currentPage;
                return (
                    <Link
                        key={page}
                        to={toPageLink(page)}
                        className={clsx(
                            'border-2 border-black dark:border-white px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] transition-transform',
                            isActive
                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                : 'bg-white text-black dark:bg-black dark:text-white hover:-translate-y-0.5'
                        )}
                    >
                        {page}
                    </Link>
                );
            })}
        </nav>
    );
}
