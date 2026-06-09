import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPortfolioProjects, getPortfolioProjectBySlug } from '@/lib/portfolio';
import '../me-styles.css';

export function generateStaticParams() {
  return getAllPortfolioProjects().map(project => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getPortfolioProjectBySlug(decodeURIComponent(params.slug));
  if (!project) return {};

  return {
    title: `${project.title} | 포트폴리오`,
    description: project.summary,
  };
}

export default function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const project = getPortfolioProjectBySlug(decodeURIComponent(params.slug));
  if (!project) notFound();

  return (
    <div className="resume-page" style={{ marginTop: '-64px', paddingTop: 0 }}>
      <main className="resume-container">
        <Link href="/me?tab=portfolio" className="resume-project-link">
          ← 포트폴리오로 돌아가기
        </Link>

        <article className="portfolio-detail">
          <div className="portfolio-detail-meta">
            {[project.company, project.period, project.role].filter(Boolean).join(' · ')}
          </div>
          <h1>{project.title}</h1>
          <p className="portfolio-detail-summary">{project.summary}</p>
          <div className="resume-project-techstack">{project.techStack}</div>

          {project.details?.length ? (
            <div className="portfolio-detail-sections">
              {project.details.map(section => (
                <section key={section.title} className="resume-project-card">
                  <h2>{section.title}</h2>
                  <ul className="resume-project-list">
                    {section.bullets.map(bullet => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : null}
        </article>
      </main>
    </div>
  );
}
