'use client';

import React from 'react';
import CompanyTimeline from '@/components/portfolio/CompanyTimeline';
import type { CompanyTimelineData, PortfolioItemData } from '@/lib/portfolio';

type TocItem = {
  id: string;
  label: string;
  level: 'section' | 'child';
  indexLabel?: string;
};

type PortfolioListProps = {
  companyTimelineItems?: CompanyTimelineData[];
  soloItems?: PortfolioItemData[];
  labels?: {
    professional: string;
    independent: string;
    tocKicker: string;
    tocTitle: string;
    collapse: string;
    expand: string;
  };
};

export default function PortfolioList({
  companyTimelineItems = [],
  soloItems = [],
  labels = {
    professional: 'Professional',
    independent: 'Independent',
    tocKicker: 'Profile Map',
    tocTitle: 'On this page',
    collapse: 'Collapse',
    expand: 'Expand',
  },
}: PortfolioListProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isSoloExpanded, setIsSoloExpanded] = React.useState(true);
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

  const tocItems: TocItem[] = [
    ...(companyTimelineItems.length
      ? [
          { id: 'portfolio-company', label: labels.professional, level: 'section' as const, indexLabel: '01' },
          ...companyTimelineItems.map(item => ({ id: item.companyId, label: item.company, level: 'child' as const })),
        ]
      : []),
    ...(soloTimelineItems.length
      ? [
          { id: 'portfolio-solo', label: labels.independent, level: 'section' as const, indexLabel: companyTimelineItems.length ? '02' : '01' },
          ...soloTimelineItems.map(item => ({ id: item.companyId, label: item.company, level: 'child' as const })),
        ]
      : []),
  ].filter(item => item.label && item.id);

  React.useEffect(() => {
    if (!tocItems.length) return undefined;

    const observer = new IntersectionObserver(
      entries => {
        const visibleEntry = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) setActiveTocId(visibleEntry.target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    tocItems.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [tocItems]);

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
              aria-label={isExpanded ? labels.collapse : labels.expand}
            >
              <span className="portfolio-toggle-dot" aria-hidden="true" />
              <span className={`portfolio-toggle-icon${isExpanded ? ' is-expanded' : ''}`} aria-hidden="true" />
            </button>
          </div>
          <CompanyTimeline items={companyTimelineItems} showProjects={isExpanded} />
        </section>
      ) : null}
      {soloTimelineItems.length ? (
        <section className="portfolio-section" id="portfolio-solo">
          <div className="portfolio-section-header">
            <h2>{labels.independent}</h2>
            <button
              className="portfolio-toggle"
              type="button"
              onClick={() => setIsSoloExpanded(prev => !prev)}
              aria-pressed={isSoloExpanded}
              aria-label={isSoloExpanded ? labels.collapse : labels.expand}
            >
              <span className="portfolio-toggle-dot" aria-hidden="true" />
              <span className={`portfolio-toggle-icon${isSoloExpanded ? ' is-expanded' : ''}`} aria-hidden="true" />
            </button>
          </div>
          <CompanyTimeline items={soloTimelineItems} showProjects={isSoloExpanded} />
        </section>
      ) : null}
      {tocItems.length ? (
        <div className="portfolio-toc-wrapper" aria-label="Portfolio navigation">
          <div className="portfolio-toc-tab" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <aside className="portfolio-toc">
            <div className="portfolio-toc-kicker">{labels.tocKicker}</div>
            <div className="portfolio-toc-title">{labels.tocTitle}</div>
            <nav>
              <ul>
                {tocItems.map((item) => (
                  <li key={item.id} className={`portfolio-toc-item is-${item.level}`}>
                    <a
                      href={`#${item.id}`}
                      className={activeTocId === item.id ? 'is-active' : undefined}
                      onClick={() => setActiveTocId(item.id)}
                    >
                      <span className="portfolio-toc-index">{item.indexLabel ?? ''}</span>
                      <span className="portfolio-toc-label">{item.label}</span>
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
