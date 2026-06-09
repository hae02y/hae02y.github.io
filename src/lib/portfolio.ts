import { meConfig, type PortfolioProjectConfig } from '@/config/me';

export type PortfolioItemData = {
  id: string;
  title: string;
  summary: string;
  role: string;
  techStack: string;
  period: string;
  href?: string;
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

const formatPeriod = (start?: string, end?: string) => {
  if (!start && !end) return '';
  const normalizedEnd = end?.trim();
  const endLabel = normalizedEnd && normalizePeriodValue(normalizedEnd) === PRESENT_VALUE ? '현재' : normalizedEnd;
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

const mapProject = (project: PortfolioProjectConfig): PortfolioItemData => ({
  id: toDomId(project.title),
  title: project.title,
  summary: project.summary,
  role: project.role,
  techStack: project.techStack,
  period: formatPeriod(project.start, project.end),
  ...(project.href ? { href: project.href } : {}),
});

export function getPortfolioData(): PortfolioData {
  const companyTimelineItems = meConfig.portfolio.companies
    .map(company => ({
      companyId: toDomId(`company-${company.id}`),
      company: company.company,
      period: company.period,
      ...(company.role ? { role: company.role } : {}),
      ...(company.summary ? { summary: company.summary } : {}),
      projects: [...company.projects].sort(compareProjects).map(mapProject),
      order: company.order,
    }))
    .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));

  const soloItems = [...meConfig.portfolio.solo]
    .sort(compareProjects)
    .map(project => ({ ...mapProject(project), id: toDomId(`solo-${project.title}`) }));

  return { companyTimelineItems, soloItems };
}
