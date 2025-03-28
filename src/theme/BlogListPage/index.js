import React from 'react';
import clsx from 'clsx';
import { HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import Link from '@docusaurus/Link';
import BlogListPaginator from '@theme/BlogListPaginator';

// 스타일 정의
export const blogStyles = {
    tagLink:
        'inline-block mb-6 text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors',
    blogCard:
        'flex justify-between items-start border-b border-gray-200 dark:border-gray-700 py-6 group max-h-50',
    date: 'text-sm text-gray-500 dark:text-gray-400 mb-1',
    title:
        'text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1 group-hover:underline',
    description: 'text-sm md:text-base text-gray-700 dark:text-gray-300 line-clamp-2 mb-2',
    thumbnail: 'w-28 h-20 md:w-36 md:h-24 rounded-lg object-cover shrink-0',
    pagination: 'mt-8 flex justify-center',
};

function BlogListPageContent({ items, metadata }) {
    return (
        <BlogLayout>
            <Link to="/blog/tags" className={blogStyles.tagLink}>
                태그 보기
            </Link>

            <div className="flex flex-col gap-6">
                {items.map(({ content }) => (
                    <Link
                        key={content.metadata.permalink}
                        to={content.metadata.permalink}
                        className={blogStyles.blogCard}
                    >
                        {/* 왼쪽 텍스트 영역 */}
                        <div className="flex-1 pr-4">
                            <p className={blogStyles.date}>
                                 • {new Date(content.metadata.date).toLocaleDateString()}
                            </p>
                            <h3 className={blogStyles.title}>{content.metadata.title}</h3>
                            <p className={blogStyles.description}>
                                {content.metadata.description || 'No description available.'}
                            </p>
                        </div>

                        {/* 오른쪽 썸네일 이미지 */}
                        <div>
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
