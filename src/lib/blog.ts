import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const BLOG_DIR = path.join(process.cwd(), 'blog');
const POSTS_PER_PAGE = 10;

export type Author = {
  name: string;
  title?: string;
  url?: string;
  image_url?: string;
  socials?: Record<string, string>;
};

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  authors: string[];
  tags: string[];
  content: string;
  readingTime: number;
  comments?: boolean;
};

export type BlogPostMeta = Omit<BlogPost, 'content'>;

export type BlogPostNavigation = {
  previous?: BlogPostMeta;
  next?: BlogPostMeta;
};

function getAuthors(): Record<string, Author> {
  const authorsPath = path.join(BLOG_DIR, 'authors.yml');
  if (!fs.existsSync(authorsPath)) return {};

  const raw = fs.readFileSync(authorsPath, 'utf-8');
  const authors: Record<string, Author> = {};

  let currentKey = '';
  for (const line of raw.split('\n')) {
    if (!line.startsWith(' ') && !line.startsWith('\t') && line.includes(':')) {
      currentKey = line.split(':')[0].trim();
      authors[currentKey] = { name: currentKey };
    } else if (currentKey && line.trim()) {
      const match = line.trim().match(/^(\w+):\s*(.+)$/);
      if (match) {
        const [, key, value] = match;
        (authors[currentKey] as any)[key] = value;
      }
    }
  }

  return authors;
}

let cachedAuthors: Record<string, Author> | null = null;
export function getAuthorData(): Record<string, Author> {
  if (!cachedAuthors) cachedAuthors = getAuthors();
  return cachedAuthors;
}

function extractDescription(content: string): string {
  return content
    // Remove code blocks (```...```)
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code (`...`)
    .replace(/`[^`]+`/g, '')
    // Remove images ![alt](url)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    // Remove links but keep text [text](url) → text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Remove headings ###
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markers
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200)
    .trim();
}

function parseBlogDir(dirName: string): { date: string; dirSlug: string } | null {
  const match = dirName.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
  if (!match) return null;
  return { date: match[1], dirSlug: match[2] };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const dirs = fs.readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort()
    .reverse();

  const posts: BlogPost[] = [];

  for (const dir of dirs) {
    const parsed = parseBlogDir(dir);
    if (!parsed) continue;

    const filePath = path.join(BLOG_DIR, dir, 'index.md');
    if (!fs.existsSync(filePath)) continue;

    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const rt = readingTime(content);

    posts.push({
      slug: data.slug || parsed.dirSlug,
      title: data.title || parsed.dirSlug,
      date: parsed.date,
      description: data.description || extractDescription(content),
      authors: data.authors || [],
      tags: data.tags || [],
      content,
      readingTime: Math.ceil(rt.minutes),
      comments: data.comments !== false,
    });
  }

  return posts;
}

export function getAllPostsMeta(): BlogPostMeta[] {
  return getAllPosts().map(({ content, ...meta }) => meta);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find(p => p.slug === slug);
}

export function getAdjacentPosts(slug: string): BlogPostNavigation {
  const posts = getAllPostsMeta();
  const index = posts.findIndex(post => post.slug === slug);
  if (index === -1) return {};

  return {
    previous: posts[index + 1],
    next: posts[index - 1],
  };
}

export function getRelatedPosts(slug: string, limit = 3): BlogPostMeta[] {
  const posts = getAllPostsMeta();
  const current = posts.find(post => post.slug === slug);
  if (!current || current.tags.length === 0) return [];

  const currentTags = new Set(current.tags.map(tag => tag.toLowerCase()));

  return posts
    .filter(post => post.slug !== slug)
    .map(post => ({
      post,
      overlap: post.tags.filter(tag => currentTags.has(tag.toLowerCase())).length,
    }))
    .filter(item => item.overlap > 0)
    .sort((a, b) => {
      if (a.overlap !== b.overlap) return b.overlap - a.overlap;
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    })
    .slice(0, limit)
    .map(item => item.post);
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  return getAllPostsMeta().filter(p =>
    p.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getAllTags(): { label: string; count: number; permalink: string }[] {
  const posts = getAllPostsMeta();
  const tagMap = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }

  return Array.from(tagMap.entries())
    .map(([label, count]) => ({
      label,
      count,
      permalink: `/blog/tags/${encodeURIComponent(label)}`,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getPaginatedPosts(page: number): {
  posts: BlogPostMeta[];
  totalPages: number;
  currentPage: number;
} {
  const allPosts = getAllPostsMeta();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const start = (page - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(start, start + POSTS_PER_PAGE);

  return { posts, totalPages, currentPage: page };
}

export function getPostDirName(slug: string): string | undefined {
  if (!fs.existsSync(BLOG_DIR)) return undefined;

  const dirs = fs.readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const dir of dirs) {
    const filePath = path.join(BLOG_DIR, dir.name, 'index.md');
    if (!fs.existsSync(filePath)) continue;

    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);
    if (data.slug === slug) return dir.name;

    const parsed = parseBlogDir(dir.name);
    if (parsed && parsed.dirSlug === slug) return dir.name;
  }

  return undefined;
}
