import React from 'react';
import type {ExperienceItem} from '@/config/me';
import type { Locale } from '@/i18n/config';
import {getTotalExperienceLabel} from '@/lib/experience';

type ExperienceSummaryProps = {
  items: ExperienceItem[];
  locale?: Locale;
};

export default function ExperienceSummary({items, locale = 'ko'}: ExperienceSummaryProps) {
  const totalExperienceLabel = getTotalExperienceLabel(items, locale);
  if (!totalExperienceLabel) return null;

  return <span className="resume-experience-total">{locale === 'en' ? 'Total experience' : '총경력'} {totalExperienceLabel}</span>;
}
