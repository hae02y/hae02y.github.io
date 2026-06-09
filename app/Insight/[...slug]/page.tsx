import { notFound } from 'next/navigation';
import { getAllInsightSlugs, getInsightPage } from '@/lib/docs';
import InsightPostContent from '@/components/insight/InsightPostContent';
import type { Metadata } from 'next';
import readingTime from 'reading-time';
import '../../blog/[slug]/brunch.css';


export function generateStaticParams() {
  return getAllInsightSlugs().map(slug => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string[] } }): Metadata {
  const decoded = params.slug.map(s => decodeURIComponent(s));
  const page = getInsightPage(decoded);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
  };
}

export default function InsightDetailPage({ params }: { params: { slug: string[] } }) {
  const decoded = params.slug.map(s => decodeURIComponent(s));
  const page = getInsightPage(decoded);
  if (!page) notFound();

  return <InsightPostContent page={page} readingTime={Math.ceil(readingTime(page.content).minutes)} />;
}
