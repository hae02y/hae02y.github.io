import React from 'react';
import {BriefcaseBusiness} from 'lucide-react';
import type {ExperienceItem} from '@site/src/data/resume-experience';

type ExperienceTimelineProps = {
  items: ExperienceItem[];
};

export default function ExperienceTimeline({items}: ExperienceTimelineProps) {
  if (!items?.length) return null;

  return (
    <div className="resume-timeline resume-experience-timeline">
      {items.map((item, index) => (
        <div
          key={`${item.company}-${item.period}`}
          className={`resume-timeline-item company-timeline-item${
            index === items.length - 1 ? ' is-last' : ''
          }`}
        >
          <div className="portfolio-company-marker">
            <span className="portfolio-company-dot" />
            {index < items.length - 1 ? (
              <span className="portfolio-company-connector" />
            ) : null}
          </div>
          <div className="resume-timeline-meta">
            <div className="resume-timeline-company-row">
              <div className="resume-timeline-company">
                <BriefcaseBusiness
                  className="resume-timeline-icon"
                  size={16}
                  color="#3a7bd5"
                  aria-hidden="true"
                />
                {item.company}
              </div>
              <div className="resume-timeline-period">{item.period}</div>
            </div>
            {item.role ? <div className="resume-timeline-role">{item.role}</div> : null}
            {item.description ? (
              <div className="resume-timeline-summary">{item.description}</div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
