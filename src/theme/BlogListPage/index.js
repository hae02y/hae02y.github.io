import React from 'react';
import clsx from 'clsx';
import {HtmlClassNameProvider, ThemeClassNames} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import Link from '@docusaurus/Link';
import BlogListPaginator from '@theme/BlogListPaginator';
import {useDateTimeFormat} from "@docusaurus/theme-common/internal";

// 스타일 정의
export const blogStyles = {
    tagLink:
        'block md:inline-block break-words line-clamp-3 mb-6 text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors',
    blogCard:
        'flex justify-between items-start border-gray-200 dark:border-gray-700 py-6 group h-48',
    date: 'text-sm text-gray-500 dark:text-gray-400 mb-1',
    title:
        'text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1 group-hover:underline',
    description: 'text-sm md:text-base text-gray-700 dark:text-gray-300 break-all overflow-hidden line-clamp-2 mb-4',
    thumbnail: 'w-28 h-full rounded-lg object-cover shrink-0',
    pagination: 'mt-8 flex justify-center',
};


function BlogListPageContent({items, metadata}) {
    return (
        <BlogLayout>
            <div className={`blog-header`}>
                <h1 className={`text-center`}>Blog.</h1>
                <Link to={'/blog/tags'}>태그</Link>
            </div>
            <div className={`border-[0.3px] w-full border-gray-300`}></div>
            <div className="flex flex-col w-full">
                {items.map(({content}) => (
                    <>
                        <Link
                            key={content.metadata.permalink}
                            to={content.metadata.permalink}
                            className={blogStyles.blogCard}
                        >
                            {console.log(content.metadata)}
                            {/* 왼쪽 텍스트 영역 */}
                            <div className="flex-1 pr-4 h-full">
                                <h3 className={blogStyles.title}>{content.metadata.title}</h3>
                                <p className={blogStyles.date}>
                                    {useDateTimeFormat().format(new Date(content.metadata.date))} • {Math.ceil(content.metadata.readingTime)} min
                                </p>
                                <p className={blogStyles.description}>
                                    {content.metadata.description || 'No description available.'}
                                </p>
                            </div>

                            {/* 오른쪽 아이콘 이미지 (dark-link.svg) */}
                            <div className="hidden md:w-28 h-full rounded-lg shrink-0 md:flex items-center justify-center">
                                <img
                                    src="/img/blog/dark-link.svg"
                                    alt="링크 아이콘"
                                    className="w-[50px] h-[50px] object-contain invert dark:invert-0"
                                />
                            </div>
                        </Link>

                        <div className="w-full flex flex-wrap gap-2 my-2">
                            {content.metadata.tags?.map(tag => (
                                <div
                                    className={`w-fit rounded-full bg-[#D9D9D9] dark:bg-[#242526] bg-opacity-40 py-0.5 px-2.5 text-[11px] text-[#4F5968]`}>
                                    <a href={`/blog/tags/${tag.label}`} key={tag}>
                                        {tag.label}
                                    </a>
                                </div>
                            ))}
                        </div>

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
