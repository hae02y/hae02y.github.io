import React from 'react';
import clsx from 'clsx';
import {HtmlClassNameProvider, ThemeClassNames} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import Link from '@docusaurus/Link';
import BlogListPaginator from '@theme/BlogListPaginator';

// 스타일 정의
export const blogStyles = {
    tagLink:
        'inline-block mb-6 text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors',
    blogCard:
        'flex justify-between items-start border-gray-200 dark:border-gray-700 py-6 group h-48',
    date: 'text-sm text-gray-500 dark:text-gray-400 mb-1',
    title:
        'text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1 group-hover:underline',
    description: 'text-sm md:text-base text-gray-700 dark:text-gray-300 line-clamp-2 mb-2',
    thumbnail: 'w-28 h-20 md:w-36 md:h-24 rounded-lg object-cover shrink-0',
    pagination: 'mt-8 flex justify-center',
};

function BlogListPageContent({items, metadata}) {
    return (
        <BlogLayout>
            <Link to="/blog/tags" className={blogStyles.tagLink}>
                태그 보기
            </Link>
            <div className={`border-[0.3px] w-full border-gray-300`}></div>
            <div className="flex flex-col gap-6">
                {items.map(({content}) => (
                    <>
                        <Link
                            key={content.metadata.permalink}
                            to={content.metadata.permalink}
                            className={blogStyles.blogCard}
                        >
                            {console.log(content.metadata)}
                            {/* 왼쪽 텍스트 영역 */}
                            <div className="flex-1 pr-4">
                                <h3 className={blogStyles.title}>{content.metadata.title}</h3>
                                <p className={blogStyles.date}>
                                    {content.metadata.date} • Invest time, {Math.ceil(content.metadata.readingTime)} 분
                                </p>
                                <p className={blogStyles.description}>
                                    {content.metadata.description || 'No description available.'}
                                </p>
                            </div>
                        </Link>

                        <div className={`border-[0.3px] w-full border-gray-300`}></div>
                    </>
                ))}
            </div>

            <div className={blogStyles.pagination}>
                <BlogListPaginator metadata={metadata}/>
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
