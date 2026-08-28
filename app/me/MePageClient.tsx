'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, type ComponentProps } from 'react';
import ResumePage from '@/components/ResumePage';
import PortfolioList from '@/components/portfolio/PortfolioList';
import type { PortfolioData } from '@/lib/portfolio';
import './me-styles.css';

type MePageClientProps = {
  portfolioData: PortfolioData;
  aboutContent?: string;
  basePath?: string;
  lang?: string;
  languageSwitch?: {
    href: string;
    label: string;
  };
  labels?: {
    resume: string;
    works: string;
    companyWorks: string;
    soloWorks: string;
    soloToc: string;
    resumeHeadings?: ComponentProps<typeof ResumePage>['labels'];
  };
};

function MeContent({
  portfolioData,
  aboutContent,
  basePath = '/about/',
  lang = 'ko',
  languageSwitch,
  labels = {
    resume: 'Resume',
    works: 'Works',
    companyWorks: '회사 작업',
    soloWorks: '개인 작업',
    soloToc: '개인 작업',
  },
}: MePageClientProps) {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const activeTab = tab === 'works' || tab === 'portfolio' ? 'works' : 'resume';

  return (
    <div className="resume-page" lang={lang}>
      <div className="resume-container">
        {languageSwitch ? (
          <div className="about-topbar">
            <Link className="about-language-switch" href={languageSwitch.href} hrefLang={languageSwitch.label.toLowerCase()}>
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
            className={`me-tab${activeTab === 'works' ? ' is-active' : ''}`}
            href={`${basePath}?tab=works`}
            aria-current={activeTab === 'works' ? 'page' : undefined}
          >
            {labels.works}
          </Link>
        </div>
        <div>
          {activeTab === 'works' ? (
            <PortfolioList
              companyTimelineItems={portfolioData.companyTimelineItems}
              soloItems={portfolioData.soloItems}
              labels={{
                companyWorks: labels.companyWorks,
                soloWorks: labels.soloWorks,
                soloToc: labels.soloToc,
              }}
            />
          ) : (
            <ResumePage aboutContent={aboutContent} labels={labels.resumeHeadings} />
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
