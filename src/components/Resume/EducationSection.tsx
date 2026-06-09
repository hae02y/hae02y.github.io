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
          <div className="resume-education-school flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="flex items-center">
              <GraduationCap
                className="resume-inline-icon"
                size={15}
                color="#3a7bd5"
                aria-hidden="true"
              />
              {item.school}
            </span>
            <span className="text-sm font-normal text-slate-500">{item.period}</span>
          </div>
          <div className="resume-education-program">{item.program}</div>
        </div>
      ))}
    </div>
  );
}
