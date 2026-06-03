import { getPortfolioData } from '@/lib/portfolio';
import MePageClient from './MePageClient';
import type { Metadata } from 'next';

const siteUrl = 'https://blog.hae02y.me';

export const metadata: Metadata = {
  title: '정해영 | 백엔드 개발자 이력서 & 포트폴리오',
  description: '정해영(hae02y) 백엔드 개발자 이력서. VEStellaLab 선임연구원. Java, Spring Boot, AWS, Kubernetes 기반 시스템 설계 및 개발. 3년차 백엔드 개발자.',
  keywords: ['정해영', '정해영 개발자', '정해영 이력서', 'hae02y', '백엔드 개발자', 'Backend Developer', 'VEStellaLab', 'Spring Boot', 'Java'],
  openGraph: {
    title: '정해영 | 백엔드 개발자 이력서',
    description: '정해영(hae02y) 백엔드 개발자. Java, Spring Boot, AWS 기반 시스템 설계 및 개발.',
    url: `${siteUrl}/me`,
    images: [{ url: `${siteUrl}/img/me.jpg`, alt: '정해영 프로필' }],
  },
  alternates: {
    canonical: `${siteUrl}/me`,
  },
};

export default function MePage() {
  const portfolioData = getPortfolioData();

  return <MePageClient portfolioData={portfolioData} />;
}
