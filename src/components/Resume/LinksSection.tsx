import React from 'react';
import { Github, Mail, Linkedin, ExternalLink } from 'lucide-react';

interface Link {
  name: string;
  url: string;
  icon: string;
}

interface LinksSectionProps {
  links: Link[];
}

export default function LinksSection({ links }: LinksSectionProps) {
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'github':
        return <Github size={24} />;
      case 'mail':
        return <Mail size={24} />;
      case 'linkedin':
        return <Linkedin size={24} />;
      default:
        return <ExternalLink size={24} />;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-center font-mono space-x-6">
        {links.map((link) => (
          <a 
            key={link.name}
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-[var(--secondary)] hover:text-[var(--primary)] transition-colors duration-200 group"
          >
            <div className="group-hover:scale-110 transition-transform duration-200">
              {getIcon(link.icon)}
            </div>
            <span className="font-medium">{link.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
} 