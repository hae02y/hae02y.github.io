export type ActivityItem = {
  title: string;
  subtitle?: string;
  bullets?: string[];
  tags?: string[];
};

export const activityItems: ActivityItem[] = [
  {
    title: 'Codestates Software Developer 부트캠프',
    subtitle: '부트캠프 수료',
    tags: ['부트캠프'],
    bullets: [
      'StringBuffer -> StringBuilder 전환, try-with-resources 적용',
      'Pull Request: [읽기 로직 개선 #102](https://github.com/org/repo/pull/102), [코드 스타일 개선 #104](https://github.com/org/repo/pull/104)',
    ],
  },
  {
    title: '오픈소스 기여',
    subtitle: '오픈소스 기여',
    tags: ['오픈소스'],
    bullets: [
      'ForkJoinPool/ParallelStream 기반 병렬 처리 도입',
      'Pull Request: [Parallel Letter Frequency #2863](https://github.com/org/repo/pull/2863)',
    ],
  },
  {
    title: '스터디 활동',
    subtitle: '잔디정원 스터디',
    tags: ['스터디'],
    bullets: [
      'ForkJoinPool/ParallelStream 기반 병렬 처리 도입',
      'Pull Request: [Parallel Letter Frequency #2863](https://github.com/org/repo/pull/2863)',
    ],
  },
  {
    title: '블로그 활동',
    subtitle: '잔디정원 스터디',
    tags: ['스터디'],
    bullets: [
      'ForkJoinPool/ParallelStream 기반 병렬 처리 도입',
      'Pull Request: [Parallel Letter Frequency #2863](https://github.com/org/repo/pull/2863)',
    ],
  },
];
