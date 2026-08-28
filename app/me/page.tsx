import type { Metadata } from 'next';
import AboutPageClient from '@/components/about/AboutPageClient';
import { createAboutMetadata } from '@/i18n/about';

export const metadata: Metadata = createAboutMetadata('ko', { noindex: true });

export default function MePage() {
  return <AboutPageClient locale="ko" />;
}
