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
          Java, Spring Boot, AWS, Kubernetes, DevOps, 인프라, AI 개발 경험을 기록하는 Hae02y Devlog입니다.
        </p>
        <nav aria-label="주요 페이지">
          <a href="/blog/">기술 블로그</a>
          <a href="/Insight/">인사이트</a>
          <a href="/me/">이력서와 포트폴리오</a>
        </nav>
      </section>
      <HomeClient />
    </>
  );
}
