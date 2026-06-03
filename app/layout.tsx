import type { Metadata } from 'next';
import ThemeProvider from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import { siteConfig } from '@/config/site';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  keywords: '정해영, hae02y, 백엔드 개발자, Backend Engineer, 기술 블로그, Spring Boot, AWS',
  authors: [{ name: siteConfig.author.name }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteConfig.url,
    siteName: siteConfig.title,
    images: [{ url: `${siteConfig.url}/img/me.jpg` }],
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
      name: siteConfig.title,
      alternateName: '정해영 기술블로그',
      inLanguage: 'ko',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteConfig.url}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Person',
      '@id': `${siteConfig.url}#person`,
      name: siteConfig.author.name,
      alternateName: siteConfig.author.handle,
      jobTitle: siteConfig.author.jobTitle,
      url: siteConfig.url,
      image: `${siteConfig.url}/img/me.jpg`,
      sameAs: [siteConfig.links.github, siteConfig.links.linkedin, `mailto:${siteConfig.author.email}`],
      worksFor: { '@type': 'Organization', name: 'VEStellaLab' },
    },
    {
      '@type': 'Blog',
      '@id': `${siteConfig.url}#blog`,
      name: siteConfig.title,
      url: `${siteConfig.url}/blog`,
      inLanguage: 'ko',
      author: { '@id': `${siteConfig.url}#person` },
      publisher: {
        '@type': 'Organization',
        name: siteConfig.title,
        logo: { '@type': 'ImageObject', url: `${siteConfig.url}/img/me.jpg` },
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/img/sitelogo.ico" />
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
