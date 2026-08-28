import { getAboutContent, type AboutLocale } from '@/lib/about';
import { getPortfolioData } from '@/lib/portfolio';
import { aboutI18n, createAboutJsonLd } from '@/i18n/about';
import { getLocalizedMeConfig } from '@/i18n/me';
import MePageClient from '../../../app/me/MePageClient';

type AboutPageClientProps = {
  locale: AboutLocale;
};

export default function AboutPageClient({ locale }: AboutPageClientProps) {
  const config = aboutI18n[locale];
  const resumeData = getLocalizedMeConfig(locale);
  const portfolioData = getPortfolioData(locale);
  const aboutContent = getAboutContent(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(createAboutJsonLd(locale)) }}
      />
      <MePageClient
        portfolioData={portfolioData}
        resumeData={resumeData}
        aboutContent={aboutContent.content}
        basePath={config.path}
        lang={config.lang}
        languageSwitch={{ href: config.switchHref, label: config.switchLabel }}
        labels={config.labels}
      />
    </>
  );
}
