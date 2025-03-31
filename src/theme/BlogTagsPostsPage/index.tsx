import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import {
    PageMetadata,
    HtmlClassNameProvider,
    ThemeClassNames,
} from '@docusaurus/theme-common';
import {useBlogTagsPostsPageTitle, useDateTimeFormat} from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import type {Props} from '@theme/BlogTagsPostsPage';
import Unlisted from '@theme/ContentVisibility/Unlisted';

export const blogStyles = {
    tagLink:
        'block md:inline-block break-words line-clamp-3 mb-6 text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors',
    blogCard:
        'flex justify-between items-start border-gray-200 dark:border-gray-700 py-6 group h-48',
    date: 'text-sm text-gray-500 dark:text-gray-400 mb-1',
    title:
        'text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1 group-hover:underline',
    description: 'text-sm md:text-base text-gray-700 dark:text-gray-300 break-all mb-2',
    thumbnail: 'w-28 h-full rounded-lg object-cover shrink-0',
    pagination: 'mt-8 flex justify-center',
};


function BlogTagsPostsPageMetadata({tag}: Props) {
    const title = useBlogTagsPostsPageTitle(tag);
    return (
        <>
            <PageMetadata title={title} description={tag.description} />
            <SearchMetadata tag="blog_tags_posts" />
        </>
    );
}

function BlogTagsPostsPageContent({
                                      tag,
                                      items,
                                      sidebar,
                                      listMetadata,
                                  }: Props){
    return (
        <BlogLayout sidebar={sidebar}>
            {tag.unlisted && <Unlisted/>}
            <header className="margin-bottom--xl">
                <h1 className={`text-center`}>Blog/Tags.</h1>
                <h3 className="text-uppercase text-center">{tag.label}</h3>
                <Link href={tag.allTagsPath}>
                    <Translate
                        id="theme.tags.tagsPageLink"
                        description="The label of the link targeting the tag list page">
                        모든 태그 보기
                    </Translate>
                </Link>
            </header>

            {/* ✅ 블로그 리스트 출력 */}
            <div className={`border-[0.3px] w-full border-gray-300`}></div>
            <div className="flex flex-col w-full">
                {items.map(({content}) => (
                    <>
                        <Link
                            key={content.metadata.permalink}
                            to={content.metadata.permalink}
                            className={blogStyles.blogCard}
                        >
                            {/* 왼쪽 텍스트 영역 */}
                            <div className="flex-1 pr-4">
                                <h3 className={blogStyles.title}>{content.metadata.title}</h3>
                                <p className={blogStyles.date}>
                                    {useDateTimeFormat().format(new Date(content.metadata.date))} • {Math.ceil(content.metadata.readingTime)} min
                                </p>
                                <p className={blogStyles.description}>
                                    {content.metadata.description || 'No description available.'}
                                </p>
                            </div>

                            {/* 오른쪽 아이콘 이미지 (dark-link.svg) */}
                            <div
                                className="hidden md:w-28 h-full rounded-lg shrink-0 md:flex items-center justify-center">
                                <img
                                    src="/img/blog/dark-link.svg"
                                    alt="링크 아이콘"
                                    className="w-[50px] h-[50px] object-contain invert dark:invert-0"
                                />
                            </div>
                        </Link>

                        <div className={`border-[0.3px] w-full border-gray-300`}></div>
                    </>
                ))}
            </div>

            <BlogListPaginator metadata={listMetadata}/>
        </BlogLayout>
    );
}

export default function BlogTagsPostsPage(props: Props) {
    return (
        <HtmlClassNameProvider
            className={clsx(
                ThemeClassNames.wrapper.blogPages,
                ThemeClassNames.page.blogTagPostListPage,
            )}>
            <BlogTagsPostsPageMetadata {...props} />
            <BlogTagsPostsPageContent {...props} />
        </HtmlClassNameProvider>
    );
}
