import React from 'react';
import type {ExperienceItem} from '@site/src/data/resume-experience';
import {getTotalExperienceLabel} from '@site/src/lib/experience';

type ExperienceSummaryProps = {
  items: ExperienceItem[];
};

export default function ExperienceSummary({items}: ExperienceSummaryProps) {
  const totalExperienceLabel = getTotalExperienceLabel(items);
  if (!totalExperienceLabel) return null;

  return <span className="resume-experience-total">총경력 {totalExperienceLabel}</span>;
}
