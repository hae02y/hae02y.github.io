import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import type { Props } from '@theme/BlogListPaginator';

export default function BlogListPaginator({ metadata }: Props): JSX.Element {
    const { previousPage, nextPage, totalPages, permalink } = metadata;
    const currentPage = Number(permalink.split('/').filter(Boolean).pop()) || 1;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="flex justify-center mt-8 gap-2">
            {pages.map((page) => {
                const pageLink = page === 1 ? '/' : `/page/${page}`;
                const isActive = page === currentPage;

                return (
                    <Link
                        key={page}
                        to={pageLink}
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
        </nav>
    );
}
