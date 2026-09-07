/**
 * Build-time script: generates sitemap.xml, rss.xml, atom.xml
 * Run after `next build` but before deploy
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import matter from 'gray-matter';

const SITE_URL = 'https://blog.hae02y.me';
const BLOG_DIR = path.join(process.cwd(), 'blog');
const OUT_DIR = path.join(process.cwd(), 'out');
const SITE_TITLE = 'Hae02y Devlog';
const SITE_DESC = '정해영(hae02y)의 백엔드, 인프라, DevOps 기술 블로그';
const AUTHOR = '정해영';
const INSIGHT_DIR = path.join(process.cwd(), 'Insight');
const ABOUT_CONTENT_DIR = path.join(process.cwd(), 'content', 'about');
const PORTFOLIO_SOURCE_FILES = [
  path.join(process.cwd(), 'src', 'config', 'me.ts'),
  path.join(process.cwd(), 'src', 'i18n', 'me.ts'),
  path.join(process.cwd(), 'src', 'lib', 'portfolio.ts'),
];

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getAllPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const dirs = fs.readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && /^\d{4}-\d{2}-\d{2}/.test(d.name))
    .map(d => d.name)
    .sort()
    .reverse();

  return dirs.map(dir => {
    const filePath = path.join(BLOG_DIR, dir, 'index.md');
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const match = dir.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
    if (!match) return null;
    return {
      slug: data.slug || match[2],
      title: data.title || match[2],
      date: match[1],
      filePath,
      description: data.description || content.slice(0, 200).replace(/[#*\n]/g, '').trim(),
      tags: data.tags || [],
    };
  }).filter(Boolean);
}

function getLanguageAlternates(url) {
  if (url === '/about/' || url === '/en/about/') {
    return [
      { hreflang: 'ko', href: `${SITE_URL}/about/` },
      { hreflang: 'en', href: `${SITE_URL}/en/about/` },
      { hreflang: 'x-default', href: `${SITE_URL}/about/` },
    ];
  }

  if (url.startsWith('/about/')) {
    const slug = url.slice('/about/'.length);
    if (slug) {
      return [
        { hreflang: 'ko', href: `${SITE_URL}/about/${slug}` },
        { hreflang: 'en', href: `${SITE_URL}/en/about/${slug}` },
        { hreflang: 'x-default', href: `${SITE_URL}/about/${slug}` },
      ];
    }
  }

  if (url.startsWith('/en/about/')) {
    const slug = url.slice('/en/about/'.length);
    if (slug) {
      return [
        { hreflang: 'ko', href: `${SITE_URL}/about/${slug}` },
        { hreflang: 'en', href: `${SITE_URL}/en/about/${slug}` },
        { hreflang: 'x-default', href: `${SITE_URL}/about/${slug}` },
      ];
    }
  }

  return [];
}

function toSitemapDate(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function getGitLastModified(filePath) {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cI', '--', filePath], {
      cwd: process.cwd(),
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

function getFileLastModified(filePath, fallback) {
  if (filePath && fs.existsSync(filePath)) {
    const gitDate = getGitLastModified(filePath);
    if (gitDate) return toSitemapDate(gitDate);
    return toSitemapDate(fs.statSync(filePath).mtime);
  }
  return toSitemapDate(fallback || new Date());
}

function getLatestFileLastModified(filePaths, fallback) {
  const dates = filePaths
    .filter(filePath => fs.existsSync(filePath))
    .map(filePath => getFileLastModified(filePath))
    .sort()
    .reverse();

  return dates[0] || toSitemapDate(fallback || new Date());
}

function getDocEntries(baseDir, publicBasePath) {
  if (!fs.existsSync(baseDir)) return [];

  const entries = [];

  function scan(currentDir, slugParts = []) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === '_category_.json') continue;

      const entryPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        const indexPath = path.join(entryPath, 'index.md');
        if (fs.existsSync(indexPath)) {
          const raw = fs.readFileSync(indexPath, 'utf-8');
          const { data } = matter(raw);
          entries.push({
            url: `${publicBasePath}/${[...slugParts, entry.name].map(encodeURIComponent).join('/')}/`,
            lastmod: data.date ? toSitemapDate(data.date) : getFileLastModified(indexPath),
          });
        }
        scan(entryPath, [...slugParts, entry.name]);
        continue;
      }

      if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') {
        const raw = fs.readFileSync(entryPath, 'utf-8');
        const { data } = matter(raw);
        const slug = entry.name.replace(/\.md$/, '');
        entries.push({
          url: `${publicBasePath}/${[...slugParts, slug].map(encodeURIComponent).join('/')}/`,
          lastmod: data.date ? toSitemapDate(data.date) : getFileLastModified(entryPath),
        });
      }
    }
  }

  scan(baseDir);
  return entries;
}

function getPortfolioSlugs() {
  const sourcePath = path.join(process.cwd(), 'src', 'i18n', 'me.ts');
  if (!fs.existsSync(sourcePath)) return [];

  const raw = fs.readFileSync(sourcePath, 'utf-8');
  return Array.from(new Set([...raw.matchAll(/slug:\s*['"`]([^'"`]+)['"`]/g)].map(match => match[1]))).sort();
}

function getFallbackSitemapEntries(posts) {
  const insightEntries = getDocEntries(INSIGHT_DIR, '/Insight');
  const aboutLastmod = getLatestFileLastModified([
    path.join(ABOUT_CONTENT_DIR, 'ko.md'),
    path.join(process.cwd(), 'src', 'i18n', 'about.ts'),
  ]);
  const enAboutLastmod = getLatestFileLastModified([
    path.join(ABOUT_CONTENT_DIR, 'en.md'),
    path.join(process.cwd(), 'src', 'i18n', 'about.ts'),
  ]);
  const portfolioLastmod = getLatestFileLastModified(PORTFOLIO_SOURCE_FILES);
  const statics = [
    { url: '/', lastmod: getLatestFileLastModified([path.join(process.cwd(), 'app', 'page.tsx'), path.join(process.cwd(), 'app', 'HomeClient.tsx')]) },
    { url: '/blog/', lastmod: getLatestFileLastModified([path.join(process.cwd(), 'app', 'blog', 'page.tsx'), ...posts.map(post => post.filePath)]) },
    { url: '/about/', lastmod: aboutLastmod, alternates: getLanguageAlternates('/about/') },
    { url: '/en/about/', lastmod: enAboutLastmod, alternates: getLanguageAlternates('/en/about/') },
    { url: '/Insight/', lastmod: [getFileLastModified(path.join(process.cwd(), 'app', 'Insight', 'page.tsx')), ...insightEntries.map(entry => entry.lastmod)].sort().reverse()[0] },
  ];
  const portfolioEntries = getPortfolioSlugs().flatMap(slug => [
    { url: `/about/${slug}/`, lastmod: portfolioLastmod, alternates: getLanguageAlternates(`/about/${slug}/`) },
    { url: `/en/about/${slug}/`, lastmod: portfolioLastmod, alternates: getLanguageAlternates(`/en/about/${slug}/`) },
  ]);

  return [
    ...statics,
    ...posts.map(p => ({ url: `/blog/${p.slug}/`, lastmod: getFileLastModified(p.filePath, p.date) })),
    ...insightEntries,
    ...portfolioEntries,
  ];
}

function generateSitemap(entries) {
  const seen = new Set();
  const urls = entries
    .filter(entry => {
      if (entry.url.startsWith('/blog/tags/') || entry.url.startsWith('/blog/page/') || entry.url.startsWith('/Insight/page/')) return false;
      if (seen.has(entry.url)) return false;
      seen.add(entry.url);
      return true;
    })
    .sort((a, b) => a.url.localeCompare(b.url))
    .map(p => {
      const alternates = (p.alternates || [])
        .map(alternate => `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeXml(alternate.href)}"/>`)
        .join('\n');

      return `  <url>\n    <loc>${escapeXml(`${SITE_URL}${p.url}`)}</loc>${alternates ? `\n${alternates}` : ''}\n    <lastmod>${p.lastmod}</lastmod>\n  </url>`;
    });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>`;
}

// RSS
function generateRss(posts) {
  const items = posts.slice(0, 20).map(p => `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${SITE_URL}/blog/${p.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}/</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${p.description}]]></description>
      ${p.tags.map(t => `<category>${t}</category>`).join('\n      ')}
    </item>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}/blog/</link>
    <description>${SITE_DESC}</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>`;
}

// Atom
function generateAtom(posts) {
  const entries = posts.slice(0, 20).map(p => `  <entry>
    <title><![CDATA[${p.title}]]></title>
    <link href="${SITE_URL}/blog/${p.slug}/"/>
    <id>${SITE_URL}/blog/${p.slug}/</id>
    <updated>${new Date(p.date).toISOString()}</updated>
    <summary><![CDATA[${p.description}]]></summary>
    <author><name>${AUTHOR}</name></author>
    ${p.tags.map(t => `<category term="${t}"/>`).join('\n    ')}
  </entry>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${SITE_TITLE}</title>
  <link href="${SITE_URL}/blog/"/>
  <link href="${SITE_URL}/atom.xml" rel="self"/>
  <id>${SITE_URL}</id>
  <updated>${new Date().toISOString()}</updated>
  <author><name>${AUTHOR}</name></author>
  <subtitle>${SITE_DESC}</subtitle>
${entries.join('\n')}
</feed>`;
}

// Main
const posts = getAllPosts();
console.log(`Found ${posts.length} blog posts`);

if (!fs.existsSync(OUT_DIR)) {
  console.log('out/ directory not found, writing to public/ instead');
  fs.writeFileSync(path.join('public', 'sitemap.xml'), generateSitemap(getFallbackSitemapEntries(posts)));
  fs.writeFileSync(path.join('public', 'rss.xml'), generateRss(posts));
  fs.writeFileSync(path.join('public', 'atom.xml'), generateAtom(posts));
} else {
  const sitemapEntries = getFallbackSitemapEntries(posts);
  console.log(`Found ${sitemapEntries.length} public pages`);
  fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), generateSitemap(sitemapEntries));
  fs.writeFileSync(path.join(OUT_DIR, 'rss.xml'), generateRss(posts));
  fs.writeFileSync(path.join(OUT_DIR, 'atom.xml'), generateAtom(posts));
}

console.log('Generated: sitemap.xml, rss.xml, atom.xml');
