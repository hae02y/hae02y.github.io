// src/components/RecentPosts.tsx
import {useBlogPost } from '@docusaurus/plugin-content-blog/client';
import FloatingPostCard from '@site/src/components/RecentPost';

export default function RecentPosts() {
    const  blogPosts = useBlogPost();

    return (
        <div className="grid grid-cols-1 gap-4 max-w-md p-4">
            {blogPosts.slice(0,5).map(({ metadata }) => (
                <FloatingPostCard
                    key={metadata.permalink}
                    title={metadata.title}
                    permalink={metadata.permalink}
                    date={metadata.formattedDate}
                />
            ))}
        </div>
    );
}
