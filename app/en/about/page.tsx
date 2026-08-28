import type { Metadata } from 'next';
import AboutPageClient from '@/components/about/AboutPageClient';
import { createAboutMetadata } from '@/i18n/about';

export const metadata: Metadata = createAboutMetadata('en');

export default function EnglishAboutPage() {
  return <AboutPageClient locale="en" />;
}
