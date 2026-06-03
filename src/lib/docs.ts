import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type DocPage = {
  slug: string[];
  title: string;
  content: string;
  description?: string;
};

export type DocSidebarItem = {
  title: string;
  slug: string[];
  children?: DocSidebarItem[];
};

function scanDocsDir(baseDir: string, relativePath: string[] = []): DocSidebarItem[] {
  const fullPath = path.join(baseDir, ...relativePath);
  if (!fs.existsSync(fullPath)) return [];

  const entries = fs.readdirSync(fullPath, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  const items: DocSidebarItem[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === '_category_.json') continue;

    if (entry.isDirectory()) {
      const children = scanDocsDir(baseDir, [...relativePath, entry.name]);
      // Check if directory has an index.md
      const indexPath = path.join(fullPath, entry.name, 'index.md');
      if (fs.existsSync(indexPath)) {
        const raw = fs.readFileSync(indexPath, 'utf-8');
        const { data } = matter(raw);
        items.push({
          title: data.title || entry.name,
          slug: [...relativePath, entry.name],
          children: children.length > 0 ? children : undefined,
        });
      } else if (children.length > 0) {
        items.push({
          title: entry.name,
          slug: [...relativePath, entry.name],
          children,
        });
      }
    } else if (entry.name.endsWith('.md') && entry.name !== 'index.md') {
      const raw = fs.readFileSync(path.join(fullPath, entry.name), 'utf-8');
      const { data } = matter(raw);
      const baseName = entry.name.replace(/\.md$/, '');
      items.push({
        title: data.title || baseName,
        slug: [...relativePath, baseName],
      });
    }
  }

  return items;
}

function getDocPage(baseDir: string, slugParts: string[]): DocPage | undefined {
  // Try slug/index.md first, then slug.md
  const candidates = [
    path.join(baseDir, ...slugParts, 'index.md'),
    path.join(baseDir, ...slugParts) + '.md',
  ];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      return {
        slug: slugParts,
        title: data.title || slugParts[slugParts.length - 1],
        content,
        description: data.description,
      };
    }
  }

  return undefined;
}

function getAllDocSlugs(baseDir: string, relativePath: string[] = []): string[][] {
  const fullPath = path.join(baseDir, ...relativePath);
  if (!fs.existsSync(fullPath)) return [];

  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  const slugs: string[][] = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === '_category_.json') continue;

    if (entry.isDirectory()) {
      const indexPath = path.join(fullPath, entry.name, 'index.md');
      if (fs.existsSync(indexPath)) {
        slugs.push([...relativePath, entry.name]);
      }
      slugs.push(...getAllDocSlugs(baseDir, [...relativePath, entry.name]));
    } else if (entry.name.endsWith('.md') && entry.name !== 'index.md') {
      slugs.push([...relativePath, entry.name.replace(/\.md$/, '')]);
    }
  }

  return slugs;
}

// docs/ section
const DOCS_DIR = path.join(process.cwd(), 'docs');
export const getDocsSidebar = () => scanDocsDir(DOCS_DIR);
export const getDocsPage = (slug: string[]) => getDocPage(DOCS_DIR, slug);
export const getAllDocsSlugs = () => getAllDocSlugs(DOCS_DIR);

// Insight/ section
const INSIGHT_DIR = path.join(process.cwd(), 'Insight');
export const getInsightSidebar = () => scanDocsDir(INSIGHT_DIR);
export const getInsightPage = (slug: string[]) => getDocPage(INSIGHT_DIR, slug);
export const getAllInsightSlugs = () => getAllDocSlugs(INSIGHT_DIR);
