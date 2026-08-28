import React from 'react';
import Link from 'next/link';
import {BriefcaseBusiness, FolderKanban} from 'lucide-react';

type CompanyTimelineProject = {
  id?: string;
  title: string;
  summary?: string;
  role?: string;
  period?: string;
  techStack?: string;
  category?: string;
  href?: string;
};

type CompanyTimelineItem = {
  companyId?: string;
  company: string;
  period?: string;
  role?: string;
  summary?: string;
  projects: CompanyTimelineProject[];
};

type CompanyTimelineProps = {
  items: CompanyTimelineItem[];
  showHeader?: boolean;
  showProjects?: boolean;
};

export default function CompanyTimeline({items, showHeader = true, showProjects = true}: CompanyTimelineProps) {
  if (!items?.length) return null;

  if (!showProjects) {
    return (
      <div className="company-timeline-collapsed">
        {items.map((item) => (
          <div key={item.company} className="company-timeline-item" id={item.companyId}>
            {showHeader ? <span className="company-timeline-dot" /> : null}
            <div className="resume-timeline-meta">
              <div className="resume-timeline-company">
                <BriefcaseBusiness
                  className="resume-timeline-icon"
                  size={16}
                  color="#3a7bd5"
                  aria-hidden="true"
                />
                {item.company}
              </div>
              {item.period ? <div className="resume-timeline-period">{item.period}</div> : null}
              {item.role ? <div className="resume-timeline-role">{item.role}</div> : null}
              {item.summary ? <div className="resume-timeline-project-summary">{item.summary}</div> : null}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="resume-timeline">
      {items.map((item, index) => (
        <div
          key={item.company}
          className={`resume-timeline-item${index === items.length - 1 ? ' is-last' : ''}${
            showProjects ? '' : ' is-collapsed'
          }`}
        >
          {showHeader ? (
            <div className="resume-timeline-left">
              <div className="resume-timeline-meta" id={item.companyId}>
                <div className="resume-timeline-company">
                  <BriefcaseBusiness
                    className="resume-timeline-icon"
                    size={16}
                    color="#3a7bd5"
                    aria-hidden="true"
                  />
                  {item.company}
                </div>
                {item.period ? <div className="resume-timeline-period">{item.period}</div> : null}
              </div>
            </div>
          ) : null}
          {showProjects ? (
            <div className="resume-timeline-right">
              <div className="resume-timeline-project-group">
                {item.projects.map((project, projectIndex) => {
                  const metaParts = [project.period, project.role, project.category].filter(Boolean).join(' · ');

                  const content = (
                    <>
                      <div className="resume-project-separator">
                        <span className="resume-project-dot" />
                        {projectIndex < item.projects.length - 1 ? (
                          <span className="resume-project-connector" />
                        ) : null}
                      </div>
                      <div className="resume-project-content">
                        <div className="portfolio-timeline-card">
                          <div className="resume-timeline-project-title">
                            <FolderKanban
                              className="resume-project-icon"
                              size={15}
                              color="#3a7bd5"
                              aria-hidden="true"
                            />
                            {project.title}
                          </div>
                          {metaParts ? (
                            <div className="resume-timeline-project-tech">{metaParts}</div>
                          ) : null}
                          {project.summary ? (
                            <div className="resume-timeline-project-summary">{project.summary}</div>
                          ) : null}
                        </div>
                      </div>
                    </>
                  );

                return project.href ? (
                  <Link
                    key={`${item.company}-${project.title}`}
                    className="resume-project-item resume-project-link-wrapper"
                    href={project.href ?? '#'}
                    id={project.id}
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={`${item.company}-${project.title}`} className="resume-project-item" id={project.id}>
                    {content}
                  </div>
                );
                })}
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
