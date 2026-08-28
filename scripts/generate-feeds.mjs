/**
 * Build-time script: generates sitemap.xml, rss.xml, atom.xml
 * Run after `next build` but before deploy
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SITE_URL = 'https://blog.hae02y.me';
const BLOG_DIR = path.join(process.cwd(), 'blog');
const OUT_DIR = path.join(process.cwd(), 'out');
const SITE_TITLE = 'Hae02y Devlog';
const SITE_DESC = '정해영(hae02y)의 백엔드, 인프라, DevOps 기술 블로그';
const AUTHOR = '정해영';

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
      description: data.description || content.slice(0, 200).replace(/[#*\n]/g, '').trim(),
      tags: data.tags || [],
    };
  }).filter(Boolean);
}

function getPriority(url) {
  if (url === '/') return '1.0';
  if (url === '/blog/') return '0.9';
  if (url === '/about/') return '0.8';
  if (url === '/en/about/') return '0.7';
  if (url.startsWith('/blog/') && !url.startsWith('/blog/tags/') && !url.startsWith('/blog/page/')) return '0.8';
  if (url === '/Insight/') return '0.7';
  if (url.startsWith('/Insight/') || url.startsWith('/about/')) return '0.6';
  return '0.5';
}

function getChangeFrequency(url) {
  if (url === '/' || url === '/blog/') return 'daily';
  if (url === '/blog/tags/' || url.startsWith('/blog/page/') || url.startsWith('/Insight/page/')) return 'weekly';
  return 'monthly';
}

function shouldIndexRoute(url) {
  if (url === '/') return true;
  if (url === '/blog/page/1/' || url === '/Insight/page/1/') return false;
  return url.startsWith('/blog/') || url.startsWith('/Insight/') || url.startsWith('/about/') || url.startsWith('/en/about/');
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

function collectHtmlPages(dir, routes = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === '_next' || entry.name === 'static') continue;

    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtmlPages(entryPath, routes);
      continue;
    }

    if (entry.name !== 'index.html') continue;

    const html = fs.readFileSync(entryPath, 'utf-8');
    if (html.includes('id="__next_error__"') || html.includes('name="robots" content="noindex"')) continue;

    const relativeDir = path.relative(OUT_DIR, path.dirname(entryPath));
    const url = relativeDir === '' ? '/' : `/${relativeDir.split(path.sep).join('/')}/`;
    if (!shouldIndexRoute(url)) continue;

    routes.push({
      url: encodeURI(url),
      lastmod: fs.statSync(entryPath).mtime.toISOString(),
      priority: getPriority(url),
      freq: getChangeFrequency(url),
      alternates: getLanguageAlternates(url),
    });
  }

  return routes;
}

function getFallbackSitemapEntries(posts) {
  const now = new Date().toISOString();
  const statics = [
    { url: '/', priority: '1.0', freq: 'daily' },
    { url: '/blog/', priority: '0.9', freq: 'daily' },
    { url: '/blog/tags/', priority: '0.6', freq: 'weekly' },
    { url: '/about/', priority: '0.8', freq: 'monthly' },
    { url: '/en/about/', priority: '0.7', freq: 'monthly' },
    { url: '/Insight/', priority: '0.7', freq: 'weekly' },
  ];

  return [
    ...statics.map(p => ({ ...p, lastmod: now })),
    ...posts.map(p => ({ url: `/blog/${p.slug}/`, lastmod: new Date(p.date).toISOString(), freq: 'monthly', priority: '0.8' })),
  ];
}

function generateSitemap(entries) {
  const urls = entries
    .sort((a, b) => a.url.localeCompare(b.url))
    .map(p => {
      const alternates = (p.alternates || [])
        .map(alternate => `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeXml(alternate.href)}"/>`)
        .join('\n');

      return `  <url>\n    <loc>${escapeXml(`${SITE_URL}${p.url}`)}</loc>${alternates ? `\n${alternates}` : ''}\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.freq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`;
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
  const sitemapEntries = collectHtmlPages(OUT_DIR);
  console.log(`Found ${sitemapEntries.length} public pages`);
  fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), generateSitemap(sitemapEntries));
  fs.writeFileSync(path.join(OUT_DIR, 'rss.xml'), generateRss(posts));
  fs.writeFileSync(path.join(OUT_DIR, 'atom.xml'), generateAtom(posts));
}

console.log('Generated: sitemap.xml, rss.xml, atom.xml');
