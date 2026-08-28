'use client';

import React from 'react';
import CompanyTimeline from '@/components/portfolio/CompanyTimeline';
import type { CompanyTimelineData, PortfolioItemData } from '@/lib/portfolio';

type PortfolioListProps = {
  companyTimelineItems?: CompanyTimelineData[];
  soloItems?: PortfolioItemData[];
  labels?: {
    professional: string;
    independent: string;
  };
};

export default function PortfolioList({
  companyTimelineItems = [],
  soloItems = [],
  labels = {
    professional: 'Professional',
    independent: 'Independent',
  },
}: PortfolioListProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [activeTocId, setActiveTocId] = React.useState<string | null>(null);

  const soloTimelineItems = Array.from(
    soloItems.reduce((groups, item) => {
      const category = item.category || 'Independent';
      groups.set(category, [...(groups.get(category) ?? []), item]);
      return groups;
    }, new Map<string, PortfolioItemData[]>()),
  ).map(([category, projects]) => ({
    company: category,
    companyId: `id-independent-${encodeURIComponent(category).replace(/%/g, '-')}`,
    period: '',
    projects,
  }));

  const tocItems = [
    ...companyTimelineItems.map(item => ({ id: item.companyId, label: item.company })),
    ...soloTimelineItems.map(item => ({ id: item.companyId, label: item.company })),
  ].filter(item => item.label && item.id);

  return (
    <div>
      {companyTimelineItems.length ? (
        <section className="portfolio-section" id="portfolio-company">
          <div className="portfolio-section-header">
            <h2>{labels.professional}</h2>
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
          <h2>{labels.independent}</h2>
          <CompanyTimeline items={soloTimelineItems} />
        </section>
      ) : null}
      {tocItems.length ? (
        <div className="portfolio-toc-wrapper" aria-label="Works navigation">
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
