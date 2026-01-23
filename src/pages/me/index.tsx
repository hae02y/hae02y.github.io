import React from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import ResumeContent from '@site/src/content/me/resume.mdx';
import PortfolioContent from '@site/src/content/me/portfolio.mdx';
import MeLayout from '@site/src/components/MeLayout';

export default function Me() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const activeTab = params.get('tab') === 'portfolio' ? 'portfolio' : 'resume';

  return (
    <MeLayout title="Me">
      <div className="me-tabs">
        <Link
          className={`me-tab${activeTab === 'resume' ? ' is-active' : ''}`}
          to="/me?tab=resume"
          aria-current={activeTab === 'resume' ? 'page' : undefined}
        >
          Resume
        </Link>
        <Link
          className={`me-tab${activeTab === 'portfolio' ? ' is-active' : ''}`}
          to="/me?tab=portfolio"
          aria-current={activeTab === 'portfolio' ? 'page' : undefined}
        >
          Portfolio
        </Link>
      </div>
      <div>{activeTab === 'portfolio' ? <PortfolioContent /> : <ResumeContent />}</div>
    </MeLayout>
  );
}
