'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { siteConfig } from '@/config/site';

const ResumeContent = dynamic(() => import('@/components/Resume'), { ssr: false });
const PortfolioList = dynamic(() => import('@/components/portfolio/PortfolioList'), { ssr: false });

type PortfolioData = {
  companyTimelineItems: any[];
  soloItems: any[];
};

function MeContent({ portfolioData }: { portfolioData: PortfolioData }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') === 'portfolio' ? 'portfolio' : 'resume';

  return (
    <MeLayout>
      <div className="me-tabs">
        <Link
          className={`me-tab${activeTab === 'resume' ? ' is-active' : ''}`}
          href="/me?tab=resume"
          aria-current={activeTab === 'resume' ? 'page' : undefined}
        >
          Resume
        </Link>
        <Link
          className={`me-tab${activeTab === 'portfolio' ? ' is-active' : ''}`}
          href="/me?tab=portfolio"
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
          <ResumeContent
              profile={siteConfig.profile as any}
              skills={siteConfig.skills}
              experience={siteConfig.experience as any}
              links={siteConfig.terminalLinks as any}
              resumeUrl="/resume.pdf"
            />
        )}
      </div>
    </MeLayout>
  );
}

function MeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{meLayoutStyles}</style>
      <div className="resume-page" style={{ marginTop: '-64px', paddingTop: 0 }}>
        <div className="resume-container">{children}</div>
      </div>
    </>
  );
}

export default function MePageClient({ portfolioData }: { portfolioData: PortfolioData }) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <MeContent portfolioData={portfolioData} />
    </Suspense>
  );
}

const meLayoutStyles = `
  .main-wrapper { padding-top: 0 !important; }
  .resume-page, .resume-page * { box-sizing: border-box; }
  .resume-page {
    font-family: Pretendard, -apple-system, BlinkMacSystemFont, sans-serif;
    letter-spacing: -0.2px; color: #334155; background: #fff;
    padding-bottom: 2rem; overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    display: flex; flex-direction: column; min-height: 90vh;
  }
  [data-theme='dark'] .resume-page { color: #334155; background: #fff; }
  [data-theme='dark'] .resume-page h1, [data-theme='dark'] .resume-page h2,
  [data-theme='dark'] .resume-page h3, [data-theme='dark'] .resume-page h4,
  [data-theme='dark'] .resume-page h5 { color: #0f172a; }
  [data-theme='dark'] .resume-page p, [data-theme='dark'] .resume-page li { color: #334155; }
  .resume-container { width: 100%; max-width: 50rem; margin: auto; padding: 2.5rem 2rem 0; }
  .me-tabs { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
  .me-tab {
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: 999px; padding: 0.55rem 1.1rem;
    font-size: 0.9rem; font-weight: 700;
    border: 1px solid #e2e8f0; color: #334155; text-decoration: none;
    transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
  }
  .me-tab:hover { border-color: #94a3b8; }
  .me-tab.is-active { background: #0f172a; border-color: #0f172a; color: #fff; }
  .resume-page h1 { font-size: 2.8rem; line-height: 1.2; margin: 0 0 0.8rem; color: #0f172a; }
  @media (max-width: 960px) { .resume-page h1 { font-size: 2.2rem; } }
  .resume-page h2 { font-size: 2rem; line-height: 1.35; margin: 2.5rem 0 1rem; color: #0f172a; }
  .resume-page p { margin: 0 0 0.75rem; font-size: 1.02rem; line-height: 1.62; }
  .resume-page a { color: #3a7bd5; transition: color 0.3s ease; }
  .resume-page a:hover { color: #00d2ff; }
  .resume-page ul { list-style: none; padding: 0; margin: 0 0 0.65rem; }
  .resume-page ul > li { position: relative; padding: 0.1rem 0 0.1rem 1.05rem; margin-bottom: 0.15rem; }
  .resume-page ul > li:before { position: absolute; left: 0; content: "•"; color: #3a7bd5; }
`;
