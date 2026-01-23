import React from 'react';
import {BriefcaseBusiness, FolderKanban} from 'lucide-react';
import type {ExperienceItem} from '@site/src/data/resume-experience';

type ExperienceTimelineProps = {
  items: ExperienceItem[];
};

export default function ExperienceTimeline({items}: ExperienceTimelineProps) {
  if (!items?.length) return null;

  return (
    <div className="resume-timeline">
      {items.map((item, index) => (
        <div
          key={`${item.company}-${item.period}`}
          className={`resume-timeline-item${index === items.length - 1 ? ' is-last' : ''}`}
        >
          <div className="resume-timeline-left">
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
              <div className="resume-timeline-role">{item.role}</div>
              <div className="resume-timeline-period">{item.period}</div>
              {item.highlight ? (
                <div className="resume-timeline-highlight">{item.highlight}</div>
              ) : null}
            </div>
          </div>
          <div className="resume-timeline-right">
            <div className="resume-timeline-project-group">
              {item.projects.map((project, projectIndex) => (
                <div key={project.title} className="resume-project-item">
                  <div className="resume-project-separator">
                    <span className="resume-project-dot" />
                    {projectIndex < item.projects.length - 1 ? (
                      <span className="resume-project-connector" />
                    ) : null}
                  </div>
                  <div className="resume-project-content">
                    <div className="resume-timeline-project-title">
                      <FolderKanban
                        className="resume-project-icon"
                        size={15}
                        color="#3a7bd5"
                        aria-hidden="true"
                      />
                      {project.title}
                    </div>
                    {project.summary ? (
                      <div className="resume-timeline-project-summary">{project.summary}</div>
                    ) : null}
                    {project.bullets?.length ? (
                      <ul className="resume-timeline-project-list">
                        {project.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                    {project.techStack ? (
                      <div className="resume-timeline-project-tech">Tech Stack: {project.techStack}</div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
