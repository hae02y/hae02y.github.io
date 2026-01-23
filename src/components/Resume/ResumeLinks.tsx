import React from 'react';
import {ExternalLink, Github, Link as LinkIcon} from 'lucide-react';
import type {ResumeLink} from '@site/src/data/resume-links';

type ResumeLinksProps = {
  links: ResumeLink[];
};

const iconMap = {
  github: Github,
  blog: LinkIcon,
  medium: ExternalLink,
  link: LinkIcon,
};

export default function ResumeLinks({links}: ResumeLinksProps) {
  if (!links?.length) return null;

  return (
    <div className="resume-links">
      {links.map((link) => {
        const Icon = iconMap[link.icon ?? 'link'] ?? LinkIcon;
        return (
          <a
            key={link.label}
            className="resume-link-item"
            href={link.url}
            target="_blank"
            rel="noreferrer"
          >
            <Icon className="resume-link-icon" aria-hidden="true" />
            <span>{link.label}</span>
          </a>
        );
      })}
    </div>
  );
}
