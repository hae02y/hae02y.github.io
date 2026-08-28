export type BulletGroup = {
  title: string;
  bullets: string[];
};

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  description?: string;
};

export type ResumeProject = {
  org: string;
  period: string;
  title: string;
  bullets?: string[];
  bulletGroups?: BulletGroup[];
  techStack?: string;
  linkLabel?: string;
  linkUrl?: string;
};

export type ActivityItem = {
  title: string;
  subtitle?: string;
  bullets?: string[];
  bulletGroups?: BulletGroup[];
  tags?: string[];
};

export type EducationItem = {
  school: string;
  program: string;
  period: string;
};

export type CertificationItem = {
  name: string;
  issuer: string;
  date: string;
};

export type ResumeLink = {
  label: string;
  url: string;
  icon?: 'github' | 'blog' | 'medium' | 'link' | 'email' | 'linkedIn';
};

export type PortfolioProjectConfig = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  techStack: string;
  category?: string;
  start?: string;
  end?: string;
  href?: string;
  details?: BulletGroup[];
};

export type PortfolioCompanyConfig = {
  id: string;
  order: number;
  company: string;
  period: string;
  role?: string;
  summary?: string;
  projects: PortfolioProjectConfig[];
};

export const meConfig = {
  profile: {
    name: '정해영',
    email: 'godud1118@gmail.com',
    summary: [
      '정해영(hae02y)은 Java와 Spring Boot를 중심으로 백엔드 시스템을 설계하고 운영해온 백엔드 개발자입니다.',
      'AWS, NCP, Docker, Kubernetes 기반 인프라와 DevOps 환경에서 API 개발, 데이터 처리, 배포 자동화, 운영 안정화 경험을 쌓아왔습니다.',
      '실무에 적용 가능한 AI 기술과 백엔드/인프라 전반을 함께 다루며, 문제의 본질을 이해하고 구조적으로 해결하는 개발을 지향합니다.',
    ],
  },
  resume: {
    experiences: [
      {
        company: '(주)맨인블록',
        role: '선임연구원 · 백엔드/AI 개발',
        period: '2026.03 - 재직중',
        description: 'MENINBLOX는 의료 특화 LLM MediKoGPT와 초개인화 운동 관리 플랫폼 Ailix를 기반으로 의료 행정 자동화와 글로벌 헬스케어 서비스를 확장하는 의료 AI 스타트업입니다.',
      },
      {
        company: '(주)베스텔라랩',
        role: '선임연구원 · 백엔드 개발',
        period: '2024.01 - 2026.03',
        description: 'Vision-AI 기반 실내 정밀 측위 및 Non-GPS 주차 내비게이션을 서비스하는 스마트 모빌리티 스타트업입니다.',
      },
      {
        company: '(주)조은기술',
        role: '주임 · 네트워크엔지니어',
        period: '2020.08 - 2023.04',
        description: '전국 50여 곳 이상의 지자체와 공공기관에 관제·스마트시티 솔루션을 공급해온 IT 전문기업입니다.',
      },
    ] satisfies ExperienceItem[],
    projects: [
      {
        org: '(주)베스텔라랩',
        period: '2024.05 - 현재',
        title: '워치마일(주차내비게이션) 서비스 백엔드 개발',
        techStack: 'Java, Spring Boot, Spring Security, Mybatis, MySQL, Thymeleaf, NCP',
        bulletGroups: [
          {
            title: '워치마일 서비스 백엔드 팀 리딩',
            bullets: [
              '통합워치마일 도입 및 확산 과정에서 백엔드 표준 개발 프로세스를 수립하고 아키텍처·배포·운영 가이드를 문서화하여, 비개발 인력(인턴 포함)도 기능 확장 및 운영 대응이 가능하도록 온보딩 기간을 평균 50% 이상 단축하였습니다.',
              '프로젝트 전반 아키텍처 설계, 도메인 모델링, 배포 전략 수립을 주도하고, 운영 중 발생한 장애·성능 이슈를 RCA(근본 원인 분석) 기반으로 체계화하여 재발률을 60% 이상 감소시켰습니다.',
              '주차장 차단기(Barrier Gate) 장비와의 연동을 설계·구현하여 차량 입·출차 이벤트 발생 시 FCM 기반 푸시 알림을 실시간으로 전송하는 이벤트 처리 구조를 구축하고, 현장 관제 반응 시간을 평균 3초 이내로 단축하였습니다.',
              '실시간 AI 영상분석 데이터 수집 과정에서 발생하는 동시성 및 트래픽 급증 문제를 해결하기 위해 RabbitMQ 기반 메시지 큐 아키텍처를 도입하고, 장비 데이터 수신과 비즈니스 처리 로직을 분리하여 피크 시간대 처리 안정성을 확보하였습니다.',
              '모든 외부·내부 연계 API를 OpenAPI 3.0 규격에 맞춰 설계하고 Swagger 기반 문서화를 적용하여, 계약·대외기관 제출 및 협력사 연동 시 명확한 인터페이스 표준을 제공하였습니다.',
            ],
          },
          {
            title: '레거시 워치마일 서비스 마이그레이션',
            bullets: [
              '현장별로 분산되어 운영되던 구조를 통합된 백엔드 구조로 설계·적용했습니다.',
              '실시간 상태 갱신과 트래픽 특성을 고려해 동기 처리와 비동기 처리 흐름을 분리하고, 조회 API와 상태 반영 로직을 명확히 분리해 대용량 트래픽 상황에서도 안정적인 응답을 제공하도록 개선했습니다.',
            ],
          },
          {
            title: '컨테이너 기반 배포 전략 및 CI/CD 구축',
            bullets: [
              'EC2 직접 접속 기반의 수동 배포로 인한 지연 및 휴먼에러 문제를 개선하기 위해 Jenkins를 구축하고 GitLab과 연동한 CI/CD 파이프라인을 설계·적용하여, 배포 리드타임을 dev 평균 20분 → 10분, prod 평균 25분 → 11분으로 단축했습니다.',
              '분산된 서비스 구조를 Docker-compose 기반 단일 스택으로 표준화하고, Traefik 기반 리버스 프록시 아키텍처를 설계하여 배포·롤백 프로세스를 단순화했습니다. 이를 통해 환경 간 설정 불일치와 수동 운영 과정에서 발생하던 문제를 구조적으로 제거했습니다.',
            ],
          },
        ],
      },
      {
        org: '(주)베스텔라랩',
        period: '2025.06 - 현재',
        title: 'MLOps',
        techStack: 'Java, Spring Boot, Spring Security, Mybatis, MySQL, Thymeleaf, NCP',
        bulletGroups: [
          {
            title: '주차업체 통합 API 전환',
            bullets: ['5개 주차업체별로 분산되어 있던 DB프로시저 직접연동 방식에서 단일 통합 API 게이트웨이 구조로 표준화하고, 공통 도메인 모델을 설계하여 확장성과 유지보수성을 확보했습니다.'],
          },
          {
            title: '클라우드 전환',
            bullets: ['기존 On-Premise로 사용되던 서비스를 NCP 기반 NKS로 전환했습니다.'],
          },
          {
            title: '주차 관제 관리자 및 대민 서비스 개발',
            bullets: [
              '현장별로 분산되어 운영되던 구조를 통합된 백엔드 구조로 설계·적용했습니다.',
              '실시간 상태 갱신과 트래픽 특성을 고려해 동기 처리와 비동기 처리 흐름을 분리하고, 조회 API와 상태 반영 로직을 명확히 분리해 대용량 트래픽 상황에서도 안정적인 응답을 제공하도록 개선했습니다.',
            ],
          },
        ],
      },
      {
        org: '(주)베스텔라랩',
        period: '2024.09 - 2025.01',
        title: '아이코딩톡벗(디지털교과서) 백엔드 개발',
        techStack: 'Java, Spring Boot, Spring Security, Mybatis, MySQL, Thymeleaf, NCP',
        bullets: [
          'JWT 기반 인증/인가 로직과 사용자 세션 상태 관리, 공통 유틸리티 모듈을 설계·구현했습니다.',
          'WebSocket 기반 실시간 퀴즈 진행 로직과 참여자 브로드캐스트 처리 로직을 개발했습니다.',
          '공통 계정 관리 REST API와 R2DBC 기반 비동기 DB 연동을 모듈화하고 트랜잭션을 최적화했습니다.',
          'Nexus3 + Bitbucket Pipeline을 활용해 NCP 쿠버네티스 환경 자동 배포 파이프라인을 구축했습니다.',
          '서비스별 독립 Spring Boot 애플리케이션 모듈화와 MSA 지향 아키텍처를 설계·적용했습니다.',
        ],
      },
      {
        org: '(주)베스텔라랩',
        period: '2024.01 - 2024.06',
        title: '파크옵스(주차장 모니터링) 대시보드 개발',
        techStack: 'Java, Spring Boot, Spring Security, Mybatis, MySQL, Thymeleaf, NCP',
        bullets: [
          'GS 인증 요구사항을 프론트엔드 관점에서 분석·해석하고, 접근성(WA)·보안·기능적합성 항목을 충족하도록 UI 구조와 렌더링 방식을 전면 재설계했습니다.',
          '다국어(i18n) 아키텍처를 설계·구축하여 한국어/영어/일본어/중국어/독일어 등 5개국 로케일을 지원하도록 번역 리소스와 키 구조를 표준화했고, lazy load 적용으로 초기 로딩 리소스 사용량을 약 30% 절감했습니다.',
          '통계 대시보드 UI를 구현하여 ApexCharts 기반 시각화와 DataGrid를 결합해 점유율·회전율·체류시간 등 핵심 운영 지표를 정확히 표출했으며, 운영자가 통계 화면을 통해 의사결정에 소요하는 시간을 체감 기준 약 40% 이상 단축했습니다.',
          'FFmpeg 기반 CCTV 스트리밍 서버를 구현하여 RTSP 영상을 HLS(.m3u8)로 변환·중계함으로써 다중 클라이언트 환경에서도 안정적인 실시간 영상 제공이 가능하도록 구성했고, 관제 대시보드에서의 영상 지연 및 재연결 이슈를 운영 허용 범위 내로 안정화했습니다.',
        ],
      },
    ] satisfies ResumeProject[],
    automation: [
      {
        org: '(주)베스텔라랩',
        period: '2025.10 - 현재',
        title: '도면 데이터 변경 자동화 프로세스 구축',
        techStack: 'Java, Spring Boot, Spring Security, Mybatis, MySQL, Thymeleaf, NCP',
        bulletGroups: [
          {
            title: 'Figma 플러그인 기반 오류 검증 자동화',
            bullets: ['디자이너가 Figma로 작업한 도면을 데이터로 변환하는 과정에서 오류를 검증하는 플러그인을 설계·구현해 실무에 적용했고, 휴먼 에러 발생률을 평균 20%에서 0%로 감소시켰습니다.'],
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
    ] satisfies ResumeProject[],
    activities: [
      {
        title: 'Codestates Software Developer 부트캠프',
        tags: ['부트캠프'],
        bulletGroups: [
          {
            title: '부트캠프 수료',
            bullets: ['JAVA, Spring 기반 객체 지향 프로그래밍 학습 및 회고 작성', '알고리즘 문제 풀이와 수행 과제 및 페어 프로그래밍, 코드 리뷰 경험'],
          },
        ],
      },
      {
        title: '오픈소스 활동',
        tags: ['오픈소스'],
        bulletGroups: [
          {
            title: 'Google A2A',
            bullets: ['Google A2A(a2a-java) listTasks status wire string 처리 버그 수정 기여 [PR #578](https://github.com/a2aproject/a2a-java/pull/578)'],
          },
        ],
      },
      {
        title: '스터디 활동',
        tags: ['스터디'],
        bulletGroups: [
          {
            title: '스터디 참여',
            bullets: [
              '[베스텔라랩 개발자 스터디 참여](https://blog.hae02y.me/blog/makeblog2) | 베스텔라랩 사내 개발자들 참여 인사이트 공유 및 주 1회 블로깅 피드백 진행',
              '[Java Algorithm 스터디 운영](https://github.com/hae02y/CS_Studdiinngg) | 백준, 프로그래머스 Java 언어 기반 알고리즘 문제 풀이 및 피드백 진행',
              '[Computer Science 스터디 참여](https://github.com/hae02y/CS_Studdiinngg) | CS 기초 지식 및 개발 지식 향상을 위한 스터디 참여',
            ],
          },
        ],
      },
      {
        title: '블로그 활동',
        tags: ['블로그'],
        bulletGroups: [
          {
            title: '블로그 운영',
            bullets: [
              'Docusaurus + Obsidian 기반 [개발 기술 블로그](https://blog.hae02y.me/)를 구성하고, 기술 콘텐츠를 운영했습니다.',
              '누적 23만 방문 [IT 기술 블로그](https://togll.tistory.com/)를 운영하고있습니다. 네트워크엔지니어로 근무 하면서부터 글쓰기/정리를 꾸준히 했습니다.',
              '[브런치스토리](https://brunch.co.kr/@hae02y) 작가로 활동하며, 개발과 일상을 주제로 에세이를 연재하고 있습니다.',
            ],
          },
        ],
      },
      {
        title: '사이드 프로젝트',
        tags: ['프로젝트'],
        bulletGroups: [
          {
            title: '사이드 프로젝트 진행',
            bullets: ['다양한 사이드 프로젝트 진행'],
          },
        ],
      },
    ] satisfies ActivityItem[],
    education: [
      { school: '한양대학교 인공지능 융합대학원', program: '인공지능융합전공 재학 · 석사', period: '2026.03 - 2028.02' },
      { school: '한국 방송통신대학교', program: '컴퓨터과학과 졸업 · 학사', period: '2021.03 - 2023.08' },
      { school: '대전 대덕대학교', program: '컴퓨터공학과 졸업 · 전문학사', period: '2019.03 - 2021.02' },
    ] satisfies EducationItem[],
    certifications: [
      { name: '정보처리기사', issuer: '한국산업인력공단', date: '2023.06' },
      { name: 'SQLD', issuer: '한국데이터산업진흥원', date: '2022.09' },
      { name: 'ADsP', issuer: '한국데이터산업진흥원', date: '2022.11' },
      { name: '네트워크관리사2급', issuer: '한국정보통신자격협회', date: '2022.04' },
      { name: '리눅스마스터 2급', issuer: '정보통신기술자격검정', date: '2020.07' },
      { name: '컴퓨터활용능력 2급', issuer: '대한상공회의소', date: '2019.10' },
    ] satisfies CertificationItem[],
    links: [
      { label: 'GitHub', url: 'https://github.com/hae02y', icon: 'github' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/hae02y', icon: 'linkedIn' },
      { label: '기술블로그', url: 'https://blog.hae02y.me/', icon: 'blog' },
    ] satisfies ResumeLink[],
  },
  portfolio: {
    companies: [
      {
        id: 'meninblox',
        order: 0,
        company: '맨인블록',
        period: '2026-03 ~ 현재',
        role: '선임연구원 · 백엔드/AI 개발',
        summary: 'MENINBLOX는 의료 특화 LLM MediKoGPT와 초개인화 운동 관리 플랫폼 Ailix를 기반으로 의료 행정 자동화와 글로벌 헬스케어 서비스를 확장하는 의료 AI 스타트업입니다.',
        projects: [],
      },
      {
        id: 'vestellalab',
        order: 1,
        company: '베스텔라랩',
        period: '2024-01 ~ 현재',
        role: '선임연구원 · 백엔드 개발',
        summary: 'Vision-AI 기반 실내 정밀 측위 및 Non-GPS 주차 내비게이션을 서비스하는 스마트 모빌리티 스타트업입니다.',
        projects: [
          {
            slug: 'ansan-parking-system',
            title: '안산도시공사 MLOps 개발',
            summary: '클린 아키텍처 기반 멀티모듈 전환과 비동기 처리 구조를 도입해 확장성과 운영 안정성을 강화했습니다.',
            role: 'Backend 설계 및 개발',
            techStack: 'Java, Spring Boot, Spring Security, MyBatis, MySQL, Thymeleaf, NCP, Kubernetes, GitHub Actions',
            category: 'AI / MLOps',
            start: '2025-10',
            end: 'present',
            details: [
              {
                title: 'Summary',
                bullets: [
                  '도메인 분리 기반 멀티모듈 아키텍처로 중복 코드 제거 및 확장성을 높였습니다.',
                  '비동기, 배치, 메시지 큐 구조로 트래픽 대응력과 처리 안정성을 강화했습니다.',
                ],
              },
              {
                title: 'Highlights',
                bullets: [
                  'Spring Security 인증/인가 구조를 재정립해 API 보안 수준을 강화했습니다.',
                  'JPA 도입으로 MyBatis 레거시를 개선하고 유지보수성을 높였습니다.',
                  'CI/CD 자동화로 배포 안정성과 운영 효율성을 개선했습니다.',
                ],
              },
              {
                title: 'Impact',
                bullets: ['영상분석 AI 연동 결과 반영률 100% 증가', '서비스 안정성 기반으로 DAU 지속 상승'],
              },
            ],
          },
          {
            slug: 'watchmile-backend-ops',
            title: '워치마일(주차내비게이션) 서비스 백엔드 개발',
            summary: '온프레미스/PHP 레거시를 AWS 기반 클라우드 아키텍처로 마이그레이션하며 표준 API와 운영 대시보드를 구축했습니다.',
            role: 'Backend 설계 및 개발',
            techStack: 'Java, Spring Boot, Spring Security, MyBatis, MySQL, Thymeleaf, Python, FastAPI, AWS',
            category: 'Backend / Infra',
            start: '2024-06',
            end: 'present',
            details: [
              {
                title: 'Summary',
                bullets: ['온프레미스/레거시 워치마일 서비스를 클라우드 기반으로 전환했습니다.', '외부 주차 관제 업체 및 파트너 연동 API를 표준화했습니다.'],
              },
              {
                title: 'Highlights',
                bullets: ['JWT 기반 인증 적용 및 RESTful API 설계/문서화', '운영사 전용 배포 대시보드 설계 및 구현', 'FCM 기반 실시간 푸시 알림 서비스 구축', '신규 현장 도면 데이터 표준화 및 DB 적재 프로세스 개선'],
              },
              {
                title: 'Impact',
                bullets: ['배포 리드타임 60일에서 14일로 단축'],
              },
            ],
          },
          {
            slug: 'icoding-talkbot-textbook',
            title: '아이코딩 톡벗(디지털 교과서) 백엔드 개발',
            summary: '실시간 퀴즈와 계정 관리 기능을 갖춘 디지털 교과서 백엔드/프론트 구조를 설계했습니다.',
            role: 'Backend 설계 및 개발',
            techStack: 'Java, Spring Boot, Spring Security, JPA, MySQL, MyBatis, TypeScript, React, Zustand, TanStack Query, Docker, NCP',
            category: 'Product / Service',
            start: '2024-09',
            end: '2025-01',
            details: [
              {
                title: 'Summary',
                bullets: ['인증/인가와 실시간 퀴즈 진행 로직을 포함한 백엔드 아키텍처를 구축했습니다.', '서비스별 독립 모듈화로 확장 가능한 구조를 설계했습니다.'],
              },
              {
                title: 'Highlights',
                bullets: ['JWT 기반 인증/인가 및 세션 상태 관리 모듈 구현', 'WebSocket 기반 퀴즈 진행/브로드캐스트 로직 개발', 'R2DBC 비동기 DB 연동 모듈화 및 트랜잭션 최적화', 'NCP Kubernetes 환경 자동 배포 파이프라인 구축'],
              },
              {
                title: 'Impact',
                bullets: ['K-PaaS 클라우드 서비스 확인제 인증 통과'],
              },
            ],
          },
          {
            slug: 'la-joes-auto-park-poc',
            title: '도면 데이터 변경 자동화 프로세스 구축',
            summary: 'LPR/스트리밍 데이터를 결합한 주차 관제 대시보드를 구축해 실시간 운영 시나리오를 검증했습니다.',
            role: 'Backend 설계 및 개발 · Web Frontend 개발',
            techStack: 'Java, Spring Boot, MySQL, JavaScript, jQuery, Bootstrap, Hls.js, Nginx, FFmpeg',
            category: 'Operations / Process',
            start: '2024-02',
            end: '2024-06',
            details: [
              {
                title: 'Summary',
                bullets: ['SVG 기반 도면 시각화와 실시간 스트리밍 통합 관제 UI를 구현했습니다.', 'CCTV 스트림 안정성을 위한 변환/복구 로직을 설계했습니다.'],
              },
              {
                title: 'Highlights',
                bullets: ['주차 슬롯과 Spot ID 매핑 및 JSON 실시간 반영', '차량 입출차 이력/번호판 메타데이터 테이블 및 팝업 구성', 'HLS.js 기반 스트리밍 재생 안정화 및 오류 복구 처리', 'RTSP에서 HLS로 변환하는 서버 및 Failover 로직 구현'],
              },
              {
                title: 'Impact',
                bullets: ['LPR + 스트리밍 통합 관제 PoC 사례 확보'],
              },
            ],
          },
          {
            slug: 'parkops-dashboard-i18n',
            title: '파크옵스(다국화 주차장 모니터링) 대시보드 개발',
            summary: 'SVG 기반 도면과 다국어 전환을 지원하는 관제 대시보드를 구축해 사용자 경험을 고도화했습니다.',
            role: 'Web Frontend 설계 및 개발',
            techStack: 'React, TypeScript, Axios, TailwindCSS, Redux, Nginx, MySQL, Directus',
            category: 'Product / Frontend',
            start: '2024-04',
            end: '2024-10',
            details: [
              {
                title: 'Summary',
                bullets: ['SVG 기반 주차 도면 시각화 및 상태 모니터링 UI를 구현했습니다.', '다국어 전환과 리소스 lazy load 국제화 시스템을 구축했습니다.'],
              },
              {
                title: 'Highlights',
                bullets: ['Role 기반 메뉴/화면 접근 제어 및 상태 관리 로직 구현', 'Directus API 쿼리 빌더와 인증 토큰 인터셉터 개발', '웹 접근성/보안 헤더/시맨틱 마크업 개선'],
              },
              {
                title: 'Impact',
                bullets: ['GS 인증 1등급 획득'],
              },
            ],
          },
        ],
      },
      {
        id: 'joeun-technology',
        order: 2,
        company: '조은기술',
        period: '2020-08 ~ 2023-04',
        role: '주임 · 네트워크엔지니어',
        summary: '전국 지자체와 공공기관에 관제·스마트시티 솔루션을 공급해온 IT 전문기업입니다.',
        projects: [
          {
            slug: 'noc-datacenter-ops',
            title: '통합관제센터 데이터센터 구축 및 운영',
            summary: '지자체 관제센터의 서버/네트워크 인프라를 구축하고 안정적인 운영 환경을 마련했습니다.',
            role: 'Network Engineer',
            techStack: 'Linux, Cisco Switch, Firewall, VPN, Storage, Hyper-V',
            category: 'Infrastructure / Operations',
            start: '2020-08',
            end: '2023-04',
            details: [
              {
                title: 'Summary',
                bullets: ['전국 지자체/공공기관 관제센터 데이터센터 구축 및 운영을 담당했습니다.', '핵심 네트워크 장비 운용과 보안 정책 관리를 수행했습니다.'],
              },
              {
                title: 'Highlights',
                bullets: ['논산시청 통합관제센터 서버/네트워크 인프라 구축', 'Cisco L3/L2 스위치 및 방화벽 운영', '장애 이력 기록 및 운영 표준 수립'],
              },
            ],
          },
          {
            slug: 'network-upgrade-10g',
            title: '통합관제센터 10Gbps 네트워크 업그레이드',
            summary: '1Gbps 폐쇄망을 10Gbps로 업그레이드하여 스트리밍 품질과 응답성을 크게 개선했습니다.',
            role: 'Network Engineer',
            techStack: 'Cisco L3/L2 Switch, VPN, Firewall',
            category: 'Infrastructure / Operations',
            start: '2022-01',
            end: '2022-06',
            details: [
              {
                title: 'Summary',
                bullets: ['관제센터 네트워크 대역폭 업그레이드를 설계하고 구축했습니다.', '스트리밍 품질과 응답성 향상을 위한 네트워크 튜닝을 수행했습니다.'],
              },
              {
                title: 'Highlights',
                bullets: ['1Gbps에서 10Gbps로 업그레이드하여 영상 스트리밍 품질과 응답성을 개선했습니다.', '장비 구성 및 운영 정책을 정비해 안정적인 서비스 제공 기반을 마련했습니다.'],
              },
            ],
          },
          {
            slug: 'security-ops-standard',
            title: '네트워크 보안 정책 및 운영 표준화',
            summary: '방화벽 정책과 트래픽 관리 표준을 수립해 보안 운영 품질을 높였습니다.',
            role: 'Network Engineer',
            techStack: 'Firewall, VPN, Cisco, Linux',
            category: 'Security / Operations',
            start: '2021-01',
            end: '2023-04',
            details: [
              {
                title: 'Summary',
                bullets: ['네트워크 보안 정책 수립 및 운영 프로세스 정비를 수행했습니다.', '장애/보안 이력 관리 체계를 정착시켰습니다.'],
              },
              {
                title: 'Highlights',
                bullets: ['방화벽 설정 및 포트 트래픽 관리 표준 수립', '주요 장비 운용 정책 정리 및 보안 운영 기록 정착'],
              },
            ],
          },
        ],
      },
    ] satisfies PortfolioCompanyConfig[],
    solo: [
      {
        slug: 'yeosu-bike-trip',
        title: '여수로 - 자전거와 함께 떠나는 여수 여행',
        summary: '여수 여행 추천 서비스를 개발하며 핵심 백엔드 로직과 성능 개선을 수행했습니다.',
        role: 'Side Project',
        techStack: 'Java, Spring Boot, Spring Security, JPA, PostgreSQL, Docker, AWS',
        category: 'Product / Service',
        start: '2024-03',
        end: '2024-07',
        details: [
          {
            title: 'Summary',
            bullets: ['한국관광공사 공모전 참가용 여행 추천 서비스 백엔드를 설계했습니다.'],
          },
          {
            title: 'Highlights',
            bullets: ['여정 추천, 미션 경험치 등 핵심 비즈니스 로직 구현', 'S3 이미지 처리 및 성능 개선'],
          },
        ],
      },
      {
        slug: 'jandi-garden',
        title: '잔디정원 - 당신도 GitHub 정원사',
        summary: 'SSR 기반 커뮤니티 서비스 MVP를 구축하고 Kotlin 전환과 데이터 마이그레이션을 진행했습니다.',
        role: 'Side Project',
        techStack: 'Kotlin, Java, Spring Boot, Spring Security, JPA, MySQL, Thymeleaf',
        category: 'Product / Service',
        start: '2025-03',
        end: 'present',
        details: [
          {
            title: 'Summary',
            bullets: ['커뮤니티 운영을 위한 SSR 웹 서비스 백엔드를 설계하고 MVP를 구현했습니다.'],
          },
          {
            title: 'Highlights',
            bullets: ['REST API 기반 Kotlin 전환 및 데이터베이스 마이그레이션', '핵심 도메인 설계 및 인증/인가 구조 구현'],
          },
        ],
      },
      {
        slug: 'studyground',
        title: '스터디그라운드 - 자격증 조회',
        summary: '공공 API 기반 자격증 정보와 커뮤니티를 결합한 서비스의 데이터 파이프라인을 구축했습니다.',
        role: 'Side Project',
        techStack: 'Java, Spring Boot, Spring Security, JPA, Spring Batch, MySQL, AWS',
        category: 'Data / Service',
        start: '2023-09',
        end: '2023-10',
        details: [
          {
            title: 'Summary',
            bullets: ['자격증 정보, 일정, 커뮤니티 기능을 결합한 서비스를 설계했습니다.'],
          },
          {
            title: 'Highlights',
            bullets: ['외부 API 트래픽을 고려한 Batch 설계', '북마크/검색 성능 최적화 및 CI/CD 자동화'],
          },
        ],
      },
      {
        slug: 'togedog',
        title: '투게독 - 당신의 반려견과 함께',
        summary: '반려동물 SNS 서비스의 인증/회원 도메인과 배포 구조를 설계했습니다.',
        role: 'Side Project',
        techStack: 'Java, Spring Boot, Spring Security, JPA, MySQL, Redis, Docker, AWS',
        category: 'Product / Service',
        start: '2023-10',
        end: '2023-12',
        details: [
          {
            title: 'Summary',
            bullets: ['반려동물 기록/공유 SNS의 핵심 백엔드 로직을 구현했습니다.'],
          },
          {
            title: 'Highlights',
            bullets: ['JWT · OAuth2 기반 인증 및 회원 API 구축', 'S3 이미지 처리 및 CI/CD 자동화 적용'],
          },
        ],
      },
      {
        slug: 'digital-drawing-tool',
        title: '디지털 도면 시각화 Tool',
        summary: '주차장 도면과 요소를 실시간 시각화하는 내부 도구를 단독 개발했습니다.',
        role: 'Side Project',
        techStack: 'JavaScript, Thymeleaf, jQuery, Java, Spring Boot',
        category: 'Automation / Internal Tool',
        start: '2025-01',
        end: '2025-03',
        details: [
          {
            title: 'Summary',
            bullets: ['도면 데이터 검증을 위한 시각화 도구를 설계하고 구현했습니다.'],
          },
          {
            title: 'Highlights',
            bullets: ['실시간 도면 렌더링으로 데이터 품질 검증 효율 향상', '사내 업무에 적용해 도면 검증 프로세스 개선'],
          },
        ],
      },
    ] satisfies PortfolioProjectConfig[],
  },
};
