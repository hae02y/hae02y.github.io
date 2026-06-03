import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug, getPostDirName } from '@/lib/blog';
import BlogPostContent from '@/components/blog/BlogPostContent';
import type { Metadata } from 'next';


export function generateStaticParams() {
  return getAllPosts().map(post => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const slug = decodeURIComponent(params.slug);
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const dirName = getPostDirName(slug);

  return (
    <div className="mx-auto px-4 mt-6 md:mt-10">
      <main className="mx-auto max-w-[700px] px-4 w-full">
        <BlogPostContent post={post} dirName={dirName} />
      </main>
      <footer className="h-[60px]" />
    </div>
  );
}
