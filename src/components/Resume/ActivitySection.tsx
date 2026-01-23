import React from 'react';
import {Users} from 'lucide-react';
import type {ActivityItem} from '@site/src/data/resume-activities';

type ActivitySectionProps = {
  items: ActivityItem[];
};

export default function ActivitySection({items}: ActivitySectionProps) {
  if (!items?.length) return null;

  return (
    <div className="resume-activities">
      {items.map((item) => (
        <div key={item.title} className="resume-activity-item">
          <div className="resume-activity-header">
            <div>
              <div className="resume-activity-title">
                <Users
                  className="resume-inline-icon"
                  size={15}
                  color="#3a7bd5"
                  aria-hidden="true"
                />
                {item.title}
              </div>
              {item.subtitle ? (
                <div className="resume-activity-subtitle">{item.subtitle}</div>
              ) : null}
            </div>
            {item.tags?.length ? (
              <div className="resume-activity-tags">
                {item.tags.map((tag) => (
                  <span key={tag} className="resume-activity-tag">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          {item.bullets?.length ? (
            <ul className="resume-activity-list">
              {item.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}
