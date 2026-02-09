export type ResumeAutomationItem = {
  org: string;
  period: string;
  title: string;
  bullets: string[];
  linkLabel?: string;
  linkUrl?: string;
};

export const resumeAutomation: ResumeAutomationItem[] = [
  {
    org: '(주)베스텔라랩',
    period: '2025.08 - 진행 중',
    title: 'Event 기반 아키텍처와 Virtual Thread 최적화 프로젝트',
    bullets: [
      'Virtual Thread 기반 비동기 처리 및 JMH/JFR 성능 검증',
      'S3 Event + Lambda 자동 문서 처리 파이프라인 구축',
      'Markdown 변환 후 PGVector 임베딩, HTML 빌드 및 CDN 서빙',
      'Spring AI 기반 RAG 챗봇 구현',
    ],
  },
  {
    org: '(주)베스텔라랩',
    period: '2024.09 - 2024.12',
    title: 'AWS 기반 고가용성 아키텍처 및 CI/CD 파이프라인 구축',
    bullets: [
      'ALB/ASG 기반 고가용성 구성 및 Blue/Green 배포',
      'Artillery 부하 테스트로 타임아웃/실패율 개선',
      'AMI 프리베이크 + 캐시로 빌드 시간 30% 단축',
      'SonarCloud/JaCoCo 연동으로 코드 품질 개선',
    ],
  },
  {
    org: '(주)베스텔라랩',
    period: '2024.02 - 2024.03',
    title: '분산 환경 인증·인가 시스템 설계',
    bullets: [
      'Redis 기반 Refresh Token 관리 및 보안 옵션 강화',
      'Gateway 인가 최적화 및 RBAC 기반 접근 제어',
      'AOP 기반 서비스 내 인가 로직 구현',
      'Test Coverage 80%+, Code Smell 92.12% 감소',
    ],
  },
];
