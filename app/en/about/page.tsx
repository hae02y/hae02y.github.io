import type { Metadata } from 'next';
import { getAboutContent } from '@/lib/about';
import { getPortfolioData } from '@/lib/portfolio';
import MePageClient from '../../me/MePageClient';

const siteUrl = 'https://blog.hae02y.me';
const aboutPageUrl = `${siteUrl}/en/about/`;
const koAboutPageUrl = `${siteUrl}/about/`;
const aboutPageTitle = 'Haeyoung Jeong | Backend Developer ABOUT - hae02y';
const aboutPageDescription = 'Haeyoung Jeong, also known as hae02y, is a backend developer working across Java, Spring Boot, cloud infrastructure, DevOps, AI automation, operations, and practical systems.';

export const metadata: Metadata = {
  title: aboutPageTitle,
  description: aboutPageDescription,
  authors: [{ name: 'Haeyoung Jeong', url: aboutPageUrl }],
  creator: 'Haeyoung Jeong',
  publisher: 'Haeyoung Jeong',
  category: 'Developer Profile',
  keywords: [
    'Haeyoung Jeong',
    'hae02y',
    'hae02y developer',
    'hae02y works',
    'backend developer',
    'backend engineer',
    'Java developer',
    'Spring Boot developer',
    'cloud infrastructure',
    'DevOps',
    'Kubernetes',
    'AWS',
    'AI automation',
  ],
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    siteName: 'Hae02y Devlog',
    title: aboutPageTitle,
    description: aboutPageDescription,
    url: aboutPageUrl,
    firstName: 'Haeyoung',
    lastName: 'Jeong',
    username: 'hae02y',
    images: [{ url: `${siteUrl}/img/me.jpg`, width: 800, height: 800, alt: 'Haeyoung Jeong profile' }],
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
      ko: koAboutPageUrl,
      en: aboutPageUrl,
    },
  },
};

const profilePageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${aboutPageUrl}#profilepage`,
  url: aboutPageUrl,
  name: aboutPageTitle,
  alternateName: ['hae02y developer', 'Haeyoung Jeong developer', 'Backend developer hae02y'],
  description: aboutPageDescription,
  inLanguage: 'en',
  mainEntity: {
    '@type': 'Person',
    '@id': `${siteUrl}#person`,
    name: 'Haeyoung Jeong',
    alternateName: ['hae02y', '정해영', 'Backend developer hae02y'],
    jobTitle: 'Backend Developer',
    description: 'Backend developer designing and operating systems across Java, Spring Boot, AWS, Kubernetes, AI automation, and infrastructure.',
    url: aboutPageUrl,
    image: `${siteUrl}/img/me.jpg`,
    sameAs: [
      'https://github.com/hae02y',
      'https://linkedin.com/in/hae02y',
      'https://brunch.co.kr/@hae02y',
    ],
    knowsAbout: ['Java', 'Spring Boot', 'AWS', 'NCP', 'Docker', 'Kubernetes', 'Backend Development', 'Infrastructure', 'DevOps', 'AI Automation', 'MLOps'],
  },
};

export default function EnglishAboutPage() {
  const portfolioData = getPortfolioData();
  const aboutContent = getAboutContent('en');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
      />
      <MePageClient
        portfolioData={portfolioData}
        aboutContent={aboutContent.content}
        basePath="/en/about/"
        languageSwitch={{ href: '/about/', label: 'KO' }}
        labels={{
          resume: 'Resume',
          works: 'Works',
          companyWorks: 'Company Works',
          soloWorks: 'Independent Works',
          soloToc: 'Independent Works',
          resumeHeadings: {
            experience: 'Experience',
            keyWork: 'Key Work',
            automation: 'Productivity & Automation',
            activities: 'Activities',
            education: 'Education',
            certifications: 'Certifications',
            links: 'Links',
          },
        }}
      />
    </>
  );
}
