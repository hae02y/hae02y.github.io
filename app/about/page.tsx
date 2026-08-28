import type { Metadata } from 'next';
import { getAboutContent } from '@/lib/about';
import { getPortfolioData } from '@/lib/portfolio';
import MePageClient from '../me/MePageClient';

const siteUrl = 'https://blog.hae02y.me';
const aboutPageUrl = `${siteUrl}/about/`;
const aboutPageTitle = '개발자 정해영 | 백엔드 개발자 ABOUT - hae02y';
const aboutPageDescription = '정해영(hae02y)은 Java/Spring Boot 기반 백엔드 개발자입니다. AWS, Kubernetes, AI/인프라, DevOps 환경에서 시스템 설계, 운영 자동화, Works를 정리했습니다.';

export const metadata: Metadata = {
  title: aboutPageTitle,
  description: aboutPageDescription,
  authors: [{ name: '정해영', url: aboutPageUrl }],
  creator: '정해영',
  publisher: '정해영',
  category: 'Developer Profile',
  keywords: [
    '정해영',
    '개발자 정해영',
    '정해영 개발자',
    '정해영 백엔드',
    '백엔드 정해영',
    '정해영 백엔드 개발자',
    '정해영 포트폴리오',
    '정해영 작업',
    '정해영 이력서',
    'hae02y',
    'hae02y 개발자',
    'hae02y works',
    'Haeyoung Jeong',
    'Backend Developer',
    'Backend Engineer',
    'Spring Boot',
    'Java',
    'AWS',
    'Kubernetes',
    'DevOps',
  ],
  openGraph: {
    type: 'profile',
    locale: 'ko_KR',
    siteName: 'Hae02y Devlog',
    title: aboutPageTitle,
    description: aboutPageDescription,
    url: aboutPageUrl,
    firstName: '해영',
    lastName: '정',
    username: 'hae02y',
    images: [{ url: `${siteUrl}/img/me.jpg`, width: 800, height: 800, alt: '개발자 정해영 프로필' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: aboutPageTitle,
    description: aboutPageDescription,
    images: [`${siteUrl}/img/me.jpg`],
  },
  alternates: {
    canonical: aboutPageUrl,
    languages: {
      ko: aboutPageUrl,
      en: `${siteUrl}/en/about/`,
    },
  },
};

const profilePageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${aboutPageUrl}#profilepage`,
  url: aboutPageUrl,
  name: aboutPageTitle,
  alternateName: ['개발자 정해영', '정해영 개발자', '백엔드 정해영', '정해영 백엔드 개발자', 'hae02y 개발자', 'Haeyoung Jeong developer'],
  description: aboutPageDescription,
  inLanguage: 'ko',
  mainEntity: {
    '@type': 'Person',
    '@id': `${siteUrl}#person`,
    name: '정해영',
    alternateName: ['hae02y', 'Haeyoung Jeong', '개발자 정해영', '정해영 개발자', '백엔드 정해영'],
    jobTitle: 'Backend Developer',
    description: 'Java, Spring Boot, AWS, Kubernetes, AI/인프라 기반 시스템을 설계하고 운영하는 백엔드 개발자',
    url: aboutPageUrl,
    image: `${siteUrl}/img/me.jpg`,
    sameAs: [
      'https://github.com/hae02y',
      'https://linkedin.com/in/hae02y',
      'https://brunch.co.kr/@hae02y',
    ],
    knowsAbout: ['Java', 'Spring Boot', 'Spring Security', 'JPA', 'MyBatis', 'AWS', 'NCP', 'Docker', 'Kubernetes', 'Backend Development', 'Infra', 'DevOps', 'AI', 'MLOps'],
  },
};

export default function AboutPage() {
  const portfolioData = getPortfolioData();
  const aboutContent = getAboutContent('ko');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
      />
      <MePageClient
        portfolioData={portfolioData}
        aboutContent={aboutContent.content}
        basePath="/about/"
        languageSwitch={{ href: '/en/about/', label: 'EN' }}
      />
    </>
  );
}
