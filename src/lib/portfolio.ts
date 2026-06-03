import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'me');

export type PortfolioFrontMatter = {
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

export type CompanyMeta = {
  companyName?: string;
  period?: string;
  role?: string;
  summary?: string;
};

export type PortfolioItemData = {
  title: string;
  summary: string;
  role: string;
  techStack: string;
  period: string;
  start?: string;
  end?: string;
  slugBase: string;
  href: string;
  type: 'solo' | 'company';
  companyName?: string;
  companyFolder?: string;
  companyOrder?: number;
  sortEnd: number;
  sortStart: number;
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

const parseCompanyFolder = (folderName: string) => {
  const match = folderName.match(/^(\d{2})_(.+)$/);
  if (!match) return { order: Number.MAX_SAFE_INTEGER, name: folderName };
  return { order: Number(match[1]), name: match[2] };
};

const encodeSlug = (p: string) => p.split('/').join('__');

function scanMdxFiles(dir: string): Array<{ relativePath: string; frontMatter: PortfolioFrontMatter }> {
  if (!fs.existsSync(dir)) return [];
  const results: Array<{ relativePath: string; frontMatter: PortfolioFrontMatter }> = [];

  function walk(currentDir: string, prefix: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(currentDir, entry.name), prefix ? `${prefix}/${entry.name}` : entry.name);
      } else if (/\.mdx?$/.test(entry.name)) {
        const filePath = path.join(currentDir, entry.name);
        const raw = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(raw);
        results.push({
          relativePath: prefix ? `${prefix}/${entry.name}` : entry.name,
          frontMatter: data as PortfolioFrontMatter,
        });
      }
    }
  }

  walk(dir, '');
  return results;
}

function readMetaJson(dir: string): Map<string, CompanyMeta> {
  const metaMap = new Map<string, CompanyMeta>();
  if (!fs.existsSync(dir)) return metaMap;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const metaPath = path.join(dir, entry.name, 'meta.json');
    if (fs.existsSync(metaPath)) {
      const data = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      metaMap.set(entry.name, data);
    }
  }
  return metaMap;
}

export function getPortfolioData() {
  const companyDir = path.join(CONTENT_DIR, 'company');
  const soloDir = path.join(CONTENT_DIR, 'solo');

  const companyMetaMap = readMetaJson(companyDir);
  const companyFiles = scanMdxFiles(companyDir);
  const soloFiles = scanMdxFiles(soloDir);

  const companyItems: PortfolioItemData[] = companyFiles.map(({ relativePath, frontMatter }) => {
    const pathParts = relativePath.split('/');
    const companyFolder = pathParts[0];
    const projectFolder = pathParts[1];
    const { order, name } = parseCompanyFolder(companyFolder);
    const meta = companyMetaMap.get(companyFolder);
    const companyName = meta?.companyName?.trim() || name;
    const slugBase = `company/${companyFolder}/${projectFolder}`;
    return {
      title: frontMatter.title ?? projectFolder ?? '',
      summary: frontMatter.summary ?? '',
      role: frontMatter.role ?? '',
      techStack: frontMatter.techStack ?? '',
      period: formatPeriod(frontMatter.start, frontMatter.end),
      start: frontMatter.start,
      end: frontMatter.end,
      slugBase,
      href: frontMatter.href ?? `/me/${encodeSlug(slugBase)}`,
      type: 'company' as const,
      companyName,
      companyFolder,
      companyOrder: order,
      sortEnd: normalizePeriodValue(frontMatter.end),
      sortStart: normalizePeriodValue(frontMatter.start),
    };
  });

  const soloItems: PortfolioItemData[] = soloFiles.map(({ relativePath, frontMatter }) => {
    const pathParts = relativePath.split('/');
    const projectFolder = pathParts.length > 1 ? pathParts[0] : relativePath.replace(/\.mdx?$/, '');
    const slugBase = `solo/${projectFolder}`;
    return {
      title: frontMatter.title ?? projectFolder ?? '',
      summary: frontMatter.summary ?? '',
      role: frontMatter.role ?? '',
      techStack: frontMatter.techStack ?? '',
      period: formatPeriod(frontMatter.start, frontMatter.end),
      start: frontMatter.start,
      end: frontMatter.end,
      slugBase,
      href: frontMatter.href ?? `/me/${encodeSlug(slugBase)}`,
      type: 'solo' as const,
      sortEnd: normalizePeriodValue(frontMatter.end),
      sortStart: normalizePeriodValue(frontMatter.start),
    };
  });

  // Build company groups
  const toDomId = (value: string) => `id-${encodeURIComponent(value).replace(/%/g, '-')}`;
  const compareItems = (a: PortfolioItemData, b: PortfolioItemData) => {
    if (a.sortEnd !== b.sortEnd) return b.sortEnd - a.sortEnd;
    if (a.sortStart !== b.sortStart) return b.sortStart - a.sortStart;
    return a.title.localeCompare(b.title);
  };

  const companyGroups = new Map<string, PortfolioItemData[]>();
  companyItems.forEach(item => {
    const groupKey = item.companyFolder ?? item.companyName ?? '회사 프로젝트';
    const group = companyGroups.get(groupKey) ?? [];
    group.push(item);
    companyGroups.set(groupKey, group);
  });

  const getCompanyPeriod = (items: PortfolioItemData[]) => {
    const withStart = items.filter(i => i.start);
    const withEnd = items.filter(i => i.end);
    if (!withStart.length && !withEnd.length) return '';
    const earliestStart = withStart.reduce((min, c) => c.sortStart < min.sortStart ? c : min, withStart[0]);
    const latestEnd = withEnd.reduce((max, c) => c.sortEnd > max.sortEnd ? c : max, withEnd[0]);
    const startLabel = earliestStart?.start;
    const endLabel = latestEnd?.end && normalizePeriodValue(latestEnd.end) === PRESENT_VALUE ? '현재' : latestEnd?.end;
    if (startLabel && endLabel) return `${startLabel} ~ ${endLabel}`;
    if (startLabel) return startLabel;
    return endLabel ?? '';
  };

  const companyTimelineItems = Array.from(companyGroups.entries())
    .map(([companyFolder, groupItems]) => {
      const sorted = [...groupItems].sort(compareItems);
      const meta = companyMetaMap.get(companyFolder);
      const period = meta?.period ?? getCompanyPeriod(sorted);
      const order = sorted[0]?.companyOrder ?? Number.MAX_SAFE_INTEGER;
      const companyName = meta?.companyName?.trim() || sorted[0]?.companyName || companyFolder;
      return {
        companyId: toDomId(`company-${companyFolder ?? companyName}`),
        company: companyName,
        period,
        role: meta?.role,
        summary: meta?.summary,
        projects: sorted.map(item => ({
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

  const sortedSoloItems = [...soloItems].sort(compareItems).map(item => ({
    id: toDomId(item.slugBase),
    title: item.title,
    summary: item.summary,
    role: item.role,
    period: item.period,
    techStack: item.techStack,
    href: item.href,
  }));

  return { companyTimelineItems, soloItems: sortedSoloItems };
}
