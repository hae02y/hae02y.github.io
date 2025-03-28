// BlogListPage.tsx
import React from 'react';
import clsx from 'clsx';
import { HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import Link from '@docusaurus/Link';
import BlogListPaginator from '@theme/BlogListPaginator';

export const blogStyles = {
    tagLink:
        'inline-block mb-6 text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors',
    blogCard:
        'flex items-center p-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 transition-transform hover:-translate-y-1 hover:shadow-lg',
    date: 'text-xs text-gray-500 dark:text-gray-400 mb-1',
    title: 'text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1',
    description: 'text-sm text-gray-700 dark:text-gray-300 line-clamp-2',
    moreIcon: 'ml-4 text-gray-400 dark:text-gray-500 hover:text-gray-600',
    grid: 'grid gap-6 grid-cols-1 p-4',
    pagination: 'mt-8 flex justify-center',
};

function BlogListPageContent({ items, metadata }) {
    return (
        <BlogLayout>
            <Link to="/blog/tags" className={blogStyles.tagLink}>
                태그 보기
            </Link>

            <div className={blogStyles.grid}>
                {items.map(({ content }) => (
                    <Link
                        key={content.metadata.permalink}
                        to={content.metadata.permalink}
                        className={blogStyles.blogCard}
                    >
                        <div className="flex-1">
                            <p className={blogStyles.date}>
                                {new Date(content.metadata.date).toLocaleDateString()}
                            </p>
                            <h3 className={blogStyles.title}>{content.metadata.title}</h3>
                            <p className={blogStyles.description}>
                                {content.metadata.description || 'No description available.'}
                            </p>
                        </div>
                        <div className={blogStyles.moreIcon}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6h.01M12 12h.01M12 18h.01"
                                />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>

            <div className={blogStyles.pagination}>
                <BlogListPaginator metadata={metadata} />
            </div>
        </BlogLayout>
    );
}

export default function BlogListPage(props) {
    return (
        <HtmlClassNameProvider
            className={clsx(
                ThemeClassNames.wrapper.blogPages,
                ThemeClassNames.page.blogListPage
            )}
        >
            <BlogListPageContent {...props} />
        </HtmlClassNameProvider>
    );
}
