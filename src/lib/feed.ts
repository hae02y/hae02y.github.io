import { getAllPosts } from './blog';
import { siteConfig } from '@/config/site';

export function generateSitemapXml(): string {
  const posts = getAllPosts();
  const now = new Date().toISOString();

  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/blog/tags', priority: '0.6', changefreq: 'weekly' },
    { url: '/me', priority: '0.8', changefreq: 'monthly' },
    { url: '/Insight', priority: '0.7', changefreq: 'weekly' },
  ];

  const urls = [
    ...staticPages.map(p => `
  <url>
    <loc>${siteConfig.url}${p.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),
    ...posts.map(post => `
  <url>
    <loc>${siteConfig.url}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`),
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
      <link>${siteConfig.url}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.description}]]></description>
      ${post.tags.map(t => `<category>${t}</category>`).join('\n      ')}
    </item>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.title}</title>
    <link>${siteConfig.url}/blog</link>
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
    <link href="${siteConfig.url}/blog/${post.slug}"/>
    <id>${siteConfig.url}/blog/${post.slug}</id>
    <updated>${new Date(post.date).toISOString()}</updated>
    <summary><![CDATA[${post.description}]]></summary>
    <author><name>${siteConfig.author.name}</name></author>
    ${post.tags.map(t => `<category term="${t}"/>`).join('\n    ')}
  </entry>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${siteConfig.title}</title>
  <link href="${siteConfig.url}/blog"/>
  <link href="${siteConfig.url}/atom.xml" rel="self"/>
  <id>${siteConfig.url}</id>
  <updated>${new Date().toISOString()}</updated>
  <author><name>${siteConfig.author.name}</name></author>
  <subtitle>${siteConfig.description}</subtitle>
  ${entries.join('\n')}
</feed>`;
}
