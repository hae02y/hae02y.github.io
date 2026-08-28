import { getAboutContent, type AboutLocale } from '@/lib/about';
import { getPortfolioData } from '@/lib/portfolio';
import { aboutI18n, createAboutJsonLd } from '@/i18n/about';
import MePageClient from '../../../app/me/MePageClient';

type AboutPageClientProps = {
  locale: AboutLocale;
};

export default function AboutPageClient({ locale }: AboutPageClientProps) {
  const config = aboutI18n[locale];
  const portfolioData = getPortfolioData();
  const aboutContent = getAboutContent(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(createAboutJsonLd(locale)) }}
      />
      <MePageClient
        portfolioData={portfolioData}
        aboutContent={aboutContent.content}
        basePath={config.path}
        lang={config.lang}
        languageSwitch={{ href: config.switchHref, label: config.switchLabel }}
        labels={config.labels}
      />
    </>
  );
}
