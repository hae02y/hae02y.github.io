'use client';

import React from 'react';
import CompanyTimeline from '@/components/portfolio/CompanyTimeline';
import type { CompanyTimelineData, PortfolioItemData } from '@/lib/portfolio';

type PortfolioListProps = {
  companyTimelineItems?: CompanyTimelineData[];
  soloItems?: PortfolioItemData[];
};

export default function PortfolioList({ companyTimelineItems = [], soloItems = [] }: PortfolioListProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [activeTocId, setActiveTocId] = React.useState<string | null>(null);

  const soloTimelineItems = soloItems.length
    ? [{
        company: '',
        companyId: 'id-solo-projects',
        period: '',
        projects: soloItems,
      }]
    : [];

  const tocItems = [
    ...companyTimelineItems.map(item => ({ id: item.companyId, label: item.company })),
    { id: 'portfolio-solo', label: '개인 프로젝트' },
  ].filter(item => item.label && item.id);

  return (
    <div>
      {companyTimelineItems.length ? (
        <section className="portfolio-section" id="portfolio-company">
          <div className="portfolio-section-header">
            <h2>회사 프로젝트</h2>
            <button
              className="portfolio-toggle"
              type="button"
              onClick={() => setIsExpanded(prev => !prev)}
              aria-pressed={isExpanded}
            >
              {isExpanded ? '-' : '+'}
            </button>
          </div>
          <CompanyTimeline items={companyTimelineItems} showProjects={isExpanded} />
        </section>
      ) : null}
      {soloTimelineItems.length ? (
        <section className="portfolio-section" id="portfolio-solo">
          <h2>개인 프로젝트</h2>
          <CompanyTimeline items={soloTimelineItems} showHeader={false} />
        </section>
      ) : null}
      {tocItems.length ? (
        <div className="portfolio-toc-wrapper" aria-label="Portfolio navigation">
          <div className="portfolio-toc-handle" />
          <aside className="portfolio-toc">
            <nav>
              <ul>
                {tocItems.map(item => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={activeTocId === item.id ? 'is-active' : undefined}
                      onClick={() => setActiveTocId(item.id)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
