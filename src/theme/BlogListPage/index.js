import React, {useEffect} from 'react';
import clsx from 'clsx';
import { HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import Link from '@docusaurus/Link';
import BlogListPaginator from '@theme/BlogListPaginator';

function BlogListPageContent(props) {
    const { items, metadata } = props;


    return (
        <BlogLayout>
            <Link
                key={'tags'}
                to={'/blog/tags'}
            >태그보기</Link>
            {/* 알림형 블로그 카드 레이아웃 */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 p-4">
                {items.map(({ content }) => (
                    <Link
                        key={content.metadata.permalink}
                        to={content.metadata.permalink}
                        className="flex items-center p-4 rounded-2xl shadow-md dark:bg-gray-950 border border-gray-200 dark:border-gray-700 transition-transform hover:-translate-y-1 hover:shadow-lg"
                    >
                        {/* 아이콘 부분 */}
                        <div className="w-12 h-12 flex-shrink-0 bg-blue-100 dark:bg-blue-700 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center mr-4">
                            {/* 예시 아이콘 */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4l3 3m6 4H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>

                        {/* 텍스트 내용 */}
                        <div className="flex-1">
                            {/* 작성일 */}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {new Date(content.metadata.date).toLocaleDateString()}
                            </p>

                            {/* 제목 */}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                {content.metadata.title}
                            </h3>

                            {/* 설명 */}
                            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                {content.metadata.description || 'No description available.'}
                            </p>
                        </div>

                        {/* 옵션 (추가 버튼 아이콘) */}
                        <div className="ml-4 text-gray-400 dark:text-gray-500 hover:text-gray-600">
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
                                    strokeWidth="2"
                                    d="M12 6h.01M12 12h.01M12 18h.01"
                                />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>

            {/* 페이지네이션 */}
            <div className="mt-8 flex justify-center">
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
                ThemeClassNames.page.blogListPage,
            )
        }
        >
            <BlogListPageContent {...props} />
        </HtmlClassNameProvider>
    );
}
