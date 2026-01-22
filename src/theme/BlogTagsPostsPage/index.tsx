import React from 'react';
import clsx from 'clsx';
import {
    HtmlClassNameProvider,
    PageMetadata,
    ThemeClassNames,
} from '@docusaurus/theme-common';
import {useBlogTagsPostsPageTitle} from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import type {Props} from '@theme/BlogTagsPostsPage';
import Unlisted from '@theme/ContentVisibility/Unlisted';


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
    const dateTimeFormatter = React.useMemo(
        () => new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }),
        [],
    );

    return (
        <BlogLayout sidebar={sidebar}>
            {tag.unlisted && <Unlisted/>}
            <div className="not-prose">
                <section className="relative border-2 border-black dark:border-white bg-[#f7f7f2] dark:bg-[#161616] brutal-shadow overflow-hidden">
                    <div className="brutal-grid absolute inset-0 opacity-40 pointer-events-none"></div>
                    <div className="relative z-10 px-4 md:px-6 py-6">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black px-3 py-2 font-mono text-[11px] uppercase tracking-[0.25em]">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 border border-current"></span>
                                <span>Tag Archive</span>
                            </div>
                            <span className="text-[10px]">Hae02y System Log</span>
                        </div>
                        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-black dark:text-white">
                                    {tag.label}
                                </h1>
                                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.35em] text-black/70 dark:text-white/70">
                                    {items.length} Posts in this tag
                                </p>
                            </div>
                            <Link
                                className="inline-flex items-center gap-2 border-2 border-black dark:border-white bg-white dark:bg-black px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-black dark:text-white brutal-shadow hover:-translate-y-1 transition-transform"
                                to={tag.allTagsPath}
                            >
                                All Tags
                                <span className="text-base">↗</span>
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="mt-6 flex flex-col gap-6">
                    {items.map(({content}, index) => (
                        <article
                            key={content.metadata.permalink}
                            className="group border-2 border-black dark:border-white bg-white dark:bg-black brutal-shadow px-5 py-6 md:px-6 md:py-7 flex flex-col md:flex-row gap-4 md:gap-8 transition-transform duration-200 hover:-translate-y-1 hover:-rotate-1"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-black/70 dark:text-white/70">
                                    <span>0{index + 1}</span>
                                    <span>•</span>
                                    <span>
                                        {dateTimeFormatter.format(new Date(content.metadata.date))}
                                    </span>
                                    <span>•</span>
                                    <span>{Math.ceil(content.metadata.readingTime)} min</span>
                                </div>
                                <Link
                                    to={content.metadata.permalink}
                                    className="mt-3 block text-2xl md:text-3xl font-bold text-black dark:text-white group-hover:underline"
                                >
                                    {content.metadata.title}
                                </Link>
                                <p className="mt-3 text-sm md:text-base text-black/70 dark:text-white/70 line-clamp-2">
                                    {content.metadata.description || 'No description available.'}
                                </p>
                            </div>

                            <div className="flex items-center justify-between md:flex-col md:items-end gap-4">
                                <Link
                                    to={content.metadata.permalink}
                                    className="border-2 border-black dark:border-white px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-black dark:text-white transition-transform group-hover:-translate-y-1"
                                >
                                    Read
                                </Link>
                                <Link
                                    to={content.metadata.permalink}
                                    className="h-12 w-12 border-2 border-black dark:border-white flex items-center justify-center text-xl text-black dark:text-white transition-transform group-hover:-translate-y-1"
                                    aria-label={`${content.metadata.title} 읽기`}
                                >
                                    →
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-10 flex justify-center">
                    <div className="border-2 border-black dark:border-white bg-white dark:bg-black brutal-shadow px-4 py-3">
                        <BlogListPaginator metadata={listMetadata}/>
                    </div>
                </div>
            </div>
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
