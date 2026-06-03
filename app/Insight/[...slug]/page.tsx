import { notFound } from 'next/navigation';
import { getAllInsightSlugs, getInsightPage } from '@/lib/docs';
import DocContent from '@/components/docs/DocContent';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return getAllInsightSlugs().map(slug => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string[] } }): Metadata {
  const page = getInsightPage(params.slug);
  if (!page) return {};
  return { title: page.title };
}

export default function InsightDetailPage({ params }: { params: { slug: string[] } }) {
  const page = getInsightPage(params.slug);
  if (!page) notFound();

  return (
    <div className="mx-auto px-4 mt-6 md:mt-10 max-w-3xl">
      <DocContent page={page} />
    </div>
  );
}
