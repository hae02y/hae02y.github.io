import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  alternates: {
    canonical: `${siteConfig.url}/`,
  },
};

export default function Home() {
  return <HomeClient />;
}
