import { getPortfolioData } from '@/lib/portfolio';
import MePageClient from './MePageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Me',
  description: '정해영 이력서 & 포트폴리오',
};

export default function MePage() {
  const portfolioData = getPortfolioData();

  return <MePageClient portfolioData={portfolioData} />;
}
