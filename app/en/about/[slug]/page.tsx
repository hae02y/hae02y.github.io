import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPortfolioProjects, getPortfolioProjectBySlug } from '@/lib/portfolio';
import { siteConfig } from '@/config/site';
import '../../../me/me-styles.css';

export function generateStaticParams() {
  return getAllPortfolioProjects('en').map(project => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getPortfolioProjectBySlug(decodeURIComponent(params.slug), 'en');
  if (!project) return {};

  return {
    title: `${project.title} | Portfolio`,
    description: project.summary,
    authors: [{ name: 'Haeyoung Jeong', url: `${siteConfig.url}/en/about/` }],
    creator: 'Haeyoung Jeong',
    publisher: 'Haeyoung Jeong',
    keywords: [
      'Haeyoung Jeong',
      'hae02y',
      'hae02y portfolio',
      'backend developer',
      'backend engineer',
      project.title,
      project.category,
      project.role,
      ...project.techStack.split(',').map(tech => tech.trim()),
    ],
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `${siteConfig.url}/en/about/${project.slug}/`,
      locale: 'en_US',
    },
    alternates: {
      canonical: `${siteConfig.url}/en/about/${project.slug}/`,
      languages: {
        ko: `${siteConfig.url}/about/${project.slug}/`,
        en: `${siteConfig.url}/en/about/${project.slug}/`,
      },
    },
  };
}

export default function EnglishPortfolioDetailPage({ params }: { params: { slug: string } }) {
  const project = getPortfolioProjectBySlug(decodeURIComponent(params.slug), 'en');
  if (!project) notFound();

  return (
    <div className="resume-page" lang="en">
      <main className="resume-container">
        <Link href="/en/about/?tab=portfolio" className="resume-project-link">
          ← Back to Portfolio
        </Link>

        <article className="portfolio-detail">
          <div className="portfolio-detail-meta">
            {[project.company, project.period, project.role, project.category].filter(Boolean).join(' · ')}
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
