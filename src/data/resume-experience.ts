export type ExperienceProject = {
  title: string;
  summary?: string;
  bullets?: string[];
  techStack?: string;
};

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  highlight?: string;
  projects: ExperienceProject[];
};

export const experienceItems: ExperienceItem[] = [
  {
    company: '베스텔라랩',
    role: '선임연구원 · 백엔드 개발',
    period: '2025.03 - 재직중',
    // highlight: '변경에 강한 채용 서비스 개발',
    projects: [
      {
        title: '모듈러 모놀리스 채용 서비스',
        summary: '하이웍스 기반 채용 서비스 개발 및 운영 자동화',
        bullets: [
          '모듈러 모놀리스 아키텍처 구현 및 실행 모듈 설계',
          'Port/Adapter 패턴과 Mapper로 도메인/영속성 분리',
        ],
        techStack:
          'Spring Boot 2.7, Java 17, Spring MVC, Spring Data Mongo, MongoDB, Gradle',
      },
      {
        title: '개인정보 삭제 스케줄러',
        summary: '분산 환경 동시 실행 문제를 해결한 배치 시스템',
        bullets: [
          'ShedLock 기반 동시 실행 제어 및 재시도 로깅',
          '청크 단위 재시도 로직으로 안정성·효율 개선',
        ],
        techStack: 'ShedLock, JWT',
      },
    ],
  },
  {
    company: '조은기술',
    role: '주임 · 네트워크엔지니어',
    period: '2025.03 - 2025.05 (3개월)',
    // highlight: '변경에 강한 채용 서비스 개발',
    projects: [
      {
        title: '모듈러 모놀리스 채용 서비스',
        summary: '하이웍스 기반 채용 서비스 개발 및 운영 자동화',
        bullets: [
          '모듈러 모놀리스 아키텍처 구현 및 실행 모듈 설계',
          'Port/Adapter 패턴과 Mapper로 도메인/영속성 분리',
        ],
        techStack:
          'Spring Boot 2.7, Java 17, Spring MVC, Spring Data Mongo, MongoDB, Gradle',
      },
      {
        title: '개인정보 삭제 스케줄러',
        summary: '분산 환경 동시 실행 문제를 해결한 배치 시스템',
        bullets: [
          'ShedLock 기반 동시 실행 제어 및 재시도 로깅',
          '청크 단위 재시도 로직으로 안정성·효율 개선',
        ],
        techStack: 'ShedLock, JWT',
      },
    ],
  },
];
