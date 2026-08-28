import type { PortfolioProjectConfig } from '@/config/me';
import { getLocalizedMeConfig } from '@/i18n/me';
import type { Locale } from '@/i18n/config';

export type PortfolioItemData = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  role: string;
  techStack: string;
  category: string;
  period: string;
  href: string;
  details?: PortfolioProjectConfig['details'];
  company?: string;
};

export type CompanyTimelineData = {
  companyId: string;
  company: string;
  period: string;
  role?: string;
  summary?: string;
  projects: PortfolioItemData[];
  order?: number;
};

export type PortfolioData = {
  companyTimelineItems: CompanyTimelineData[];
  soloItems: PortfolioItemData[];
};

const PRESENT_VALUE = Number.POSITIVE_INFINITY;

const normalizePeriodValue = (value?: string) => {
  if (!value) return Number.NEGATIVE_INFINITY;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'present' || normalized === '현재') return PRESENT_VALUE;
  const [yearPart, monthPart] = normalized.split('-');
  const year = Number(yearPart);
  const month = Number(monthPart);
  if (!Number.isFinite(year) || !Number.isFinite(month)) return Number.NEGATIVE_INFINITY;
  return year * 12 + month;
};

const formatPeriod = (start?: string, end?: string, locale: Locale = 'ko') => {
  if (!start && !end) return '';
  const normalizedEnd = end?.trim();
  const presentLabel = locale === 'en' ? 'Present' : '현재';
  const endLabel = normalizedEnd && normalizePeriodValue(normalizedEnd) === PRESENT_VALUE ? presentLabel : normalizedEnd;
  if (start && endLabel) return `${start} ~ ${endLabel}`;
  if (start) return start;
  return endLabel ?? '';
};

const toDomId = (value: string) => `id-${encodeURIComponent(value).replace(/%/g, '-')}`;

const compareProjects = (a: PortfolioProjectConfig, b: PortfolioProjectConfig) => {
  const aEnd = normalizePeriodValue(a.end);
  const bEnd = normalizePeriodValue(b.end);
  if (aEnd !== bEnd) return bEnd - aEnd;

  const aStart = normalizePeriodValue(a.start);
  const bStart = normalizePeriodValue(b.start);
  if (aStart !== bStart) return bStart - aStart;

  return a.title.localeCompare(b.title, 'ko');
};

const getProjectBasePath = (locale: Locale) => locale === 'en' ? '/en/about' : '/about';

const getSoloCompanyName = (locale: Locale) => locale === 'en' ? 'Independent' : '개인 프로젝트';

const mapProject = (project: PortfolioProjectConfig, locale: Locale = 'ko', company?: string): PortfolioItemData => ({
  id: toDomId(project.slug),
  slug: project.slug,
  title: project.title,
  summary: project.summary,
  role: project.role,
  techStack: project.techStack,
  category: project.category ?? (company ? 'Backend / Infra' : 'Side Project'),
  period: formatPeriod(project.start, project.end, locale),
  href: project.href ?? `${getProjectBasePath(locale)}/${project.slug}/`,
  ...(project.details ? { details: project.details } : {}),
  ...(company ? { company } : {}),
});

export function getAllPortfolioProjects(locale: Locale = 'ko'): PortfolioItemData[] {
  const config = getLocalizedMeConfig(locale);
  const companyProjects = config.portfolio.companies.flatMap(company =>
    company.projects.map(project => mapProject(project, locale, company.company))
  );
  const soloProjects = config.portfolio.solo.map(project => mapProject(project, locale, getSoloCompanyName(locale)));
  return [...companyProjects, ...soloProjects];
}

export function getPortfolioProjectBySlug(slug: string, locale: Locale = 'ko'): PortfolioItemData | undefined {
  return getAllPortfolioProjects(locale).find(project => project.slug === slug);
}

export function getPortfolioData(locale: Locale = 'ko'): PortfolioData {
  const config = getLocalizedMeConfig(locale);
  const companyTimelineItems = config.portfolio.companies
    .map(company => ({
      companyId: toDomId(`company-${company.id}`),
      company: company.company,
      period: company.period,
      ...(company.role ? { role: company.role } : {}),
      ...(company.summary ? { summary: company.summary } : {}),
      projects: [...company.projects].sort(compareProjects).map(project => mapProject(project, locale, company.company)),
      order: company.order,
    }))
    .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));

  const soloItems = [...config.portfolio.solo]
    .sort(compareProjects)
    .map(project => ({ ...mapProject(project, locale, getSoloCompanyName(locale)), id: toDomId(`solo-${project.slug}`) }));

  return { companyTimelineItems, soloItems };
}
