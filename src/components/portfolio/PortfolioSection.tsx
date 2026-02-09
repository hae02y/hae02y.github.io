import React from 'react';
import Link from '@docusaurus/Link';

export type PortfolioItem = {
  title: string;
  summary: string;
  role: string;
  period: string;
  techStack: string;
  href?: string;
  companyName?: string;
};

export type PortfolioSectionType = {
  title: string;
  items: PortfolioItem[];
};

type PortfolioSectionProps = {
  section: PortfolioSectionType;
};

export default function PortfolioSection({section}: PortfolioSectionProps) {
  if (!section.items.length) return null;

  return (
    <section className="portfolio-section">
      <h2>{section.title}</h2>
      <div className="portfolio-grid">
        {section.items.map((item) => {
          const metaParts = [item.companyName, item.role, item.period, item.techStack].filter(Boolean);

          return (
            <article key={item.title} className="portfolio-card">
              <div className="portfolio-card-header">
                <h3>{item.title}</h3>
                {item.period ? <span className="portfolio-card-period">{item.period}</span> : null}
              </div>
              <p className="portfolio-card-summary">{item.summary}</p>
              {metaParts.length ? (
                <div className="portfolio-card-meta">{metaParts.join(' · ')}</div>
              ) : null}
              {item.href ? (
                <Link className="portfolio-card-link" to={item.href}>
                  상세 보기 →
                </Link>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
