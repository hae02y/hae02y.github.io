export type PortfolioItem = {
  title: string;
  summary: string;
  role: string;
  period: string;
  techStack: string;
  href: string;
  order: number;
};

export type PortfolioSection = {
  title: string;
  items: PortfolioItem[];
};

export const portfolioSections: PortfolioSection[] = [
  {
    title: '회사 프로젝트',
    items: [
      {
        title: '하이웍스 기반 채용 서비스',
        summary: '변경에 강한 채용 서비스 설계 및 운영 자동화.',
        role: 'Backend Engineer Intern',
        period: '2025.03 - 2025.05',
        techStack: 'Spring Boot, Java 17, MongoDB, Gradle',
        href: '/me/company_1',
        order: 202503,
      },
    ],
  },
  {
    title: '개인 프로젝트',
    items: [
      {
        title: 'AI 기반 CS 학습 플랫폼',
        summary: 'Event 기반 아키텍처와 Virtual Thread 최적화 적용.',
        role: 'Backend Engineer',
        period: '2025.08 - 진행 중',
        techStack: 'Spring, AWS, PGVector, RAG',
        href: '/me/personal_1',
        order: 202508,
      },
    ],
  },
];
