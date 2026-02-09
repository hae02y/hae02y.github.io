import React from 'react';
import CompanyTimeline from '@site/src/components/portfolio/CompanyTimeline';
import type {PortfolioItem} from '@site/src/components/portfolio/PortfolioSection';

type PortfolioFrontMatter = {
  title?: string;
  summary?: string;
  role?: string;
  techStack?: string;
  start?: string;
  end?: string;
  type?: 'solo' | 'company';
  companyName?: string;
  href?: string;
};

type PortfolioSortableItem = PortfolioItem & {
  sortEnd: number;
  sortStart: number;
  start?: string;
  end?: string;
  slugBase: string;
  type: 'solo' | 'company';
  companyName?: string;
  companyFolder?: string;
  companyOrder?: number;
};

type PortfolioModule = {
  frontMatter?: PortfolioFrontMatter;
};

type CompanyMeta = {
  companyName?: string;
  period?: string;
  role?: string;
  summary?: string;
};

type RequireContext = {
  keys: () => string[];
  <TModule = unknown>(id: string): TModule;
};

const companyContext = (
  require as unknown as {context: (path: string, deep: boolean, filter: RegExp) => RequireContext}
).context('@site/src/content/me/company', true, /\.mdx?$/);

const companyMetaContext = (
  require as unknown as {context: (path: string, deep: boolean, filter: RegExp) => RequireContext}
).context('@site/src/content/me/company', true, /meta\.json$/);

const soloContext = (
  require as unknown as {context: (path: string, deep: boolean, filter: RegExp) => RequireContext}
).context('@site/src/content/me/solo', true, /\.mdx?$/);

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

const compareItems = (a: PortfolioSortableItem, b: PortfolioSortableItem) => {
  if (a.sortEnd !== b.sortEnd) return b.sortEnd - a.sortEnd;
  if (a.sortStart !== b.sortStart) return b.sortStart - a.sortStart;
  return a.title.localeCompare(b.title);
};

const getCompanyPeriod = (items: PortfolioSortableItem[]) => {
  const withStart = items.filter((item) => item.start);
  const withEnd = items.filter((item) => item.end);

  if (!withStart.length && !withEnd.length) return '';

  const earliestStart = withStart.reduce((min, current) =>
    current.sortStart < min.sortStart ? current : min
  , withStart[0]);

  const latestEnd = withEnd.reduce((max, current) =>
    current.sortEnd > max.sortEnd ? current : max
  , withEnd[0]);

  const startLabel = earliestStart?.start;
  const endLabel = latestEnd?.end && normalizePeriodValue(latestEnd.end) === PRESENT_VALUE ? '현재' : latestEnd?.end;

  if (startLabel && endLabel) return `${startLabel} ~ ${endLabel}`;
  if (startLabel) return startLabel;
  return endLabel ?? '';
};

const toSectionItems = (items: PortfolioSortableItem[]) =>
  items.map(({sortEnd, sortStart, start, end, type, companyOrder, companyName, ...rest}) => rest);

const encodeSlug = (path: string) => path.split('/').join('__');

const toDomId = (value: string) => `id-${encodeURIComponent(value).replace(/%/g, '-')}`;

const parseCompanyFolder = (folderName: string) => {
  const match = folderName.match(/^(\d{2})_(.+)$/);
  if (!match) {
    return {
      order: Number.MAX_SAFE_INTEGER,
      name: folderName,
    };
  }

  return {
    order: Number(match[1]),
    name: match[2],
  };
};

const buildCompanyMetaMap = () => {
  return companyMetaContext.keys().reduce<Map<string, CompanyMeta>>((acc, key) => {
    const relativePath = key.replace('./', '');
    const [companyFolder] = relativePath.split('/');
    if (!companyFolder) return acc;

    const meta = companyMetaContext<CompanyMeta>(key);
    acc.set(companyFolder, meta ?? {});
    return acc;
  }, new Map());
};

const companyMetaMap = buildCompanyMetaMap();

const buildCompanyItems = () => {
  return companyContext.keys().reduce<PortfolioSortableItem[]>((acc, key) => {
    const module = companyContext<PortfolioModule>(key);
    const frontMatter = module.frontMatter ?? {};
    const relativePath = key.replace('./', '');
    const pathParts = relativePath.split('/');
    const companyFolder = pathParts[0];
    const projectFolder = pathParts[1];
    const fileName = pathParts[pathParts.length - 1];
    if (!companyFolder || !projectFolder || !fileName) return acc;

    const {order, name} = parseCompanyFolder(companyFolder);
    const meta = companyMetaMap.get(companyFolder);
    const companyName = meta?.companyName?.trim() || name;
    const slugBase = `company/${companyFolder}/${projectFolder}`;
    const periodLabel = formatPeriod(frontMatter.start, frontMatter.end);
    const sortEnd = normalizePeriodValue(frontMatter.end);
    const sortStart = normalizePeriodValue(frontMatter.start);

    acc.push({
      title: frontMatter.title ?? projectFolder,
      summary: frontMatter.summary ?? '',
      role: frontMatter.role ?? '',
      techStack: frontMatter.techStack ?? '',
      period: periodLabel,
      start: frontMatter.start,
      end: frontMatter.end,
      slugBase,
      href: frontMatter.href ?? `/me/${encodeSlug(slugBase)}`,
      type: 'company',
      companyName,
      companyFolder,
      sortEnd,
      sortStart,
      companyOrder: order,
    });

    return acc;
  }, []);
};

