import { getAllDocsSlugs, getDocsPage } from '@/lib/docs';
import DocsPageClient from './DocsPageClient';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllDocsSlugs().map(slug => ({ slug }));
}

export default function DocsPage({ params }: { params: { slug: string[] } }) {
  const decoded = params.slug.map(s => decodeURIComponent(s));
  const page = getDocsPage(decoded);

  return <DocsPageClient page={page ? { title: page.title, content: page.content } : null} />;
}
