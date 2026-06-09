import React from 'react';
import {Users} from 'lucide-react';
import type {ActivityItem} from '@/config/me';

type ActivitySectionProps = {
  items: ActivityItem[];
};

export default function ActivitySection({items}: ActivitySectionProps) {
  if (!items?.length) return null;

  const renderBullet = (bullet: string) => {
    const nodes: React.ReactNode[] = [];
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null = null;

    while ((match = linkPattern.exec(bullet)) !== null) {
      const [fullMatch, text, url] = match;
      const matchIndex = match.index;

      if (matchIndex > lastIndex) {
        nodes.push(bullet.slice(lastIndex, matchIndex));
      }

      nodes.push(
        <a
          key={`${matchIndex}-${text}`}
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          {text}
        </a>
      );

      lastIndex = matchIndex + fullMatch.length;
    }

    if (lastIndex < bullet.length) {
      nodes.push(bullet.slice(lastIndex));
    }

    return nodes.length ? nodes : bullet;
  };

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
          {item.bulletGroups?.length ? (
            <div className="resume-activity-group-list">
              {item.bulletGroups.map((group) => (
                <div key={group.title} className="resume-activity-group">
                  <div className="resume-activity-group-title">{group.title}</div>
                  <ul className="resume-activity-list">
                    {group.bullets.map((bullet) => (
                      <li key={bullet}>{renderBullet(bullet)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : item.bullets?.length ? (
            <ul className="resume-activity-list">
              {item.bullets.map((bullet) => (
                <li key={bullet}>{renderBullet(bullet)}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}
