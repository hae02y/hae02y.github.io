import type { Metadata } from 'next';
import { getPortfolioData } from '@/lib/portfolio';
import MePageClient from './MePageClient';

const siteUrl = 'https://blog.hae02y.me';
const mePageUrl = `${siteUrl}/me/`;
const mePageTitle = '개발자 정해영 | 백엔드 개발자 포트폴리오 - hae02y';
const mePageDescription = '정해영(hae02y)은 Java/Spring Boot 기반 백엔드 개발자입니다. AWS, Kubernetes, AI/인프라, DevOps 환경에서 시스템 설계, API 개발, 운영 자동화와 포트폴리오를 정리했습니다.';

export const metadata: Metadata = {
  title: mePageTitle,
  description: mePageDescription,
  authors: [{ name: '정해영', url: mePageUrl }],
  creator: '정해영',
  publisher: '정해영',
  category: 'Developer Portfolio',
  keywords: [
    '정해영',
    '개발자 정해영',
    '정해영 개발자',
    '정해영 백엔드',
    '백엔드 정해영',
    '정해영 백엔드 개발자',
    '백엔드 개발자 정해영',
    '정해영 포트폴리오',
    '정해영 이력서',
    '정해영 기술블로그',
    'hae02y',
    'hae02y 개발자',
    'hae02y portfolio',
    'hae02y backend developer',
    'Haeyoung Jeong',
    'Haeyoung Jeong developer',
    '백엔드 개발자',
    '백엔드 포트폴리오',
    '개발자 포트폴리오',
    'Backend Developer',
    'Backend Engineer',
    'Software Engineer',
    'Spring Boot',
    'Java',
    'AWS',
    'Kubernetes',
    'DevOps',
    '인프라 개발자',
    'AI 백엔드 개발자',
  ],
  openGraph: {
    type: 'profile',
    locale: 'ko_KR',
    siteName: 'Hae02y Devlog',
    title: mePageTitle,
    description: mePageDescription,
    url: mePageUrl,
    firstName: '해영',
    lastName: '정',
    username: 'hae02y',
    images: [{ url: `${siteUrl}/img/me.jpg`, width: 800, height: 800, alt: '개발자 정해영 프로필' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: mePageTitle,
    description: mePageDescription,
    images: [`${siteUrl}/img/me.jpg`],
  },
  alternates: {
    canonical: mePageUrl,
  },
};

const profilePageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${mePageUrl}#profilepage`,
  url: mePageUrl,
  name: mePageTitle,
  alternateName: ['개발자 정해영', '정해영 개발자', '백엔드 정해영', '정해영 백엔드 개발자', 'hae02y 개발자', 'Haeyoung Jeong developer'],
  description: mePageDescription,
  inLanguage: 'ko',
  mainEntity: {
    '@type': 'Person',
    '@id': `${siteUrl}#person`,
    name: '정해영',
    alternateName: ['hae02y', 'Haeyoung Jeong', '개발자 정해영', '정해영 개발자', '백엔드 정해영'],
    jobTitle: 'Backend Developer',
    description: 'Java, Spring Boot, AWS, Kubernetes, AI/인프라 기반 시스템을 설계하고 운영하는 백엔드 개발자',
    url: mePageUrl,
    image: `${siteUrl}/img/me.jpg`,
    sameAs: [
      'https://github.com/hae02y',
      'https://linkedin.com/in/hae02y',
      'https://brunch.co.kr/@hae02y',
    ],
    knowsAbout: ['Java', 'Spring Boot', 'Spring Security', 'JPA', 'MyBatis', 'AWS', 'NCP', 'Docker', 'Kubernetes', 'Backend Development', 'Infra', 'DevOps', 'AI', 'MLOps'],
  },
};

export default function MePage() {
  const portfolioData = getPortfolioData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
      />
      <MePageClient portfolioData={portfolioData} />
    </>
  );
}
