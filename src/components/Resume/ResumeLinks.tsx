import React from 'react';
import {ExternalLink, Github, Link as LinkIcon, AtSignIcon, Linkedin} from 'lucide-react';
import type {ResumeLink} from '@/config/me';

type ResumeLinksProps = {
  links: ResumeLink[];
};

const iconMap = {
  github: Github,
  blog: LinkIcon,
  medium: ExternalLink,
  link: LinkIcon,
  email: AtSignIcon,
  linkedIn : Linkedin,
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
