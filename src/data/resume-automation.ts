export type ResumeAutomationItem = {
  org: string;
  period: string;
  title: string;
  bullets?: string[];
  bulletGroups?: {
    title: string;
    bullets: string[];
  }[];
  techStack?: string;
  linkLabel?: string;
  linkUrl?: string;
};

export const resumeAutomation: ResumeAutomationItem[] = [
  {
    org: '(주)베스텔라랩',
    period: '2025.10 - 현재',
    title: '도면 데이터 변경 자동화 프로세스 구축',
    techStack: 'Java, Spring Boot, Spring Security, Mybatis, MySQL, Thymeleaf, NCP',
    bulletGroups: [
      {
        title: 'Figma 플러그인 기반 오류 검증 자동화',
        bullets: [
          '디자이너가 Figma로 작업한 도면을 데이터로 변환하는 과정에서 오류를 검증하는 플러그인을 설계·구현해 실무에 적용했고, 휴먼 에러 발생률을 평균 20%에서 0%로 감소시켰습니다.',
        ],
      },
      {
        title: '도면·내비게이션 데이터 검증 대시보드 구축',
        bullets: [
          '도면과 내비게이션 데이터의 등록 상태를 시각화해 확인할 수 있는 페이지를 설계·구현하여 비개발 인력도 가장 먼저 확인하는 내부 검증 화면을 구축했습니다.',
          '오류 인지 및 정상화까지 5일 이상 걸리던 프로세스를 5분으로 단축했습니다.',
        ],
      },
    ],
  },
  {
    org: '(주)베스텔라랩',
    period: '2025.10 - 현재',
    title: 'TIG 스택 기반 모니터링 프로세스 구축',
    techStack: 'Java, Spring Boot, Spring Security, Mybatis, MySQL, Thymeleaf, NCP',
    bullets: [
      'Telegraf + InfluxDB + Grafana 스택으로 모니터링 시스템을 구축했습니다.',
      '현장별 장애 상태를 파악할 수 있는 Infra Operation System을 설계하여 사내에서 운영하고 있습니다.',
    ],
  },
];
