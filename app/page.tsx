import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  alternates: {
    canonical: `${siteConfig.url}/`,
  },
};

export default function Home() {
  return (
    <>
      <section className="sr-only" aria-label="사이트 소개">
        <h1>정해영 백엔드 개발자 기술블로그</h1>
        <p>
          개발자 정해영(hae02y)의 기술 블로그입니다. Java, Spring Boot, AWS, Kubernetes, DevOps, 인프라, AI 개발 경험과 ABOUT, Portfolio를 기록합니다.
        </p>
        <nav aria-label="주요 페이지">
          <a href="/blog/">TECH</a>
          <a href="/Insight/">ESSAY</a>
          <a href="/about/">ABOUT</a>
        </nav>
      </section>
      <HomeClient />
    </>
  );
}
