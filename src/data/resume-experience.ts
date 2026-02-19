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
    period: '2024.01 - 재직중',
    // highlight: '변경에 강한 채용 서비스 개발',
    projects: [
      {
        title: '백엔드 서비스 설계 및 핵심 비즈니스 로직 구현',
        // summary: '하이웍스 기반 채용 서비스 개발 및 운영 자동화',
        bullets: [
          'Redis, 메시지 큐 기반 캐시·이벤트 처리 도입으로 응답 속도 개선 및 DB 부하 최소화',
          '서비스별 독립 배포와 장애 격리를 위한 MSA 지향 백엔드 모듈화 및 API 설계',
          'JPA 기반 ORM 도입으로 기존 MyBatis 레거시를 개선해 유지보수성과 생산성 향상',
          'WebSocket, RTSP 등 실시간 데이터 처리 및 외부 장비 연동 API 개발로 고가용성 확보'
        ],
        techStack:
          'Java, Spring Boot, Spring Security, JPA, Mybatis, MySQL, MariaDB, MSSQL',
      },
      {
        title: '클라우드 기반 인프라 설계 구축 및 웹 프론트엔드 개발',
        // summary: '분산 환경 동시 실행 문제를 해결한 배치 시스템',
        bullets: [
          '클라우드 기반 인프라 설계 및 VPN, 도메인 연동과 CI/CD 파이프라인 구축으로 배포 효율화',
          'NKS 기반 쿠버네티스 클러스터 환경 구성 및 사설 레지스트리를 통한 컨테이너 운영 자동화',
          'React, MUI 중심의 컴포넌트 기반 개발로 레거시 jQuery 코드베이스를 모던 아키텍처로 전환',
          '데이터 시각화와 반응형 UI 고도화로 사용자 경험 개선 및 다국어 전환 시스템 구현'        ],
        techStack: 'Docker, Kubernetes, CI/CD, Nginx, React, JavaScript, TypeScript, Redux, TailwindCSS',
      },
    ],
  },
  {
    company: '조은기술',
    role: '주임 · 네트워크엔지니어',
    period: '2020.08 - 2023.04',
    // highlight: '변경에 강한 채용 서비스 개발',
    projects: [
      {
        title: '통합관제센터 데이터센터 네트워크 구축 및 운영',
        summary: '하이웍스 기반 채용 서비스 개발 및 운영 자동화',
        bullets: [
          '논산시청 통합관제센터 데이터센터 내 서버 및 네트워크 인프라 전담 구축 및 운영',
          '논산시청 통합관제센터 1Gbps 폐쇄망을 10Gbps로 업그레이드하여 영상 스트리밍 품질 및 응답성 3배 이상 향상',
          'Cisco L3/L2 스위치, XGate VPN, AhnLab 방화벽 등 주요 네트워크 장비 운용 및 보안 정책 관리',
          '방화벽 설정, 포트 트래픽 관리, 장애 이력 기록 등 전반적인 인프라 보안 및 관리 표준 수립'
        ],
        techStack:
          'Linux, Cisco Switch, Firewall, VPN, Storage, Hyper-V',
      },
    ],
  },
];
