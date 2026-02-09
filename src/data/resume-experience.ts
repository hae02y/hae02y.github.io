export type ExperienceProject = {
  title: string;
  summary?: string;
  bullets?: string[];
  techStack?: string;
  period?: string;
};

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  description?: string;
};

export const experienceItems: ExperienceItem[] = [
  {
    company: '(주)베스텔라랩',
    role: '선임연구원 · 백엔드 개발',
    period: '2024.01 - 재직중',
    description:
    ' Visoin-AI 기반 실내 정밀 측위 및 Non-GPS 주차 내비게이션 을 서비스하는 스마트 모빌리티 스타트업입니다.',
  },
  {
    company: '(주)조은기술',
    role: '주임 · 네트워크엔지니어',
    period: '2020.08 - 2023.04',
    description:
    '전국 50여 곳 이상의 지자체와 공공기관에 관제·스마트시티 솔루션을 공급해온 IT 전문기업입니다.',
  },
];
