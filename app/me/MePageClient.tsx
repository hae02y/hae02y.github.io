'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ResumePage from '@/components/ResumePage';
import PortfolioList from '@/components/portfolio/PortfolioList';
import type { AboutPageLabels } from '@/components/about/types';
import type { meConfig } from '@/config/me';
import type { Locale } from '@/i18n/config';
import type { PortfolioData } from '@/lib/portfolio';
import './me-styles.css';

type MePageClientProps = {
  portfolioData: PortfolioData;
  resumeData?: typeof meConfig;
  aboutContent?: string;
  basePath?: string;
  lang?: Locale;
  languageSwitch?: {
    href: string;
    label: string;
  };
  labels?: AboutPageLabels;
};

function MeContent({
  portfolioData,
  resumeData,
  aboutContent,
  basePath = '/about/',
  lang = 'ko',
  languageSwitch,
  labels = {
    resume: 'Resume',
    portfolio: 'Portfolio',
    professional: 'Professional',
    independent: 'Independent',
    tocKicker: 'Navigate',
    tocTitle: 'On this page',
    collapse: 'Collapse',
    expand: 'Expand',
  },
}: MePageClientProps) {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const activeTab = tab === 'works' || tab === 'portfolio' ? 'portfolio' : 'resume';

  return (
    <div className="resume-page" lang={lang}>
      <div className="resume-container">
        {languageSwitch ? (
          <div className="about-topbar">
            <Link
              className="about-language-switch"
              href={activeTab === 'portfolio' ? `${languageSwitch.href}?tab=portfolio` : languageSwitch.href}
              hrefLang={languageSwitch.label.toLowerCase()}
            >
              {languageSwitch.label}
            </Link>
          </div>
        ) : null}
        <div className="me-tabs">
          <Link
            className={`me-tab${activeTab === 'resume' ? ' is-active' : ''}`}
            href={`${basePath}?tab=resume`}
            aria-current={activeTab === 'resume' ? 'page' : undefined}
          >
            {labels.resume}
          </Link>
          <Link
            className={`me-tab${activeTab === 'portfolio' ? ' is-active' : ''}`}
            href={`${basePath}?tab=portfolio`}
            aria-current={activeTab === 'portfolio' ? 'page' : undefined}
          >
            {labels.portfolio}
          </Link>
        </div>
        <div>
          {activeTab === 'portfolio' ? (
            <PortfolioList
              companyTimelineItems={portfolioData.companyTimelineItems}
              soloItems={portfolioData.soloItems}
              soloCategories={portfolioData.soloCategories}
              labels={{
                professional: labels.professional,
                independent: labels.independent,
                tocKicker: labels.tocKicker,
                tocTitle: labels.tocTitle,
                collapse: labels.collapse,
                expand: labels.expand,
              }}
            />
          ) : (
            <ResumePage aboutContent={aboutContent} data={resumeData} locale={lang} labels={labels.resumeHeadings} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function MePageClient(props: MePageClientProps) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <MeContent {...props} />
    </Suspense>
  );
}
