import type { Metadata } from 'next';
import ThemeProvider from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import { siteConfig } from '@/config/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: '정해영 | 백엔드 개발자 기술블로그 — Hae02y Devlog',
    template: `%s | ${siteConfig.title}`,
  },
  description: '정해영(hae02y) 백엔드 개발자의 기술 블로그. Java, Spring Boot, AWS, Kubernetes, DevOps 등 백엔드·인프라 기술을 다룹니다.',
  keywords: [
    '정해영', '정해영 개발자', 'hae02y', '백엔드 개발자', 'Backend Engineer',
    '기술 블로그', 'Spring Boot', 'Java', 'AWS', 'Kubernetes', 'DevOps',
    'VEStellaLab', '정해영 블로그', 'hae02y blog',
  ],
  authors: [{ name: '정해영', url: siteConfig.url }],
  creator: '정해영',
  publisher: '정해영',
  alternates: {
    canonical: siteConfig.url,
    types: {
      'application/rss+xml': `${siteConfig.url}/rss.xml`,
      'application/atom+xml': `${siteConfig.url}/atom.xml`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteConfig.url,
    siteName: siteConfig.title,
    title: '정해영 | 백엔드 개발자 기술블로그',
    description: '정해영(hae02y) 백엔드 개발자의 기술 블로그. Java, Spring Boot, AWS, Kubernetes 등 백엔드·인프라 기술을 다룹니다.',
    images: [
      {
        url: `${siteConfig.url}/img/me.jpg`,
        width: 800,
        height: 800,
        alt: '정해영 프로필',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '정해영 | 백엔드 개발자 기술블로그',
    description: '정해영(hae02y) 백엔드 개발자의 기술 블로그.',
    images: [`${siteConfig.url}/img/me.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'sAUHghg81eclefIthjNm4YeM-XmjlM5HeCADnR8dKOA',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}#website`,
      url: siteConfig.url,
      name: '정해영 기술블로그 | Hae02y Devlog',
      alternateName: ['정해영 블로그', 'hae02y', 'Hae02y Devlog'],
      description: '정해영(hae02y) 백엔드 개발자의 기술 블로그',
      inLanguage: 'ko',
      publisher: { '@id': `${siteConfig.url}#person` },
    },
    {
      '@type': 'Person',
      '@id': `${siteConfig.url}#person`,
      name: '정해영',
      givenName: '해영',
      familyName: '정',
      alternateName: ['hae02y', 'Haeyoung Jeong'],
      jobTitle: 'Backend Engineer',
      description: 'Java, Spring Boot, AWS, Kubernetes 기반 백엔드 개발자',
      url: siteConfig.url,
      image: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/img/me.jpg`,
        width: 800,
        height: 800,
      },
      email: siteConfig.author.email,
      sameAs: [
        siteConfig.links.github,
        siteConfig.links.linkedin,
        `mailto:${siteConfig.author.email}`,
      ],
      worksFor: {
        '@type': 'Organization',
        name: 'VEStellaLab',
        url: 'https://vestellalab.com',
      },
      knowsAbout: [
        'Java', 'Spring Boot', 'Spring Security', 'JPA', 'MyBatis',
        'AWS', 'Docker', 'Kubernetes', 'MySQL', 'Redis',
        'CI/CD', 'DevOps', 'Backend Development',
      ],
    },
    {
      '@type': 'Blog',
      '@id': `${siteConfig.url}#blog`,
      name: '정해영 기술블로그',
      description: '백엔드, 인프라, DevOps 기술 블로그',
      url: `${siteConfig.url}/blog`,
      inLanguage: 'ko',
      author: { '@id': `${siteConfig.url}#person` },
      publisher: {
        '@type': 'Organization',
        name: 'Hae02y Devlog',
        logo: { '@type': 'ImageObject', url: `${siteConfig.url}/img/me.jpg` },
      },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${siteConfig.url}/me#profilepage`,
      url: `${siteConfig.url}/me`,
      name: '정해영 이력서',
      mainEntity: { '@id': `${siteConfig.url}#person` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/img/sitelogo.ico" />
        <link rel="alternate" type="application/rss+xml" title="정해영 기술블로그 RSS" href="/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="정해영 기술블로그 Atom" href="/atom.xml" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <meta name="naver-site-verification" content="YOUR_NAVER_VERIFICATION_CODE" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <div className="main-wrapper">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
