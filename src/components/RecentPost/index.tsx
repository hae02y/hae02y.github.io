// src/components/RecentPosts.tsx
import React from "react";
import Link from "@docusaurus/Link";
import {useBlogPosts} from '@docusaurus/plugin-content-blog/client';

export default function RecentPosts() {
    const recentPosts = useBlogPosts().slice(0, 3);

    if (!recentPosts) return null;

    return (
        <div className="mt-10 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">최근 게시물</h2>
            <ul className="space-y-2">
                {recentPosts.map(({metadata}) => (
                    <li key={metadata.permalink}>
                        <Link
                            to={metadata.permalink}
                            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                        >
                            {metadata.title}
                        </Link>
                        <div className="text-sm text-gray-400">{new Date(metadata.date).toLocaleDateString()}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
