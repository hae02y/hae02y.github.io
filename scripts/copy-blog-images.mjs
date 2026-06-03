/**
 * Copies blog post images from blog/ directories to public/blog/
 * so Next.js can serve them as static files.
 *
 * blog/2025-07-15-NKS구축/screen1.png → public/blog/2025-07-15-NKS구축/screen1.png
 */
import fs from 'fs';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'blog');
const PUBLIC_BLOG_DIR = path.join(process.cwd(), 'public', 'blog');

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.bmp', '.avif']);

function copyBlogImages() {
  if (!fs.existsSync(BLOG_DIR)) return;

  const dirs = fs.readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory());

  let count = 0;

  for (const dir of dirs) {
    const srcDir = path.join(BLOG_DIR, dir.name);
    const files = fs.readdirSync(srcDir);

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!IMAGE_EXTS.has(ext)) continue;

      const destDir = path.join(PUBLIC_BLOG_DIR, dir.name);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      const src = path.join(srcDir, file);
      const dest = path.join(destDir, file);
      fs.copyFileSync(src, dest);
      count++;
    }
  }

  console.log(`Copied ${count} blog images to public/blog/`);
}

copyBlogImages();