const buildSoloItems = () => {
  return soloContext.keys().reduce<PortfolioSortableItem[]>((acc, key) => {
    const module = soloContext<PortfolioModule>(key);
    const frontMatter = module.frontMatter ?? {};
    const fileName = key.replace('./', '');
    const pathParts = fileName.split('/');
    const projectFolder = pathParts.length > 1 ? pathParts[0] : fileName.replace(/\.mdx?$/, '');
    const slugBase = `solo/${projectFolder}`;
    const periodLabel = formatPeriod(frontMatter.start, frontMatter.end);
    const sortEnd = normalizePeriodValue(frontMatter.end);
    const sortStart = normalizePeriodValue(frontMatter.start);

    acc.push({
      title: frontMatter.title ?? projectFolder,
      summary: frontMatter.summary ?? '',
      role: frontMatter.role ?? '',
      techStack: frontMatter.techStack ?? '',
      period: periodLabel,
      start: frontMatter.start,
      end: frontMatter.end,
      slugBase,
      href: frontMatter.href ?? `/me/${encodeSlug(slugBase)}`,
      type: 'solo',
      sortEnd,
      sortStart,
    });

    return acc;
  }, []);
};

export default function PortfolioList() {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [activeTocId, setActiveTocId] = React.useState<string | null>(null);
  const items = [...buildCompanyItems(), ...buildSoloItems()];
  const companyGroups = new Map<string, PortfolioSortableItem[]>();
  const soloItems: PortfolioSortableItem[] = [];

  items.forEach((item) => {
    if (item.type === 'company') {
      const groupKey = item.companyFolder ?? item.companyName ?? '회사 프로젝트';
      const group = companyGroups.get(groupKey) ?? [];
      group.push(item);
      companyGroups.set(groupKey, group);
      return;
    }

    soloItems.push(item);
  });

  const companyTimelineItems = Array.from(companyGroups.entries())
    .map(([companyFolder, groupItems]) => {
      const sortedGroup = [...groupItems].sort(compareItems);
      const meta = companyFolder ? companyMetaMap.get(companyFolder) : undefined;
      const period = meta?.period ?? getCompanyPeriod(sortedGroup);
      const order = sortedGroup[0]?.companyOrder ?? Number.MAX_SAFE_INTEGER;
      const companyName = meta?.companyName?.trim() || sortedGroup[0]?.companyName || companyFolder;
      const companyId = toDomId(`company-${companyFolder ?? companyName}`);

      return {
        companyId,
        company: companyName,
        period,
        role: meta?.role,
        summary: meta?.summary,
        projects: sortedGroup.map((item) => ({
          id: toDomId(item.slugBase),
          title: item.title,
          summary: item.summary,
          role: item.role,
          period: item.period,
          techStack: item.techStack,
          href: item.href,
        })),
        order,
      };
    })
    .sort((a, b) => a.order - b.order);

  const soloTimelineItems = soloItems.length
    ? [
        {
          company: '',
          companyId: toDomId('solo-projects'),
          period: '',
          projects: [...soloItems]
            .sort(compareItems)
            .map((item) => ({
              id: toDomId(item.slugBase),
              title: item.title,
              summary: item.summary,
              role: item.role,
              period: item.period,
              techStack: item.techStack,
              href: item.href,
            })),
        },
      ]
    : [];

  const tocItems = [
    ...companyTimelineItems.map((item) => ({
      id: item.companyId,
      label: item.company,
    })),
    {
      id: 'portfolio-solo',
      label: '개인 프로젝트',
    },
  ].filter((item) => item.label && item.id);

  return (
    <div>
      {companyTimelineItems.length ? (
        <section className="portfolio-section" id="portfolio-company">
          <div className="portfolio-section-header">
            <h2>회사 프로젝트</h2>
            <button
              className="portfolio-toggle"
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-pressed={isExpanded}
            >
              {isExpanded ? '-' : '+'}
            </button>
          </div>
          <CompanyTimeline items={companyTimelineItems} showProjects={isExpanded} />
        </section>
      ) : null}
      {soloTimelineItems.length ? (
        <section className="portfolio-section" id="portfolio-solo">
          <h2>개인 프로젝트</h2>
          <CompanyTimeline items={soloTimelineItems} showHeader={false} />
        </section>
      ) : null}
      {tocItems.length ? (
        <div className="portfolio-toc-wrapper" aria-label="Portfolio navigation">
          <div className="portfolio-toc-handle" />
          <aside className="portfolio-toc">
            <nav>
              <ul>
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={activeTocId === item.id ? 'is-active' : undefined}
                      onClick={() => setActiveTocId(item.id)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
