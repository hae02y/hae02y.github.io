import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import type { PortfolioItemData } from '@/lib/portfolio';

export const defaultSocialImage = {
  // Use a blog-specific image for link previews so shared blog URLs are not
  // mistaken for a personal profile or the GitHub Pages project.
  url: `${siteConfig.url}/img/sitelogo.png?v=20260922`,
  width: 250,
  height: 250,
  alt: 'Hae02y Devlog 사이트 로고',
};

export function absoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, `${siteConfig.url}/`).toString();
}

export function socialImages(image?: string, alt = defaultSocialImage.alt) {
  if (!image) return [defaultSocialImage];

  return [{
    url: absoluteUrl(image),
    alt,
  }];
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  socialTitle?: string;
  image?: string;
  imageAlt?: string;
  locale?: string;
};

export function createPageMetadata({
  title,
  description,
  path,
  socialTitle = title,
  image,
  imageAlt,
  locale = 'ko_KR',
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const images = socialImages(image, imageAlt);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale,
      siteName: siteConfig.title,
      title: socialTitle,
      description,
      url,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: images.map(({ url: imageUrl }) => imageUrl),
    },
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function createPortfolioJsonLd(project: PortfolioItemData, locale: 'ko' | 'en' = 'ko') {
  const basePath = locale === 'en' ? '/en/about' : '/about';
  const url = absoluteUrl(`${basePath}/${project.slug}/`);

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}#project`,
    url,
    name: project.title,
    description: project.summary,
    inLanguage: locale === 'en' ? 'en-US' : 'ko-KR',
    keywords: [project.category, project.role, ...project.techStack.split(',').map(tech => tech.trim())].filter(Boolean),
    creator: {
      '@type': 'Person',
      '@id': `${siteConfig.url}#person`,
      name: locale === 'en' ? 'Haeyoung Jeong' : siteConfig.author.name,
      url: absoluteUrl(locale === 'en' ? '/en/about/' : '/about/'),
    },
    isPartOf: { '@id': `${absoluteUrl(basePath + '/')}#profilepage` },
  };
}
