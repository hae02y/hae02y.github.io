'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ResumePage from '@/components/ResumePage';
import PortfolioList from '@/components/portfolio/PortfolioList';
import type { PortfolioData } from '@/lib/portfolio';
import './me-styles.css';

function MeContent({ portfolioData }: { portfolioData: PortfolioData }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') === 'portfolio' ? 'portfolio' : 'resume';

  return (
    <div className="resume-page">
      <div className="resume-container">
        <div className="me-tabs">
          <Link
            className={`me-tab${activeTab === 'resume' ? ' is-active' : ''}`}
            href="/me/?tab=resume"
            aria-current={activeTab === 'resume' ? 'page' : undefined}
          >
            Resume
          </Link>
          <Link
            className={`me-tab${activeTab === 'portfolio' ? ' is-active' : ''}`}
            href="/me/?tab=portfolio"
            aria-current={activeTab === 'portfolio' ? 'page' : undefined}
          >
            Portfolio
          </Link>
        </div>
        <div>
          {activeTab === 'portfolio' ? (
            <PortfolioList
              companyTimelineItems={portfolioData.companyTimelineItems}
              soloItems={portfolioData.soloItems}
            />
          ) : (
            <ResumePage />
          )}
        </div>
      </div>
    </div>
  );
}

export default function MePageClient({ portfolioData }: { portfolioData: PortfolioData }) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <MeContent portfolioData={portfolioData} />
    </Suspense>
  );
}
