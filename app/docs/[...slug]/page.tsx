import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllDocsSlugs, getDocsPage } from '@/lib/docs';
import DocsPageClient from './DocsPageClient';


export function generateStaticParams() {
  return getAllDocsSlugs().map(slug => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string[] } }): Metadata {
  const page = getDocsPage(params.slug.map(segment => decodeURIComponent(segment)));

  return {
    title: page?.title ?? '문서',
    description: page?.description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

export default function DocsPage({ params }: { params: { slug: string[] } }) {
  const decoded = params.slug.map(s => decodeURIComponent(s));
  const page = getDocsPage(decoded);
  if (!page) notFound();

  return <DocsPageClient page={{ title: page.title, content: page.content }} />;
}
