import React from 'react';
import {useLocation} from '@docusaurus/router';
import MeLayout from '@site/src/components/MeLayout';

type PortfolioFrontMatter = {
  title?: string;
  summary?: string;
  role?: string;
  techStack?: string;
  start?: string;
  end?: string;
  companyName?: string;
};

type PortfolioModule = {
  default: React.ComponentType<Record<string, unknown>>;
  frontMatter?: PortfolioFrontMatter;
};

type RequireContext = {
  keys: () => string[];
  <TModule = unknown>(id: string): TModule;
};

const portfolioContext = (
  require as unknown as {context: (path: string, deep: boolean, filter: RegExp) => RequireContext}
).context('@site/src/content/me', true, /\.mdx?$/);

const decodeSlug = (slug: string) => slug.split('__').join('/');

const PRESENT_VALUE = Number.POSITIVE_INFINITY;

const normalizePeriodValue = (value?: string) => {
  if (!value) return Number.NEGATIVE_INFINITY;

  const normalized = value.trim().toLowerCase();
  if (normalized === 'present' || normalized === '현재') {
    return PRESENT_VALUE;
  }

  const [yearPart, monthPart] = normalized.split('-');
  const year = Number(yearPart);
  const month = Number(monthPart);

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return Number.NEGATIVE_INFINITY;
  }

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

const getPortfolioModule = (slug: string) => {
  try {
    return portfolioContext<PortfolioModule>(`./${slug}/index.mdx`);
  } catch (error) {
    try {
      return portfolioContext<PortfolioModule>(`./${slug}/index.md`);
    } catch (fallbackError) {
      try {
        return portfolioContext<PortfolioModule>(`./${slug}.mdx`);
      } catch (legacyError) {
        try {
          return portfolioContext<PortfolioModule>(`./${slug}.md`);
        } catch (finalError) {
          return null;
        }
      }
    }
  }
};

export default function PortfolioDetailPage() {
  const location = useLocation();
  const slug = location.pathname.split('/').filter(Boolean).pop() ?? '';
  const decodedSlug = decodeSlug(slug);
  const isPortfolioSlug = decodedSlug.startsWith('company/') || decodedSlug.startsWith('solo/');
  const module = decodedSlug && isPortfolioSlug ? getPortfolioModule(decodedSlug) : null;

  if (!module) {
    return (
      <MeLayout title="Portfolio">
        <p>요청한 프로젝트를 찾을 수 없습니다.</p>
      </MeLayout>
    );
  }

  const Content = module.default;
  const frontMatter = module.frontMatter ?? {};
  const title = frontMatter.title ?? 'Portfolio';
  const periodLabel = formatPeriod(frontMatter.start, frontMatter.end);
  const metaLine = [periodLabel, frontMatter.role].filter(Boolean).join(' · ');

  return (
    <MeLayout title={title}>
      <h1>{title}</h1>
      {frontMatter.companyName ? (
        <div className="portfolio-detail-meta">{frontMatter.companyName}</div>
      ) : null}
      {metaLine ? <div className="portfolio-detail-meta">{metaLine}</div> : null}
      {frontMatter.summary ? (
        <p className="portfolio-detail-summary">{frontMatter.summary}</p>
      ) : null}
      {frontMatter.techStack ? (
        <div className="portfolio-detail-meta">{frontMatter.techStack}</div>
      ) : null}
      <Content />
    </MeLayout>
  );
}
