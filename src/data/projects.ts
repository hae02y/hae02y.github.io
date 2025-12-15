export type ProjectDetail = {
  heading: string;
  body: string;
};

export type ProjectLink = {
  label: string;
  url: string;
  external?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  status?: string;
  detail: ProjectDetail[];
  links?: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: 'indoor-nav',
    title: 'Vision-AI Indoor Navigation',
    summary: '실내 정밀 측위 기반 주차 내비게이션 백엔드와 운영 도구 개발',
    tags: ['Spring Boot', 'JPA', 'AWS', 'Redis'],
    status: 'Active',
    detail: [
      { heading: '문제', body: 'GPS가 닿지 않는 주차장 환경에서 실시간 위치 보정과 다중 센서 데이터를 안정적으로 처리해야 함.' },
      { heading: '해결', body: 'Redis 캐시 + 비동기 파이프라인으로 지연을 200ms 이하로 유지하고, 주행 이벤트를 S3/Firehose로 적재해 사후 분석 자동화.' },
    ],
    links: [{ label: '아키텍처 노트', url: '/Insight/intro' }],
  },
  {
    slug: 'payment-refactor',
    title: 'Payment Flow Refactor',
    summary: '결제 승인/취소 동시성 이슈 해결 및 정산 배치 최적화',
    tags: ['Java', 'Spring Batch', 'MySQL', 'Kafka'],
    status: 'Active',
    detail: [
      { heading: '문제', body: '동시 취소/재승인으로 중복 정산과 실패 재시도 루프 발생.' },
      { heading: '해결', body: 'Idempotent 키로 이중 삽입 방지, SAGA 보상 트랜잭션 도입, 배치를 파티션/청크 단위로 분리해 재처리 가속.' },
    ],
    links: [{ label: '회고', url: '/blog' }],
  },
  {
    slug: '3d-playground',
    title: '3D Playground',
    summary: 'React Three로 인터랙티브한 WebGL 실험과 모션 스터디',
    tags: ['React', 'Three.js', 'R3F', 'Motion'],
    status: 'Lab',
    detail: [
      { heading: '아이디어', body: '실험적인 모션/3D UI를 통해 사용자 몰입감을 높이는 방법 탐색.' },
      { heading: '진행', body: '낙타 모델 회전, 터미널 인터랙션 등 실험 컴포넌트를 모듈화하여 메인 페이지에서 토글 가능하도록 설계.' },
    ],
    links: [{ label: 'GitHub', url: 'https://github.com/hae02y', external: true }],
  },
];

