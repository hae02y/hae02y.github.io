import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import {
    PageMetadata,
    HtmlClassNameProvider,
    ThemeClassNames,
} from '@docusaurus/theme-common';
import {useBlogTagsPostsPageTitle} from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import type {Props} from '@theme/BlogTagsPostsPage';
import Unlisted from '@theme/ContentVisibility/Unlisted';

function BlogTagsPostsPageMetadata({tag}: Props): JSX.Element {
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
                                  }: Props): JSX.Element {
    return (
        <BlogLayout sidebar={sidebar}>
            {tag.unlisted && <Unlisted />}
            <header className="margin-bottom--xl">
                <h1>{tag.label} 관련 블로그 글</h1>
                {tag.description && <p>{tag.description}</p>}
                <Link href={tag.allTagsPath}>
                    <Translate
                        id="theme.tags.tagsPageLink"
                        description="The label of the link targeting the tag list page">
                        모든 태그 보기
                    </Translate>
                </Link>
            </header>

            {/* ✅ 블로그 리스트 출력 */}
            <ul className="list-none p-0">
                {items.map(({content}) => (
                    <li key={content.metadata.permalink} className="mb-4">
                        <Link
                            to={content.metadata.permalink}
                            className="text-lg font-semibold text-blue-600 hover:underline"
                        >
                            {content.metadata.title}
                        </Link>
                    </li>
                ))}
            </ul>

            <BlogListPaginator metadata={listMetadata} />
        </BlogLayout>
    );
}

export default function BlogTagsPostsPage(props: Props): JSX.Element {
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
