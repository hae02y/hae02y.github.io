import React from 'react';
import clsx from 'clsx';
import {HtmlClassNameProvider, ThemeClassNames} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import Link from '@docusaurus/Link';
import BlogListPaginator from '@theme/BlogListPaginator';
import {useDateTimeFormat} from "@docusaurus/theme-common/internal";


function BlogListPageContent({items, metadata}) {
    return (
        <BlogLayout>
            <div className="not-prose">
                <section className="relative border-2 border-black dark:border-white bg-[#f7f7f2] dark:bg-[#161616] brutal-shadow overflow-hidden">
                    <div className="brutal-grid absolute inset-0 opacity-40 pointer-events-none"></div>
                    <div className="relative z-10 px-4 md:px-6 py-6">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black px-3 py-2 font-mono text-[11px] uppercase tracking-[0.25em]">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 border border-current"></span>
                                <span>Blog Index</span>
                            </div>
                            <span className="text-[10px]">Hae02y System Log</span>
                        </div>
                        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-black dark:text-white">
                                    Blog.
                                </h1>
                                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.35em] text-black/70 dark:text-white/70">
                                    Notes. Systems. Shipping.
                                </p>
                            </div>
                            <Link
                                className="inline-flex items-center gap-2 border-2 border-black dark:border-white bg-white dark:bg-black px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-black dark:text-white brutal-shadow hover:-translate-y-1 transition-transform"
                                to="/blog/tags"
                            >
                                All Tags
                                <span className="text-base">↗</span>
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="mt-6 flex flex-col gap-6">
                    {items.map(({content}, index) => (
                        <React.Fragment key={content.metadata.permalink}>
                            <article className="group border-2 border-black dark:border-white bg-white dark:bg-black brutal-shadow px-5 py-6 md:px-6 md:py-7 flex flex-col md:flex-row gap-4 md:gap-8 transition-transform duration-200 hover:-translate-y-1 hover:-rotate-1">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-black/70 dark:text-white/70">
                                        <span>0{index + 1}</span>
                                        <span>•</span>
                                        <span>
                                            {useDateTimeFormat().format(new Date(content.metadata.date))}
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
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {content.metadata.tags?.map((tag) => (
                                            <Link
                                                key={tag.label}
                                                className="border-2 border-black dark:border-white bg-white dark:bg-black px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-black dark:text-white transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                                                to={tag.permalink}
                                            >
                                                {tag.label}
                                            </Link>
                                        ))}
                                    </div>
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
                        </React.Fragment>
                    ))}
                </div>

                <div className="mt-10 flex justify-center">
                    <div className="border-2 border-black dark:border-white bg-white dark:bg-black brutal-shadow px-4 py-3">
                        <BlogListPaginator metadata={metadata}/>
                    </div>
                </div>
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
