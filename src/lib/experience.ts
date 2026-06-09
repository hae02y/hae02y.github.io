import type { ExperienceItem } from '@/config/me';

const PERIOD_RANGE_REGEX = /(\d{4})\.(\d{2})\s*-\s*(\d{4})\.(\d{2})/;
const PERIOD_CURRENT_REGEX = /(\d{4})\.(\d{2})\s*-\s*재직중/;

const toMonthIndex = (year: number, month: number) => year * 12 + (month - 1);

const parsePeriodRange = (period: string) => {
  const rangeMatch = period.match(PERIOD_RANGE_REGEX);
  if (rangeMatch) {
    const startYear = Number(rangeMatch[1]);
    const startMonth = Number(rangeMatch[2]);
    const endYear = Number(rangeMatch[3]);
    const endMonth = Number(rangeMatch[4]);
    if (Number.isNaN(startYear) || Number.isNaN(startMonth)) return null;
    if (Number.isNaN(endYear) || Number.isNaN(endMonth)) return null;
    const start = toMonthIndex(startYear, startMonth);
    const end = toMonthIndex(endYear, endMonth);
    return start <= end ? { start, end } : { start: end, end: start };
  }

  const currentMatch = period.match(PERIOD_CURRENT_REGEX);
  if (currentMatch) {
    const startYear = Number(currentMatch[1]);
    const startMonth = Number(currentMatch[2]);
    if (Number.isNaN(startYear) || Number.isNaN(startMonth)) return null;
    const now = new Date();
    const start = toMonthIndex(startYear, startMonth);
    const end = toMonthIndex(now.getFullYear(), now.getMonth() + 1);
    return start <= end ? { start, end } : { start: end, end: start };
  }

  return null;
};

const mergeRanges = (ranges: Array<{ start: number; end: number }>) => {
  if (!ranges.length) return [];
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const merged: Array<{ start: number; end: number }> = [sorted[0]];

  for (let i = 1; i < sorted.length; i += 1) {
    const current = sorted[i];
    const last = merged[merged.length - 1];
    if (current.start <= last.end + 1) {
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
};

const formatTotalExperience = (totalMonths: number) => {
  if (totalMonths <= 0) return null;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years > 0 && months > 0) return `${years}년 ${months}개월`;
  if (years > 0) return `${years}년`;
  return `${months}개월`;
};

export const getTotalExperienceLabel = (items: ExperienceItem[]) => {
  const ranges = items
    .map(item => (item.period ? parsePeriodRange(item.period) : null))
    .filter((range): range is { start: number; end: number } => Boolean(range));
  const mergedRanges = mergeRanges(ranges);
  const totalMonths = mergedRanges.reduce((sum, range) => sum + (range.end - range.start + 1), 0);
  return formatTotalExperience(totalMonths);
};
