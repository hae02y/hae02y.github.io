import React from 'react';
import {GraduationCap} from 'lucide-react';
import type {EducationItem} from '@/config/me';

type EducationSectionProps = {
  items: EducationItem[];
};

export default function EducationSection({items}: EducationSectionProps) {
  if (!items?.length) return null;

  return (
    <div className="resume-education">
      {items.map((item) => (
        <div key={item.school} className="resume-education-item">
          <div className="resume-education-icon" aria-hidden="true">
            <GraduationCap
              size={17}
              color="currentColor"
              aria-hidden="true"
            />
          </div>
          <div className="resume-education-content">
            <div className="resume-education-header">
              <span className="resume-education-school">{item.school}</span>
              <span className="resume-education-period">{item.period}</span>
            </div>
            <div className="resume-education-program">{item.program}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
