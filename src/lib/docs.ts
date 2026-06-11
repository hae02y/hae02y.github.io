import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export type DocPage = {
  slug: string[];
  title: string;
  content: string;
  description?: string;
  date?: string;
  tags?: string[];
  assetBasePath?: string;
  heroImage?: string;
};

export type InsightPostMeta = {
  slug: string[];
  href: string;
  title: string;
  description: string;
  date?: string;
  tags: string[];
  readingTime: number;
  heroImage?: string;
};

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg']);

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

function extractTitle(content: string): string | undefined {
  const heading = content.match(/^#\s+(.+)$/m);
  return heading?.[1]?.trim();
}

function extractDescription(content: string): string {
  return content
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[>*_`#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 140)
    .trim();
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') return value.split(',').map(tag => tag.trim()).filter(Boolean);
  return [];
}

function resolveAssetSrc(src: string | undefined, assetBasePath?: string): string | undefined {
  if (!src) return undefined;
  if (src.startsWith('http') || src.startsWith('/')) return src;
  if (!assetBasePath) return src;
  return `${assetBasePath}/${src}`;
}

function extractFirstImage(content: string, assetBasePath?: string): string | undefined {
  const match = content.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
  return resolveAssetSrc(match?.[1], assetBasePath);
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getAssetBasePath(baseDir: string, filePath: string, publicBasePath?: string): string | undefined {
  if (!publicBasePath) return undefined;

  const relativeDir = path.relative(baseDir, path.dirname(filePath));
  if (!relativeDir || relativeDir === '.') return publicBasePath;

  return `${publicBasePath}/${relativeDir.split(path.sep).map(encodeURIComponent).join('/')}`;
}

function getDocPage(baseDir: string, slugParts: string[], publicBasePath?: string): DocPage | undefined {
  // Try slug/index.md first, then slug.md
  const candidates = [
    path.join(baseDir, ...slugParts, 'index.md'),
    path.join(baseDir, ...slugParts) + '.md',
  ];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      const assetBasePath = getAssetBasePath(baseDir, filePath, publicBasePath);
      const heroImage = resolveAssetSrc(data.heroImage || data.image, assetBasePath) || extractFirstImage(content, assetBasePath);

      return {
        slug: slugParts,
        title: data.title || extractTitle(content) || slugParts[slugParts.length - 1],
        content,
        description: data.description || extractDescription(content),
        date: data.date ? String(data.date) : undefined,
        tags: normalizeTags(data.tags),
        assetBasePath,
        heroImage,
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

function getAllImageAssets(baseDir: string, publicBasePath: string, relativePath: string[] = []): string[] {
  const fullPath = path.join(baseDir, ...relativePath);
  if (!fs.existsSync(fullPath)) return [];

  const entries = fs.readdirSync(fullPath, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  const images: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;

    if (entry.isDirectory()) {
      images.push(...getAllImageAssets(baseDir, publicBasePath, [...relativePath, entry.name]));
      continue;
    }

    if (entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      images.push(`${publicBasePath}/${[...relativePath, entry.name].map(encodeURIComponent).join('/')}`);
    }
  }

  return images;
}

function pickDeterministicImage(key: string, images: string[]): string | undefined {
  if (images.length === 0) return undefined;
  return images[hashString(key) % images.length];
}

// docs/ section
const DOCS_DIR = path.join(process.cwd(), 'docs');
export const getDocsSidebar = () => scanDocsDir(DOCS_DIR);
export const getDocsPage = (slug: string[]) => getDocPage(DOCS_DIR, slug);
export const getAllDocsSlugs = () => getAllDocSlugs(DOCS_DIR);

// Insight/ section
const INSIGHT_DIR = path.join(process.cwd(), 'Insight');
export const getInsightSidebar = () => scanDocsDir(INSIGHT_DIR);
export const getInsightPage = (slug: string[]) => getDocPage(INSIGHT_DIR, slug, '/Insight');
export const getAllInsightSlugs = () => getAllDocSlugs(INSIGHT_DIR);
export const getAllInsightPosts = (): InsightPostMeta[] => {
  const posts: InsightPostMeta[] = [];
  const fallbackImages = getAllImageAssets(INSIGHT_DIR, '/Insight');

  for (const slug of getAllInsightSlugs()) {
    const page = getInsightPage(slug);
    if (!page) continue;
    const bodyImage = extractFirstImage(page.content, page.assetBasePath);
    const fallbackImage = pickDeterministicImage(slug.join('/'), fallbackImages);

    const post: InsightPostMeta = {
      slug,
      href: `/Insight/${slug.map(encodeURIComponent).join('/')}`,
      title: page.title,
      description: page.description || '천천히 곱씹어 볼 생각의 기록입니다.',
      tags: page.tags || [],
      readingTime: Math.ceil(readingTime(page.content).minutes),
    };

    if (page.date) post.date = page.date;
    post.heroImage = bodyImage || fallbackImage || page.heroImage;
    posts.push(post);
  }

  return posts.sort((a, b) => {
    if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (a.date) return -1;
    if (b.date) return 1;
    return a.title.localeCompare(b.title, 'ko');
  });
};
