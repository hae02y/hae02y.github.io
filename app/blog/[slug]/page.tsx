import { notFound } from 'next/navigation';
import { getAdjacentPosts, getAllPosts, getPostBySlug, getPostDirName, getRelatedPosts } from '@/lib/blog';
import BlogPostContent from '@/components/blog/BlogPostContent';
import { siteConfig } from '@/config/site';
import { absoluteUrl, serializeJsonLd, socialImages } from '@/lib/seo';
import type { Metadata } from 'next';
import './brunch.css';

export function generateStaticParams() {
  return getAllPosts().map(post => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const slug = decodeURIComponent(params.slug);
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = absoluteUrl(`/blog/${post.slug}/`);
  const images = socialImages(post.image, `${post.title} 대표 이미지`);

  return {
    title: post.title,
    description: post.description,
    keywords: [...post.tags, '정해영', 'hae02y', '기술블로그'],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      authors: ['정해영'],
      tags: post.tags,
      url,
      siteName: siteConfig.title,
      locale: 'ko_KR',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: images.map(({ url: imageUrl }) => imageUrl),
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const dirName = getPostDirName(slug);
  const navigation = getAdjacentPosts(slug);
  const relatedPosts = getRelatedPosts(slug);
  const url = absoluteUrl(`/blog/${post.slug}/`);
  const image = socialImages(post.image, `${post.title} 대표 이미지`)[0].url;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    headline: post.title,
    description: post.description,
    image: [image],
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    inLanguage: 'ko-KR',
    keywords: post.tags,
    author: {
      '@type': 'Person',
      '@id': `${siteConfig.url}#person`,
      name: siteConfig.author.name,
      url: `${siteConfig.url}/about/`,
    },
    publisher: {
      '@type': 'Person',
      '@id': `${siteConfig.url}#person`,
      name: siteConfig.author.name,
      url: `${siteConfig.url}/about/`,
    },
    isPartOf: { '@id': `${siteConfig.url}#blog` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <BlogPostContent post={post} dirName={dirName} navigation={navigation} relatedPosts={relatedPosts} />
    </>
  );
}
