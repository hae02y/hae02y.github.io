import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type AboutLocale = 'ko' | 'en';

export type AboutContent = {
  title: string;
  description: string;
  content: string;
};

const ABOUT_DIR = path.join(process.cwd(), 'content', 'about');

export function getAboutContent(locale: AboutLocale): AboutContent {
  const filePath = path.join(ABOUT_DIR, `${locale}.md`);
  if (!fs.existsSync(filePath)) {
    return {
      title: locale === 'en' ? 'About Hae02y' : '정해영 소개',
      description: locale === 'en' ? 'Backend developer profile and works.' : '정해영 백엔드 개발자 소개와 작업 기록.',
      content: '',
    };
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    title: String(data.title || (locale === 'en' ? 'About Hae02y' : '정해영 소개')),
    description: String(data.description || (locale === 'en' ? 'Backend developer profile and works.' : '정해영 백엔드 개발자 소개와 작업 기록.')),
    content,
  };
}
