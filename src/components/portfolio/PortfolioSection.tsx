import React from 'react';
import Link from '@docusaurus/Link';
import type {PortfolioSection as PortfolioSectionType} from '@site/src/data/portfolio-items';

type PortfolioSectionProps = {
  section: PortfolioSectionType;
};

export default function PortfolioSection({section}: PortfolioSectionProps) {
  if (!section.items.length) return null;

  return (
    <section className="portfolio-section">
      <h2>{section.title}</h2>
      <div className="portfolio-grid">
        {[...section.items]
          .sort((a, b) => b.order - a.order)
          .map((item) => (
          <article key={item.title} className="portfolio-card">
            <div className="portfolio-card-header">
              <h3>{item.title}</h3>
              <span className="portfolio-card-period">{item.period}</span>
            </div>
            <p className="portfolio-card-summary">{item.summary}</p>
            <div className="portfolio-card-meta">
              {item.role} · {item.period} · {item.techStack}
            </div>
            <Link className="portfolio-card-link" to={item.href}>
              상세 보기 →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
