import { getAllDocsSlugs, getDocsPage } from '@/lib/docs';
import DocsPageClient from './DocsPageClient';

export function generateStaticParams() {
  return getAllDocsSlugs().map(slug => ({ slug }));
}

export default function DocsPage({ params }: { params: { slug: string[] } }) {
  const page = getDocsPage(params.slug);

  return <DocsPageClient page={page ? { title: page.title, content: page.content } : null} />;
}
