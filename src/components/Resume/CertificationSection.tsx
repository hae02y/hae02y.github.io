import React from 'react';
import {BadgeCheck} from 'lucide-react';
import type {CertificationItem} from '@/data/resume-certifications';

type CertificationSectionProps = {
  items: CertificationItem[];
};

export default function CertificationSection({items}: CertificationSectionProps) {
  if (!items?.length) return null;

  return (
    <div className="resume-certifications">
      {items.map((item) => (
        <div key={`${item.name}-${item.date}`} className="resume-certification-item">
          <div className="resume-certification-name">
            <BadgeCheck
              className="resume-inline-icon"
              size={15}
              color="#3a7bd5"
              aria-hidden="true"
            />
            {item.name}
          </div>
          <div className="resume-certification-meta">
            {item.issuer} · {item.date}
          </div>
        </div>
      ))}
    </div>
  );
}
