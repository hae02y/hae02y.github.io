import React from 'react';
import {GraduationCap} from 'lucide-react';
import type {EducationItem} from '@site/src/data/resume-education';

type EducationSectionProps = {
  items: EducationItem[];
};

export default function EducationSection({items}: EducationSectionProps) {
  if (!items?.length) return null;

  return (
    <div className="resume-education">
      {items.map((item) => (
        <div key={item.school} className="resume-education-item">
          <div className="resume-education-school">
            <GraduationCap
              className="resume-inline-icon"
              size={15}
              color="#3a7bd5"
              aria-hidden="true"
            />
            {item.school}
          </div>
          <div className="resume-education-program">{item.program}</div>
          <div className="resume-education-period">{item.period}</div>
        </div>
      ))}
    </div>
  );
}
