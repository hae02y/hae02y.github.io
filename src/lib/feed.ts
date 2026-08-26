import { getAllPosts, getAllTags } from './blog';
import { getAllInsightPosts } from './docs';
import { getAllPortfolioProjects } from './portfolio';
import { siteConfig } from '@/config/site';

const BLOG_POSTS_PER_PAGE = 10;
const INSIGHT_POSTS_PER_PAGE = 6;

function sitemapUrl(path: string, priority: string, changefreq: string, lastmod = new Date().toISOString()) {
  return `
  <url>
    <loc>${siteConfig.url}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export function generateSitemapXml(): string {
  const posts = getAllPosts();
  const tags = getAllTags();
  const insightPosts = getAllInsightPosts();
  const portfolioProjects = getAllPortfolioProjects();
  const blogPages = Math.ceil(posts.length / BLOG_POSTS_PER_PAGE);
  const insightPages = Math.ceil(Math.max(insightPosts.length - 1, 0) / INSIGHT_POSTS_PER_PAGE);

  const urls = [
    sitemapUrl('/', '1.0', 'daily'),
    sitemapUrl('/blog/', '0.9', 'daily'),
    sitemapUrl('/blog/tags/', '0.6', 'weekly'),
    sitemapUrl('/me/', '0.8', 'monthly'),
    sitemapUrl('/Insight/', '0.7', 'weekly'),
    ...posts.map(post => sitemapUrl(`/blog/${post.slug}/`, '0.8', 'monthly', new Date(post.date).toISOString())),
    ...Array.from({ length: Math.max(blogPages - 1, 0) }, (_, i) => sitemapUrl(`/blog/page/${i + 2}/`, '0.5', 'weekly')),
    ...tags.map(tag => sitemapUrl(tag.permalink.endsWith('/') ? tag.permalink : `${tag.permalink}/`, '0.5', 'weekly')),
    ...insightPosts.map(post => sitemapUrl(post.href.endsWith('/') ? post.href : `${post.href}/`, '0.6', 'monthly', post.date ? new Date(post.date).toISOString() : undefined)),
    ...Array.from({ length: Math.max(insightPages - 1, 0) }, (_, i) => sitemapUrl(`/Insight/page/${i + 2}/`, '0.5', 'weekly')),
    ...portfolioProjects.map(project => sitemapUrl(project.href.endsWith('/') ? project.href : `${project.href}/`, '0.6', 'monthly')),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

export function generateRssFeed(): string {
  const posts = getAllPosts().slice(0, 20);

  const items = posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteConfig.url}/blog/${post.slug}/</link>
      <guid isPermaLink="true">${siteConfig.url}/blog/${post.slug}/</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.description}]]></description>
      ${post.tags.map(t => `<category>${t}</category>`).join('\n      ')}
    </item>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.title}</title>
    <link>${siteConfig.url}/blog/</link>
    <description>${siteConfig.description}</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items.join('\n')}
  </channel>
</rss>`;
}

export function generateAtomFeed(): string {
  const posts = getAllPosts().slice(0, 20);

  const entries = posts.map(post => `
  <entry>
    <title><![CDATA[${post.title}]]></title>
    <link href="${siteConfig.url}/blog/${post.slug}/"/>
    <id>${siteConfig.url}/blog/${post.slug}/</id>
    <updated>${new Date(post.date).toISOString()}</updated>
    <summary><![CDATA[${post.description}]]></summary>
    <author><name>${siteConfig.author.name}</name></author>
    ${post.tags.map(t => `<category term="${t}"/>`).join('\n    ')}
  </entry>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${siteConfig.title}</title>
  <link href="${siteConfig.url}/blog/"/>
  <link href="${siteConfig.url}/atom.xml" rel="self"/>
  <id>${siteConfig.url}</id>
  <updated>${new Date().toISOString()}</updated>
  <author><name>${siteConfig.author.name}</name></author>
  <subtitle>${siteConfig.description}</subtitle>
  ${entries.join('\n')}
</feed>`;
}
