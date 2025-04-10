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

    const prevBlockPage = startPage - 1;
    const nextBlockPage = endPage + 1;

    const toPageLink = (page: number) => (page === 1 ? '/blog' : `/blog/page/${page}`);

    return (
        <nav className="flex justify-center mt-8 mb-8 gap-2 flex-wrap">
            {/* 이전 블록으로 */}
            {prevBlockPage >= 1 && (
                <Link
                    to={toPageLink(prevBlockPage)}
                    className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    &lt;
                </Link>
            )}

            {/* 현재 블록의 페이지들 */}
            {pagesToShow.map((page) => {
                const isActive = page === currentPage;
                return (
                    <Link
                        key={page}
                        to={toPageLink(page)}
                        className={clsx(
                            'px-3 py-1 border rounded-md text-sm transition-colors',
                            isActive
                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                : 'bg-white text-black dark:bg-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                        )}
                    >
                        {page}
                    </Link>
                );
            })}

            {/* 다음 블록으로 */}
            {nextBlockPage <= totalPages && (
                <Link
                    to={toPageLink(nextBlockPage)}
                    className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    &gt;
                </Link>
            )}
        </nav>
    );
}
