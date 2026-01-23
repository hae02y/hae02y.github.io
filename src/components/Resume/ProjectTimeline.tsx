import React from 'react';
import Link from '@docusaurus/Link';
import {FolderKanban} from 'lucide-react';
import type {ResumeProject} from '@site/src/data/resume-projects';

type ProjectTimelineProps = {
  projects: ResumeProject[];
};

export default function ProjectTimeline({projects}: ProjectTimelineProps) {
  if (!projects?.length) return null;

  return (
    <div className="resume-projects">
      {projects.map((project) => (
        <article key={`${project.org}-${project.title}`} className="resume-project-card">
          <div className="resume-project-header">
            <div>
              <div className="resume-project-org">{project.org}</div>
              <div className="resume-project-title">
                <FolderKanban
                  className="resume-inline-icon"
                  size={15}
                  color="#3a7bd5"
                  aria-hidden="true"
                />
                {project.title}
              </div>
            </div>
            <div className="resume-project-period">{project.period}</div>
          </div>
          <ul className="resume-project-list">
            {project.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          {project.linkLabel && project.linkUrl ? (
            <Link className="resume-project-link" to={project.linkUrl}>
              {project.linkLabel}
            </Link>
          ) : null}
        </article>
      ))}
    </div>
  );
}
