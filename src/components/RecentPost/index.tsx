import React from 'react';
import Link from 'next/link';

type RecentPost = {
  title: string;
  permalink: string;
  date: string;
};

interface RecentPostsProps {
  posts?: RecentPost[];
}

export default function RecentPosts({ posts = [] }: RecentPostsProps) {
  if (!posts.length) return null;

  return (
    <div className="space-y-3">
      {posts.map(post => (
        <Link key={post.permalink} href={post.permalink} className="block hover:underline">
          <div className="text-sm font-semibold">{post.title}</div>
          <div className="text-xs text-gray-500">{post.date}</div>
        </Link>
      ))}
    </div>
  );
}
