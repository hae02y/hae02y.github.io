import React from 'react';
import type {ExperienceItem} from '@/config/me';
import {getTotalExperienceLabel} from '@/lib/experience';

type ExperienceSummaryProps = {
  items: ExperienceItem[];
};

export default function ExperienceSummary({items}: ExperienceSummaryProps) {
  const totalExperienceLabel = getTotalExperienceLabel(items);
  if (!totalExperienceLabel) return null;

  return <span className="resume-experience-total">총경력 {totalExperienceLabel}</span>;
}
